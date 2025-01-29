/**
 * Health monitoring and system metrics module
 * @packageDocumentation
 * 
 * @module Health
 * @description
 * This module provides comprehensive functionality for system health monitoring, metrics collection,
 * and status checks in microservices and distributed systems. It integrates with NestJS Terminus
 * for health checks and provides extensive monitoring capabilities.
 * 
 * Key Features:
 * - Health check endpoints and controllers for system status monitoring
 * - System metrics collection (CPU, memory, disk, network)
 * - Resource utilization tracking and threshold monitoring
 * - Redis connection health verification
 * - DAG network status monitoring and connectivity checks
 * - Comprehensive system information retrieval
 * - Event-based health state updates
 * 
 * @example
 * ```typescript
 * // Basic module integration
 * import { HealthModule } from './health.module';
 * 
 * @Module({
 *   imports: [
 *     HealthModule.forRoot({
 *       host: 'localhost',
 *       port: 6379,
 *       password: 'optional'
 *     })
 *   ],
 * })
 * export class AppModule {}
 * 
 * // Using the health service
 * @Injectable()
 * class MonitoringService {
 *   constructor(private healthService: HealthService) {}
 * 
 *   async checkHealth() {
 *     const health = await this.healthService.check();
 *     console.log('System Status:', health.status);
 *   }
 * 
 *   async getMetrics() {
 *     const metrics = await this.healthService.infos();
 *     console.log('CPU Usage:', metrics.cpu.usage);
 *     console.log('Memory:', metrics.memory);
 *   }
 * }
 * ```
 */

/**
 * Export the main health module that provides health monitoring functionality
 * @see {@link HealthModule}
 */
export * from './health.module';

/**
 * Export the health service that implements system monitoring logic
 * @see {@link HealthService} 
 */
export * from './health.service';

/**
 * Export the health controller that exposes HTTP endpoints for health checks
 * @see {@link HealthController}
 */
export * from './health.controller';

/**
 * Export DAG-specific health indicators for network monitoring
 * @see {@link DagHealthIndicator}
 */
export * from './custom/dag.health';

/**
 * Export health information interfaces and models
 * @see {@link IHealthInfos}
 * @see {@link HealthInfos}
 */
export * from './interfaces/infos.interface';
export * from './models/infos.model';
