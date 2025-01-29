import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';

/**
 * Network payload containing status information
 * @interface NetworkPayload
 * @description
 * Defines the structure of network status payloads received from events.
 * Contains detailed information about network configuration, status,
 * and operational metrics.
 * 
 * @example
 * ```typescript
 * const payload: NetworkPayload = {
 *   network: {
 *     status: 'online',
 *     nodes: 5,
 *     latency: 50,
 *     throughput: 1000
 *   }
 * };
 * ```
 */
export interface NetworkPayload {
    /**
     * Network configuration and status details
     * @property {any} network
     * @description
     * Contains the current network state, configuration parameters,
     * and operational metrics including:
     * - Connection status
     * - Node count and health
     * - Network performance metrics
     * - Configuration settings
     */
    network: any;
}

/**
 * DAG Network Health Indicator
 * @class DagHealthIndicator
 * @extends {HealthIndicator}
 * @description
 * Health indicator service that monitors and reports the status of a DAG
 * (Directed Acyclic Graph) network. Integrates with NestJS Terminus for
 * health checks and provides event-based network monitoring.
 * 
 * Key features:
 * - Real-time network status monitoring
 * - Event-based health state updates
 * - Network configuration tracking
 * - Health check endpoint integration
 * - Threshold-based status updates
 * - Network metrics collection
 * 
 * The indicator maintains the network's health state and responds to
 * threshold events to provide accurate status information.
 * 
 * @example
 * ```typescript
 * // Register in module
 * @Module({
 *   imports: [TerminusModule],
 *   providers: [DagHealthIndicator],
 *   exports: [DagHealthIndicator]
 * })
 * export class HealthModule {}
 * 
 * // Use in health checks
 * @Injectable()
 * class HealthService {
 *   constructor(
 *     private health: HealthCheckService,
 *     private dagHealth: DagHealthIndicator
 *   ) {}
 *   
 *   @Get('health')
 *   @HealthCheck()
 *   async check() {
 *     return this.health.check([
 *       async () => this.dagHealth.isHealthy()
 *     ]);
 *   }
 * }
 * 
 * // Monitor network events
 * @Injectable()
 * class NetworkMonitor {
 *   constructor(private dagHealth: DagHealthIndicator) {
 *     // Network status changes are automatically handled
 *     // through event listeners in DagHealthIndicator
 *   }
 *   
 *   async checkNetworkHealth() {
 *     try {
 *       const health = await this.dagHealth.isHealthy();
 *       console.log('Network Status:', health.dag.status);
 *       console.log('Network Details:', health.dag.network);
 *     } catch (error) {
 *       console.error('Network unhealthy:', error.causes);
 *       // Implement recovery procedures
 *     }
 *   }
 * }
 * ```
 */
@Injectable()
export class DagHealthIndicator extends HealthIndicator {
    /**
     * Current health state of the DAG network
     * @private
     * @description
     * Boolean flag indicating if the network is operating normally.
     * Updated through event handlers when network status changes.
     * - true: Network is healthy and meeting thresholds
     * - false: Network is degraded or offline
     * @default false
     */
    private _isHealthy: boolean = false;

    /**
     * Current network configuration and status
     * @private
     * @description
     * Array containing detailed network information including:
     * - Node configuration and status
     * - Connection parameters
     * - Performance metrics
     * - Network topology
     * - Operational statistics
     */
    private dagNetwork: Array<any> = new Array<any>();

    /**
     * Network online event handler
     * @event smart_node.monitors.network_threshold_online
     * @param {NetworkPayload} payload - Network status information
     * @description
     * Handles events when network reaches online threshold:
     * - Updates health status to healthy (true)
     * - Stores latest network configuration
     * - Enables health checks to report positive status
     * - Triggers any registered online callbacks
     * 
     * This handler is called automatically when the network
     * meets operational thresholds.
     * 
     * @example
     * ```typescript
     * // Event is handled automatically
     * eventEmitter.emit('smart_node.monitors.network_threshold_online', {
     *   network: {
     *     status: 'online',
     *     nodes: 5,
     *     latency: 45,
     *     throughput: 1200
     *   }
     * });
     * ```
     */
    @OnEvent('smart_node.monitors.network_threshold_online')
    async handleNetworkThresholdOnline(payload: NetworkPayload) {
        this._isHealthy = true;
        this.dagNetwork = payload.network;
    }

    /**
     * Network offline event handler
     * @event smart_node.monitors.network_threshold_offline
     * @param {NetworkPayload} payload - Network status information
     * @description
     * Handles events when network drops below online threshold:
     * - Updates health status to unhealthy (false)
     * - Stores latest network configuration
     * - Causes health checks to report negative status
     * - Triggers any registered offline callbacks
     * 
     * This handler is called automatically when the network
     * fails to meet operational thresholds.
     * 
     * @example
     * ```typescript
     * // Event is handled automatically
     * eventEmitter.emit('smart_node.monitors.network_threshold_offline', {
     *   network: {
     *     status: 'offline',
     *     nodes: 2,
     *     latency: 200,
     *     throughput: 50
     *   }
     * });
     * ```
     */
    @OnEvent('smart_node.monitors.network_threshold_offline')
    async handleNetworkThresholdOffline(payload: NetworkPayload) {
        this._isHealthy = false;
        this.dagNetwork = payload.network;
    }

    /**
     * Health check method
     * @returns {Promise<HealthIndicatorResult>} Health check result with network status
     * @throws {HealthCheckError} When network is unhealthy
     * @description
     * Performs health check of the DAG network:
     * - Evaluates current network health state
     * - Returns detailed status including network configuration
     * - Throws error if network is unhealthy
     * 
     * The health check integrates with NestJS Terminus and can be used
     * in health check endpoints or monitoring systems.
     * 
     * Response includes:
     * - Overall network status
     * - Node health and connectivity
     * - Performance metrics
     * - Configuration details
     * 
     * @example
     * ```typescript
     * // Basic health check
     * try {
     *   const health = await dagHealth.isHealthy();
     *   
     *   if (health.dag.status === 'up') {
     *     console.log('Network healthy');
     *     console.log('Nodes:', health.dag.network.length);
     *     
     *     // Check network metrics
     *     const metrics = health.dag.network[0];
     *     if (metrics.latency > 100) {
     *       console.warn('High network latency');
     *     }
     *     
     *     if (metrics.throughput < 500) {
     *       console.warn('Low network throughput');
     *     }
     *   }
     * } catch (error) {
     *   console.error('Network unhealthy:', error.causes);
     *   // Implement recovery procedures
     *   await this.initiateNetworkRecovery();
     * }
     * 
     * // In Terminus health check
     * @HealthCheck()
     * async check() {
     *   return this.health.check([
     *     async () => {
     *       const dagHealth = await this.dagHealth.isHealthy();
     *       console.log('DAG Network:', dagHealth.dag.status);
     *       return dagHealth;
     *     }
     *   ]);
     * }
     * ```
     */
    async isHealthy(): Promise<HealthIndicatorResult> {
        const result = this.getStatus('dag', this._isHealthy, { network: this.dagNetwork });

        if (this._isHealthy) {
            return result;
        }

        throw new HealthCheckError('Dagcheck failed', result);
    }
}