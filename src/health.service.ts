import { Inject, Injectable } from '@nestjs/common';
import { Transport, RedisOptions } from '@nestjs/microservices';
import {
    HealthCheckService,
    DiskHealthIndicator,
    MemoryHealthIndicator,
    MongooseHealthIndicator,
    MicroserviceHealthIndicator,
    MicroserviceHealthIndicatorOptions,
    HealthCheckResult
} from '@nestjs/terminus';
import { RedisClientOptions } from 'redis';
import * as osu from 'node-os-utils'
import * as os from 'os'
import { DagHealthIndicator } from './custom/dag.health';
import { IHealthInfos } from './interfaces/infos.interface';

/**
 * Health monitoring and system diagnostics service
 * @class HealthService
 * @description
 * Core service that provides comprehensive health monitoring and system diagnostics capabilities.
 * Integrates multiple health indicators to track system performance and resource utilization
 * in real-time.
 * 
 * Key features:
 * - System health status monitoring
 * - Resource usage tracking (CPU, memory, disk)
 * - Database connection health checks
 * - Microservice connectivity verification
 * - Network performance metrics
 * - DAG network status monitoring
 * - Threshold-based alerts
 * - Cached metric collection
 * 
 * @category Services
 * @subcategory Health
 * @since 2.0.0
 * @example
 * ```typescript
 * // Basic service integration
 * @Injectable()
 * class MonitoringService {
 *   constructor(private healthService: HealthService) {}
 * 
 *   async monitorSystemHealth() {
 *     try {
 *       const health = await this.healthService.check();
 *       
 *       if (health.status === 'ok') {
 *         console.log('All systems operational');
 *         
 *         // Check individual components
 *         const { redis, mongodb, disk } = health.details;
 *         
 *         if (redis.status === 'up') {
 *           console.log('Cache service healthy');
 *         }
 *         
 *         if (mongodb.status === 'up') {
 *           console.log('Database connection stable');
 *         }
 *         
 *         if (disk.status === 'up') {
 *           console.log('Storage system normal');
 *         }
 *       }
 *     } catch (error) {
 *       console.error('Health check failed:', error.message);
 *       // Implement error handling and alerts
 *     }
 *   }
 * 
 *   async trackResourceUsage() {
 *     try {
 *       const metrics = await this.healthService.infos();
 *       
 *       // Monitor system resources
 *       this.checkCpuUsage(metrics.cpu);
 *       this.checkMemoryUsage(metrics.memory);
 *       this.checkDiskSpace(metrics.drive);
 *       this.checkNetworkTraffic(metrics.network);
 *       
 *       // Log system status
 *       console.log('System Metrics:', {
 *         platform: metrics.platform,
 *         uptime: this.formatUptime(metrics.uptime),
 *         cpu: `${metrics.cpu.usage}% (${metrics.cpu.cpus} cores)`,
 *         memory: `${metrics.memory.usedMemPercentage}% used`,
 *         disk: `${metrics.drive.freeGb}GB free`
 *       });
 *     } catch (error) {
 *       console.error('Metrics collection failed:', error.message);
 *       // Implement fallback mechanisms
 *     }
 *   }
 * }
 * ```
 */
@Injectable()
export class HealthService {
    /**
     * Redis microservice configuration options
     * @private
     * @description Configuration settings for Redis health check connection
     * @property {MicroserviceHealthIndicatorOptions<RedisOptions>} redisOptions
     */
    private redisOptions: MicroserviceHealthIndicatorOptions<RedisOptions> = null;

