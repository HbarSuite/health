import { DynamicModule, Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { RedisClientOptions } from 'redis'
import { DagHealthIndicator } from './custom/dag.health';

/**
 * Health monitoring and system diagnostics module
 * @class HealthModule
 * @description
 * Core module that provides comprehensive health monitoring capabilities for system-wide diagnostics.
 * Integrates multiple health indicators and monitoring services to provide a complete view of system health.
 * 
 * Key features:
 * - System-wide health checks and diagnostics
 * - Redis connection status monitoring 
 * - DAG network health tracking
 * - Resource utilization metrics
 * - Performance analytics
 * - Customizable health indicators
 * - Cached metric collection
 * 
 * The module integrates with Redis for caching and implements custom health indicators
 * for specialized monitoring needs. It provides both basic health checks and detailed
 * system metrics through a unified API.
 * 
 * @example
 * ```typescript
 * // Register in AppModule
 * @Module({
 *   imports: [
 *     HealthModule.forRoot({
 *       host: 'localhost',
 *       port: 6379,
 *       password: 'secret',
 *       db: 0
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class HealthModule {
  /**
   * Configures and initializes the health monitoring module
   * @static
   * @method forRoot
   * @description
   * Creates a dynamic module instance with Redis integration and health monitoring capabilities.
   * This method configures all necessary dependencies and services for comprehensive system monitoring.
   * 
   * Configuration includes:
   * - Redis client setup with provided options
   * - Health check endpoints via TerminusModule
   * - System monitoring services initialization
   * - Custom health indicators registration
   * - Controller route configuration
   * 
   * The configured module provides:
   * - System diagnostics and resource monitoring
   * - Redis connection health checks
   * - DAG network status tracking
   * - Performance metrics collection
   * - Customizable health indicators
   * - Cached metric storage
   * 
   * @param {RedisClientOptions} redisOptions - Redis client configuration options
   * @param {string} [redisOptions.host] - Redis server hostname
   * @param {number} [redisOptions.port] - Redis server port number
   * @param {string} [redisOptions.password] - Redis authentication password
   * @param {number} [redisOptions.db] - Redis database index
   * @param {boolean} [redisOptions.tls] - Enable TLS/SSL encryption
   * @param {number} [redisOptions.connectTimeout] - Connection timeout in milliseconds
   * @param {boolean} [redisOptions.enableReadyCheck] - Enable Redis ready check
   * 
   * @returns {DynamicModule} Configured HealthModule instance with all dependencies
   * 
   * @example
   * ```typescript
   * // Basic configuration
   * HealthModule.forRoot({
   *   host: 'localhost',
   *   port: 6379
   * });
   * 
   * // Advanced configuration
   * HealthModule.forRoot({
   *   host: 'redis.example.com',
   *   port: 6379,
   *   password: 'secret',
   *   db: 0,
   *   tls: true,
   *   connectTimeout: 5000,
   *   enableReadyCheck: true
   * });
   * ```
   */
  static forRoot(redisOptions: RedisClientOptions): DynamicModule {
    return {
      module: HealthModule,
      imports: [
        TerminusModule // Import Terminus for health checks
      ],
      controllers: [
        HealthController // Controller handling health endpoints
      ],
      providers: [
        HealthService, // Core health check service
        DagHealthIndicator, // Custom DAG health checks
        {
          provide: 'redisOptions',
          useFactory: () => redisOptions
        },
      ],
      exports: [
        HealthService // Export service for use in other modules
      ]
    }    
  }  
}
