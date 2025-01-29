import { BadRequestException, Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation } from '@hsuite/nestjs-swagger';
import { 
  HealthCheck,
  HealthCheckResult
} from '@nestjs/terminus';
import { HealthService } from './health.service';
import { CacheTTL } from '@nestjs/cache-manager';
import { IHealthInfos } from './interfaces/infos.interface';
import { HealthInfos } from './models/infos.model';
import { Public } from '@hsuite/auth-types';

/**
 * Health Controller
 * @class HealthController
 * @description
 * Controller responsible for system health monitoring and reporting.
 * Provides RESTful endpoints to check system health status and retrieve detailed
 * health metrics about various system components.
 * 
 * Key features:
 * - System health status checks
 * - Detailed system metrics reporting
 * - Resource utilization monitoring
 * - Service availability verification
 * - Performance metrics tracking
 * - Cached responses for performance
 * 
 * @category Controllers
 * @subcategory Health
 * @since 2.0.0
 * @example
 * ```typescript
 * // Basic usage in another service
 * @Injectable()
 * class MonitoringService {
 *   constructor(private healthController: HealthController) {}
 * 
 *   async checkSystemHealth() {
 *     try {
 *       const health = await this.healthController.check();
 *       if (health.status === 'ok') {
 *         console.log('All systems operational');
 *       }
 *     } catch (error) {
 *       console.error('Health check failed:', error.message);
 *     }
 *   }
 * 
 *   async getResourceMetrics() {
 *     try {
 *       const metrics = await this.healthController.infos();
 *       console.log('System Status:', {
 *         cpuUsage: `${metrics.cpu.usage}%`,
 *         memoryFree: `${metrics.memory.freeMemMb}MB`,
 *         diskSpace: `${metrics.drive.freeGb}GB free`
 *       });
 *     } catch (error) {
 *       console.error('Failed to retrieve metrics:', error.message);
 *     }
 *   }
 * }
 * ```
 */
@Controller('health')
@ApiTags('health')
@Public()
export class HealthController {
  /**
   * Creates an instance of HealthController
   * @constructor
   * @param {HealthService} healthService - Service handling health check operations
   * @description Initializes the controller with required dependencies for health monitoring
   */
  constructor(
    private readonly healthService: HealthService
  ) {}

  /**
   * System Health Check
   * @method check
   * @description
   * Performs a comprehensive health check of the system by validating:
   * - Core service availability
   * - Database connectivity (MongoDB)
   * - Cache service status (Redis)
   * - Message queue health
   * - Resource utilization thresholds
   * - DAG network connectivity
   * - System performance metrics
   * 
   * Results are cached for 1 second to prevent excessive system load
   * from frequent checks while maintaining near real-time accuracy.
   * 
   * @returns {Promise<HealthCheckResult>} Health check results containing:
   * - Overall system status ('ok' or 'error')
   * - Individual component health states
   * - Detailed error information if any component is unhealthy
   * - Timestamp of the health check
   * 
   * @throws {BadRequestException} When health check fails or encounters errors:
   * - Service connectivity issues
   * - Resource threshold violations
   * - Network communication errors
   * - Database connection failures
   * 
   * @example
   * ```typescript
   * try {
   *   const healthStatus = await healthController.check();
   *   console.log('Health Status:', healthStatus.status);
   *   console.log('Components:', healthStatus.details);
   *   
   *   // Check specific component health
   *   if (healthStatus.details.redis.status === 'up') {
   *     console.log('Redis cache operational');
   *   }
   *   
   *   if (healthStatus.details.mongodb.status === 'up') {
   *     console.log('Database connection healthy');
   *   }
   * } catch (error) {
   *   console.error('Health check failed:', error.message);
   *   // Trigger alerts or notifications
   * }
   * ```
   */
  @Get('check')
  @CacheTTL(1)
  @HealthCheck()
  @ApiOperation({ summary: 'GET /health/check - Perform system health check' })
  @ApiResponse({ 
    status: 200, 
    description: 'HealthCheckResult - Contains system health status and component details',
  })
  @ApiResponse({ 
    status: 400, 
    description: 'BadRequestException - Health check failed or encountered errors',
    type: BadRequestException
  })
  check(): Promise<HealthCheckResult> {
    try {
      return this.healthService.check();
    } catch(error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * System Health Information
   * @method infos
   * @description
   * Retrieves detailed health metrics and system information including:
   * 
   * CPU Metrics:
   * - Usage percentage across all cores
   * - Core count and architecture
   * - Clock speed and performance data
   * - Load averages and utilization patterns
   * 
   * Memory Statistics:
   * - Total available physical memory
   * - Current memory usage and allocation
   * - Free memory and swap usage
   * - Memory utilization percentages
   * 
   * Disk Information:
   * - Storage capacity and type
   * - Used and available space
   * - I/O statistics and performance
   * - Storage health indicators
   * 
   * Network Metrics:
   * - Interface status and type
   * - Bandwidth usage and throughput
   * - Connection statistics
   * - Network errors and packet loss
   * 
   * System Information:
   * - Operating system details
   * - System architecture
   * - Uptime and availability
   * - Platform-specific metrics
   * 
   * Results are cached for 1 second to balance accuracy with system load.
   * 
   * @returns {Promise<IHealthInfos>} Detailed system health metrics containing:
   * - Platform and OS information
   * - CPU performance metrics
   * - Memory utilization statistics
   * - Storage capacity and usage
   * - Network performance data
   * 
   * @throws {BadRequestException} When metrics collection fails due to:
   * - System resource access errors
   * - Permission issues
   * - Hardware monitoring failures
   * - OS-level restrictions
   * 
   * @example
   * ```typescript
   * try {
   *   const metrics = await healthController.infos();
   *   
   *   // Monitor system resources
   *   if (metrics.cpu.usage > 90) {
   *     console.warn('High CPU utilization detected');
   *   }
   *   
   *   if (metrics.memory.freeMemPercentage < 10) {
   *     console.warn('Critical memory shortage');
   *   }
   *   
   *   if (parseInt(metrics.drive.freePercentage) < 15) {
   *     console.warn('Low disk space warning');
   *   }
   *   
   *   // Log comprehensive system status
   *   console.log('System Health Report:', {
   *     platform: metrics.platform,
   *     cpuCores: metrics.cpu.cpus,
   *     memoryTotal: `${metrics.memory.totalMemMb}MB`,
   *     diskSpace: `${metrics.drive.totalGb}GB`,
   *     networkIO: {
   *       in: metrics.network.inputBytes,
   *       out: metrics.network.outputBytes
   *     }
   *   });
   * } catch (error) {
   *   console.error('Failed to retrieve system metrics:', error.message);
   *   // Handle monitoring system alerts
   * }
   * ```
   */
  @Get('infos')
  @CacheTTL(1)
  @ApiOperation({ summary: 'GET /health/infos - Retrieve detailed system health metrics' })
  @ApiResponse({ 
    status: 200, 
    description: 'HealthInfos - Contains detailed metrics about CPU, memory, disk and network usage',
    type: HealthInfos
  })
  @ApiResponse({ 
    status: 400, 
    description: 'BadRequestException - Failed to retrieve system metrics',
    type: BadRequestException
  })
  async infos(): Promise<IHealthInfos> {
    try {
      return await this.healthService.infos();
    } catch(error) {
      throw new BadRequestException(error.message);
    }
  }
}