# @hsuite/health

A comprehensive health monitoring and system diagnostics library for NestJS applications. This library provides real-time monitoring of system resources, service health checks, and detailed performance metrics.

## Features

- **System Health Monitoring**
  - Real-time health status checks
  - Service availability verification
  - Resource utilization tracking
  - Performance metrics collection

- **Resource Metrics**
  - CPU utilization and performance
  - Memory allocation and availability
  - Storage capacity and usage
  - Network traffic and bandwidth

- **Service Integration**
  - MongoDB connection health
  - Redis cache monitoring
  - DAG network status
  - Microservice connectivity

- **Performance Optimization**
  - Response caching
  - Threshold-based monitoring
  - Efficient resource usage
  - Real-time metrics updates

## Installation

```bash
npm install @hsuite/health
```

### Peer Dependencies

```json
{
  "@nestjs/common": "^10.4.2",
  "@nestjs/core": "^10.4.2"
}
```

## Quick Start

1. Import the `HealthModule` in your application:

```typescript
import { HealthModule } from '@hsuite/health';

@Module({
  imports: [
    HealthModule.forRoot({
      host: 'localhost',
      port: 6379,
      password: 'your-redis-password',
      db: 0
    })
  ]
})
export class AppModule {}
```

2. Access health endpoints:

```typescript
// Health check endpoint
GET /health/check

// Detailed system metrics
GET /health/infos
```

## API Reference

### Health Check Endpoint

`GET /health/check`

Performs a comprehensive system health check.

**Response:**
```typescript
{
  status: 'ok' | 'error',
  info: {
    // Component-specific health information
    redis: { status: 'up' | 'down' },
    mongodb: { status: 'up' | 'down' },
    disk: { status: 'up' | 'down' }
  },
  error: {
    // Error details if any component is unhealthy
  },
  details: {
    // Detailed health metrics for each component
  }
}
```

### System Information Endpoint

`GET /health/infos`

Retrieves detailed system metrics and resource utilization data.

**Response:**
```typescript
{
  platform: string,    // Operating system platform
  release: string,     // OS version
  machine: string,     // Hardware identifier
  arch: string,        // CPU architecture
  uptime: number,      // System uptime in seconds
  cpu: {
    usage: number,     // CPU utilization percentage
    cpus: number,      // Number of CPU cores
    speed: number      // CPU clock speed in MHz
  },
  memory: {
    totalMemMb: number,        // Total memory in MB
    usedMemMb: number,         // Used memory in MB
    freeMemMb: number,         // Free memory in MB
    usedMemPercentage: number, // Memory usage percentage
    freeMemPercentage: number  // Free memory percentage
  },
  drive: {
    totalGb: string,        // Total storage in GB
    usedGb: string,         // Used storage in GB
    freeGb: string,         // Free storage in GB
    usedPercentage: string, // Storage usage percentage
    freePercentage: string  // Free storage percentage
  },
  network: {
    inputBytes: number,  // Total bytes received
    outputBytes: number  // Total bytes transmitted
  }
}
```

## Advanced Usage

### Custom Health Checks

The library supports custom health indicators for specialized monitoring needs:

```typescript
@Injectable()
class CustomHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = // Your health check logic
    return this.getStatus(key, isHealthy);
  }
}
```

### Monitoring Service Integration

Example of integrating health monitoring in a service:

```typescript
@Injectable()
class MonitoringService {
  constructor(private healthService: HealthService) {}

  async monitorSystemHealth() {
    try {
      const health = await this.healthService.check();
      
      if (health.status === 'ok') {
        console.log('All systems operational');
        
        // Check individual components
        const { redis, mongodb, disk } = health.details;
        
        if (redis.status === 'up') {
          console.log('Cache service healthy');
        }
        
        if (mongodb.status === 'up') {
          console.log('Database connection stable');
        }
        
        if (disk.status === 'up') {
          console.log('Storage system normal');
        }
      }
    } catch (error) {
      console.error('Health check failed:', error.message);
      // Implement error handling and alerts
    }
  }

  async trackResourceUsage() {
    try {
      const metrics = await this.healthService.infos();
      
      // Monitor system resources
      if (metrics.cpu.usage > 90) {
        console.warn('High CPU utilization detected');
      }
      
      if (metrics.memory.freeMemPercentage < 10) {
        console.warn('Critical memory shortage');
      }
      
      if (parseInt(metrics.drive.freePercentage) < 15) {
        console.warn('Low disk space warning');
      }
      
      // Log system status
      console.log('System Metrics:', {
        platform: metrics.platform,
        uptime: this.formatUptime(metrics.uptime),
        cpu: `${metrics.cpu.usage}% (${metrics.cpu.cpus} cores)`,
        memory: `${metrics.memory.usedMemPercentage}% used`,
        disk: `${metrics.drive.freeGb}GB free`
      });
    } catch (error) {
      console.error('Metrics collection failed:', error.message);
      // Implement fallback mechanisms
    }
  }
}
```

## Configuration Options

The `HealthModule.forRoot()` method accepts Redis configuration options:

```typescript
interface RedisOptions {
  host: string;      // Redis server hostname
  port: number;      // Redis server port
  password?: string; // Redis authentication password
  db?: number;       // Redis database index
  tls?: boolean;     // Enable TLS/SSL encryption
  connectTimeout?: number;  // Connection timeout in ms
  enableReadyCheck?: boolean; // Enable Redis ready check
}
```

## Performance Considerations

- Health check responses are cached for 1 second to prevent excessive system load
- Resource metrics are collected efficiently to minimize impact
- Custom health indicators should implement appropriate caching
- Consider implementing rate limiting for public endpoints

## License

This library is part of the HSuite Enterprise platform and is subject to the HSuite Enterprise license agreement.

---

<p align="center">
  Built with ❤️ by the HbarSuite Team<br>
  Copyright © 2024 HbarSuite. All rights reserved.
</p>