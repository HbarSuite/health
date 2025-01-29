import { ApiProperty } from "@hsuite/nestjs-swagger"
import { IHealthInfos, IHealthInfosCPU, IHealthInfosDrive, IHealthInfosMemory, IHealthInfosNetwork } from "../interfaces/infos.interface"

/**
 * CPU health information model
 * @class HealthInfosCPU
 * @implements {IHealthInfosCPU}
 * @description
 * Provides detailed metrics about CPU performance and utilization.
 * Tracks key indicators like usage percentage, number of cores, and processing speed
 * to monitor system performance and resource availability.
 * @example
 * ```typescript
 * const cpuMetrics = new HealthInfosCPU();
 * cpuMetrics.usage = 65.5;    // CPU at 65.5% utilization
 * cpuMetrics.cpus = 4;        // Quad core processor
 * cpuMetrics.speed = 3200;    // 3.2 GHz clock speed
 * ```
 */
export class HealthInfosCPU implements IHealthInfosCPU {
    /**
     * Current CPU utilization percentage
     * @property {number} usage
     * @description Percentage of total CPU capacity currently in use.
     * Ranges from 0-100 where 100 indicates full utilization.
     */
    @ApiProperty({
        description: 'CPU usage in percentage',
        type: Number,
        required: true
    })
    usage: number

    /**
     * Number of CPU cores
     * @property {number} cpus
     * @description Total count of physical CPU cores available to the system.
     * Used to determine parallel processing capabilities.
     */
    @ApiProperty({
        description: 'Number of CPUs',
        type: Number,
        required: true
    })
    cpus: number

    /**
     * CPU clock speed
     * @property {number} speed
     * @description Processor clock speed measured in MHz (megahertz).
     * Indicates raw processing power of each CPU core.
     */
    @ApiProperty({
        description: 'Average CPU speed in MHz',
        type: Number,
        required: true
    })
    speed: number
}

/**
 * Memory health information model
 * @class HealthInfosMemory
 * @implements {IHealthInfosMemory}
 * @description
 * Tracks system memory allocation and availability.
 * Monitors RAM usage patterns to detect memory leaks and resource constraints.
 * Provides both absolute values and percentage-based metrics.
 * @example
 * ```typescript
 * const memInfo = new HealthInfosMemory();
 * memInfo.totalMemMb = 16384;        // 16 GB total RAM
 * memInfo.usedMemMb = 8192;          // 8 GB in use
 * memInfo.freeMemMb = 8192;          // 8 GB available
 * memInfo.usedMemPercentage = 50;    // 50% utilized
 * memInfo.freeMemPercentage = 50;    // 50% free
 * ```
 */
export class HealthInfosMemory implements IHealthInfosMemory {
    /**
     * Total system memory
     * @property {number} totalMemMb
     * @description Total physical RAM installed in the system, measured in megabytes.
     */
    @ApiProperty({
        description: 'Total memory in MB',
        type: Number,
        required: true
    })
    totalMemMb: number

    /**
     * Used memory amount
     * @property {number} usedMemMb
     * @description Currently allocated memory in megabytes.
     * Includes memory used by OS, applications, and cache.
     */
    @ApiProperty({
        description: 'Used memory in MB',
        type: Number,
        required: true
    })
    usedMemMb: number

    /**
     * Available memory amount
     * @property {number} freeMemMb
     * @description Unallocated memory available for use, in megabytes.
     */
    @ApiProperty({
        description: 'Free memory in MB',
        type: Number,
        required: true
    })
    freeMemMb: number

    /**
     * Memory usage percentage
     * @property {number} usedMemPercentage
     * @description Percentage of total memory currently in use (0-100).
     */
    @ApiProperty({
        description: 'Used memory in percentage',
        type: Number,
        required: true
    })
    usedMemPercentage: number

    /**
     * Memory availability percentage
     * @property {number} freeMemPercentage
     * @description Percentage of total memory currently free (0-100).
     */
    @ApiProperty({
        description: 'Free memory in percentage',
        type: Number,
        required: true
    })
    freeMemPercentage: number
}

/**
 * Drive/storage health information model
 * @class HealthInfosDrive
 * @implements {IHealthInfosDrive}
 * @description
 * Monitors disk storage capacity and usage.
 * Tracks available space and usage patterns to prevent disk space issues.
 * Reports metrics in both absolute values and percentages.
 * @example
 * ```typescript
 * const driveInfo = new HealthInfosDrive();
 * driveInfo.totalGb = "1000";        // 1 TB total storage
 * driveInfo.usedGb = "600";          // 600 GB used
 * driveInfo.freeGb = "400";          // 400 GB free
 * driveInfo.usedPercentage = "60";   // 60% utilized
 * driveInfo.freePercentage = "40";   // 40% available
 * ```
 */
export class HealthInfosDrive implements IHealthInfosDrive {
    /**
     * Total drive capacity
     * @property {string} totalGb
     * @description Total storage space available on the drive in gigabytes.
     */
    @ApiProperty({
        description: 'Total drive space in GB',
        type: String,
        required: true
    })
    totalGb: string

    /**
     * Used drive space
     * @property {string} usedGb
     * @description Storage space currently in use, measured in gigabytes.
     */
    @ApiProperty({
        description: 'Used drive space in GB',
        type: String,
        required: true
    })
    usedGb: string

    /**
     * Available drive space
     * @property {string} freeGb
     * @description Remaining unused storage space in gigabytes.
     */
    @ApiProperty({
        description: 'Free drive space in GB',
        type: String,
        required: true
    })
    freeGb: string