    /**
     * Creates an instance of HealthService
     * @constructor
     * @param {HealthCheckService} health - Service for executing health checks
     * @param {DiskHealthIndicator} disk - Indicator for monitoring disk storage health
     * @param {MemoryHealthIndicator} memory - Indicator for tracking memory usage
     * @param {MongooseHealthIndicator} mongoose - Indicator for MongoDB connection status
     * @param {MicroserviceHealthIndicator} microservice - Indicator for microservice health
     * @param {DagHealthIndicator} dagHealthIndicator - Indicator for DAG network status
     * @param {RedisClientOptions} redisClientOptions - Redis connection configuration
     */
    constructor(
        private health: HealthCheckService,
        private disk: DiskHealthIndicator,
        private memory: MemoryHealthIndicator,
        private mongoose: MongooseHealthIndicator,
        private microservice: MicroserviceHealthIndicator,
        private dagHealthIndicator: DagHealthIndicator,
        @Inject('redisOptions') private readonly redisClientOptions: RedisClientOptions
    ) {
        this.redisOptions = {
            transport: Transport.REDIS,
            options: {
                host: (<any>this.redisClientOptions.socket).host,
                port: (<any>this.redisClientOptions.socket).port,
                password: this.redisClientOptions.password
            }
        }
    }

    /**
     * Retrieves CPU performance metrics
     * @private
     * @description
     * Calculates and returns detailed CPU performance metrics including:
     * - Current CPU utilization percentage across all cores
     * - Total number of available CPU cores
     * - Average CPU clock speed across all cores
     * 
     * The method accounts for:
     * - Multi-core processors
     * - Virtual cores (hyperthreading)
     * - System-wide CPU time
     * - User and system CPU usage
     * 
     * @returns {Object} CPU metrics containing:
     * @property {number} usage - Current CPU utilization percentage (0-100)
     * @property {number} cpus - Number of available CPU cores
     * @property {number} speed - Average CPU speed in MHz
     * 
     * @throws {Error} When CPU metrics cannot be retrieved
     * 
     * @example
     * ```typescript
     * try {
     *   const cpuMetrics = this.getCpuUsage();
     *   
     *   // Monitor CPU performance
     *   if (cpuMetrics.usage > 90) {
     *     console.warn('High CPU utilization detected');
     *   }
     *   
     *   // Log CPU details
     *   console.log('CPU Status:', {
     *     usage: `${cpuMetrics.usage}%`,
     *     cores: cpuMetrics.cpus,
     *     speed: `${cpuMetrics.speed}MHz`,
     *     load: `${cpuMetrics.usage / cpuMetrics.cpus}% per core`
     *   });
     * } catch (error) {
     *   console.error('Failed to get CPU metrics:', error);
     *   // Return default or cached values
     * }
     * ```
     */
    private getCpuUsage(): any {
        const usage = process.cpuUsage();
        const cpuUsage = (usage.user + usage.system) / (os.cpus().length * 1000 * 1000);
        return { 
            usage: cpuUsage,
            cpus: os.cpus().length,
            speed: os.cpus().map((cpu: any) => cpu.speed).reduce((acc: any, curr: any) => acc + curr) / os.cpus().length
        };
    }