    /**
     * Storage usage percentage
     * @property {string} usedPercentage
     * @description Percentage of total storage space currently in use (0-100).
     */
    @ApiProperty({
        description: 'Used drive space in percentage',
        type: String,
        required: true
    })
    usedPercentage: string

    /**
     * Storage availability percentage
     * @property {string} freePercentage
     * @description Percentage of total storage space currently free (0-100).
     */
    @ApiProperty({
        description: 'Free drive space in percentage',
        type: String,
        required: true
    })
    freePercentage: string
}

/**
 * Network I/O health information model
 * @class HealthInfosNetwork
 * @implements {IHealthInfosNetwork}
 * @description
 * Monitors network traffic and bandwidth utilization.
 * Tracks inbound and outbound data transfer to detect network issues
 * and analyze communication patterns.
 * @example
 * ```typescript
 * const networkInfo = new HealthInfosNetwork();
 * networkInfo.inputBytes = 1048576;    // 1 MB received
 * networkInfo.outputBytes = 524288;    // 512 KB sent
 * ```
 */
export class HealthInfosNetwork implements IHealthInfosNetwork {
    /**
     * Network input volume
     * @property {number} inputBytes
     * @description Total number of bytes received by the network interface.
     * Tracks inbound network traffic volume.
     */
    @ApiProperty({
        description: 'Input bytes',
        type: Number,
        required: true
    })
    inputBytes: number

    /**
     * Network output volume
     * @property {number} outputBytes
     * @description Total number of bytes sent through the network interface.
     * Tracks outbound network traffic volume.
     */
    @ApiProperty({
        description: 'Output bytes',
        type: Number,
        required: true
    })
    outputBytes: number
}

/**
 * Complete system health information model
 * @class HealthInfos
 * @implements {IHealthInfos}
 * @description
 * Comprehensive system health monitoring model that aggregates metrics from:
 * - System information (OS, architecture, uptime)
 * - CPU performance and utilization
 * - Memory allocation and availability
 * - Storage capacity and usage
 * - Network traffic and bandwidth
 * 
 * Provides a complete snapshot of system health for monitoring and diagnostics.
 * @example
 * ```typescript
 * const healthInfo = new HealthInfos();
 * healthInfo.platform = 'linux';
 * healthInfo.release = '5.4.0';
 * healthInfo.machine = 'x86_64';
 * healthInfo.arch = 'x64';
 * healthInfo.uptime = 86400;  // 1 day uptime
 * healthInfo.cpu = new HealthInfosCPU();
 * healthInfo.memory = new HealthInfosMemory();
 * healthInfo.drive = new HealthInfosDrive();
 * healthInfo.network = new HealthInfosNetwork();
 * ```
 */
export class HealthInfos implements IHealthInfos {
    /**
     * Operating system platform
     * @property {string} platform
     * @description Identifies the OS platform (e.g. 'linux', 'darwin', 'win32').
     * Used to determine system type and available features.
     */
    @ApiProperty({
        description: 'Platform',
        type: String,
        required: true
    })
    platform: string

    /**
     * OS release version
     * @property {string} release
     * @description Operating system version or release identifier.
     * Helps track OS version compatibility and available features.
     */
    @ApiProperty({
        description: 'Release',
        type: String,
        required: true
    })
    release: string

    /**
     * Hardware type
     * @property {string} machine
     * @description System hardware/machine type identifier.
     * Indicates the physical hardware architecture and capabilities.
     */
    @ApiProperty({
        description: 'Machine',
        type: String,
        required: true
    })
    machine: string

    /**
     * System architecture
     * @property {string} arch
     * @description Processor architecture (e.g. 'x64', 'arm').
     * Used for compatibility checking and optimization.
     */
    @ApiProperty({
        description: 'Architecture',
        type: String,
        required: true
    })
    arch: string

    /**
     * System uptime
     * @property {number} uptime
     * @description Time in seconds since last system boot.
     * Used to track system stability and detect restarts.
     */
    @ApiProperty({
        description: 'Uptime in seconds',
        type: Number,
        required: true
    })
    uptime: number

    /**
     * CPU health metrics
     * @property {HealthInfosCPU} cpu
     * @description Detailed CPU performance and utilization metrics.
     * Provides insights into processing capacity and load.
     */
    @ApiProperty({
        description: 'CPU information',
        type: () => HealthInfosCPU,
        required: true
    })
    cpu: HealthInfosCPU

    /**
     * Memory health metrics
     * @property {HealthInfosMemory} memory
     * @description Detailed memory allocation and availability metrics.
     * Monitors RAM usage and potential memory constraints.
     */
    @ApiProperty({
        description: 'Memory information',
        type: () => HealthInfosMemory,
        required: true
    })
    memory: HealthInfosMemory

    /**
     * Storage health metrics
     * @property {HealthInfosDrive} drive
     * @description Detailed storage capacity and usage metrics.
     * Tracks disk space utilization and availability.
     */
    @ApiProperty({
        description: 'Drive information',
        type: () => HealthInfosDrive,
        required: true
    })
    drive: HealthInfosDrive

    /**
     * Network health metrics
     * @property {HealthInfosNetwork} network
     * @description Detailed network traffic and bandwidth metrics.
     * Monitors data transfer volumes and network utilization.
     */
    @ApiProperty({
        description: 'Network information',
        type: () => HealthInfosNetwork,
        required: true
    })
    network: HealthInfosNetwork
}