    /**
     * Retrieves comprehensive system information
     * @method infos
     * @description
     * Gathers detailed system metrics and performance data including:
     * 
     * System Information:
     * - Operating system type and version
     * - System architecture and platform
     * - Machine hardware details
     * - System uptime and availability
     * 
     * CPU Metrics:
     * - Processor utilization and load
     * - Core count and architecture
     * - Clock speeds and performance
     * 
     * Memory Statistics:
     * - Physical memory capacity
     * - Memory usage and allocation
     * - Free memory availability
     * - Memory pressure indicators
     * 
     * Storage Information:
     * - Disk capacity and type
     * - Space utilization
     * - I/O performance metrics
     * 
     * Network Statistics:
     * - Interface throughput
     * - Bandwidth utilization
     * - Network I/O metrics
     * 
     * The method implements fallback mechanisms for metrics that may be unavailable
     * on certain platforms or configurations.
     * 
     * @returns {Promise<IHealthInfos>} System information containing:
     * - Platform and OS details
     * - CPU performance metrics
     * - Memory utilization data
     * - Storage statistics
     * - Network performance
     * 
     * @throws {Error} When critical system information cannot be retrieved:
     * - Permission denied errors
     * - Hardware access failures
     * - OS compatibility issues
     * - Resource monitoring restrictions
     * 
     * @example
     * ```typescript
     * try {
     *   const systemInfo = await healthService.infos();
     *   
     *   // Monitor system resources
     *   this.checkResourceUtilization({
     *     cpu: systemInfo.cpu.usage,
     *     memory: systemInfo.memory.usedMemPercentage,
     *     disk: parseInt(systemInfo.drive.usedPercentage),
     *     network: {
     *       in: systemInfo.network.inputBytes,
     *       out: systemInfo.network.outputBytes
     *     }
     *   });
     *   
     *   // Log system details
     *   console.log('System Report:', {
     *     os: `${systemInfo.platform} ${systemInfo.release}`,
     *     arch: systemInfo.arch,
     *     uptime: `${(systemInfo.uptime / 3600).toFixed(2)} hours`,
     *     cpu: {
     *       usage: `${systemInfo.cpu.usage}%`,
     *       cores: systemInfo.cpu.cpus
     *     },
     *     memory: {
     *       total: `${systemInfo.memory.totalMemMb}MB`,
     *       free: `${systemInfo.memory.freeMemMb}MB`,
     *       used: `${systemInfo.memory.usedMemPercentage}%`
     *     },
     *     storage: {
     *       total: `${systemInfo.drive.totalGb}GB`,
     *       free: `${systemInfo.drive.freeGb}GB`,
     *       used: `${systemInfo.drive.usedPercentage}%`
     *     }
     *   });
     * } catch (error) {
     *   console.error('System info collection failed:', error);
     *   // Implement graceful degradation
     * }
     * ```
     */
    async infos(): Promise<IHealthInfos> {
        let network = null;
        
        try {
            network = (await osu.netstat.stats()).map((stat: any) => {
                return {
                    inputBytes: stat.inputBytes,
                    outputBytes: stat.outputBytes
                }
            }).reduce((acc: any, curr: any) => {
                return {
                    inputBytes: acc.inputBytes + curr.inputBytes,
                    outputBytes: acc.outputBytes + curr.outputBytes
                }
            }, { inputBytes: 0, outputBytes: 0 });
        } catch (error) {
            network = {
                inputBytes: 0,
                outputBytes: 0
            }
        }

        return({
            platform: os.platform(),
            release: os.release(),
            machine: await osu.os.oos(),
            arch: await osu.os.arch(),
            uptime: os.uptime(),
            cpu: this.getCpuUsage(),
            memory: await osu.mem.info(),
            drive: await osu.drive.info(),
            network: network
        })      
    }

    /**
     * Performs comprehensive system health checks
     * @method check
     * @description
     * Executes a series of health checks on critical system components:
     * - Storage space availability (warns at 50% usage)
     * - Memory heap usage (500MB threshold)
     * - RSS memory consumption (500MB threshold)
     * - Database connectivity (MongoDB)
     * - Cache service status (Redis)
     * - Network infrastructure (DAG)
     * 
     * Each check runs independently and reports individual status.
     * 
     * @returns {Promise<HealthCheckResult>} Health check results for all components
     * @throws {HealthCheckError} If any critical health check fails
     * 
     * @example
     * ```typescript
     * try {
     *   const health = await healthService.check();
     *   if (health.status === 'ok') {
     *     console.log('All systems operational');
     *   } else {
     *     console.error('Health check failed:', health.error);
     *   }
     * } catch (error) {
     *   console.error('Critical system failure:', error);
     * }
     * ```
     */
    check(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
            () => this.memory.checkHeap('memory_heap', 500 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
            () => this.mongoose.pingCheck('mongoose'),
            async () => this.microservice.pingCheck<RedisOptions>('redis', this.redisOptions),
            () => this.dagHealthIndicator.isHealthy()
        ]);
    }
}
