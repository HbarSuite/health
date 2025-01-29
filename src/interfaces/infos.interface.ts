/**
 * CPU health information interface
 * @interface IHealthInfosCPU
 * @description Provides detailed metrics about CPU performance and utilization.
 * Tracks key indicators like usage percentage, number of cores, and processing speed
 * to monitor system performance and resource availability.
 */
export interface IHealthInfosCPU {
    /**
     * Current CPU utilization percentage
     * @description Percentage of total CPU capacity currently in use.
     * Ranges from 0-100 where 100 indicates full utilization.
     */
    usage: number;

    /**
     * Number of CPU cores
     * @description Total count of physical CPU cores available to the system.
     * Higher core counts enable better parallel processing capabilities.
     */
    cpus: number;

    /**
     * CPU clock frequency
     * @description Processing speed of the CPU measured in MHz.
     * Indicates raw computational performance capability.
     */
    speed: number;
}

/**
 * Memory health information interface
 * @interface IHealthInfosMemory
 * @description Tracks system memory allocation and availability metrics.
 * Monitors total memory capacity, current usage levels, and free memory
 * to help identify potential memory constraints or leaks.
 */
export interface IHealthInfosMemory {
    /**
     * Total system memory capacity
     * @description Total physical memory (RAM) installed in the system, measured in megabytes.
     */
    totalMemMb: number;

    /**
     * Currently allocated memory
     * @description Amount of memory currently in use by system processes, measured in megabytes.
     */
    usedMemMb: number;

    /**
     * Available memory
     * @description Amount of unallocated memory available for use, measured in megabytes.
     */
    freeMemMb: number;

    /**
     * Memory utilization percentage
     * @description Percentage of total memory currently allocated (0-100).
     */
    usedMemPercentage: number;

    /**
     * Memory availability percentage
     * @description Percentage of total memory currently free (0-100).
     */
    freeMemPercentage: number;
}

/**
 * Drive health information interface
 * @interface IHealthInfosDrive
 * @description Monitors storage device capacity and usage metrics.
 * Tracks disk space allocation and availability to prevent storage constraints
 * and ensure adequate space for system operations.
 */
export interface IHealthInfosDrive {
    /**
     * Total storage capacity
     * @description Total available storage space on the drive, measured in gigabytes.
     */
    totalGb: string;

    /**
     * Used storage space
     * @description Amount of storage space currently occupied, measured in gigabytes.
     */
    usedGb: string;

    /**
     * Available storage space
     * @description Amount of unallocated storage space, measured in gigabytes.
     */
    freeGb: string;

    /**
     * Storage utilization percentage
     * @description Percentage of total storage space currently in use (0-100).
     */
    usedPercentage: string;

    /**
     * Storage availability percentage
     * @description Percentage of total storage space currently free (0-100).
     */
    freePercentage: string;
}

/**
 * Network health information interface
 * @interface IHealthInfosNetwork
 * @description Monitors network traffic and bandwidth utilization.
 * Tracks inbound and outbound data transfer to measure network load
 * and identify potential bottlenecks or anomalies.
 */
export interface IHealthInfosNetwork {
    /**
     * Inbound network traffic
     * @description Total bytes received through network interfaces since system start.
     */
    inputBytes: number;

    /**
     * Outbound network traffic
     * @description Total bytes transmitted through network interfaces since system start.
     */
    outputBytes: number;
}

/**
 * System health information interface
 * @interface IHealthInfos
 * @description Comprehensive system health monitoring interface that aggregates
 * metrics across multiple subsystems including CPU, memory, storage, and network.
 * Provides a holistic view of system performance and resource utilization.
 */
export interface IHealthInfos {
    /**
     * Operating system platform
     * @description Identifies the operating system type (e.g., 'linux', 'darwin', 'win32').
     */
    platform: string;

    /**
     * Operating system version
     * @description Version or build number of the operating system.
     */
    release: string;

    /**
     * Hardware identifier
     * @description System hardware architecture identifier.
     */
    machine: string;

    /**
     * CPU architecture
     * @description Processor architecture type (e.g., 'x64', 'arm64').
     */
    arch: string;

    /**
     * System runtime duration
     * @description Time in seconds since last system boot.
     */
    uptime: number;

    /**
     * CPU performance metrics
     * @description Detailed CPU utilization and performance statistics.
     */
    cpu: IHealthInfosCPU;

    /**
     * Memory utilization metrics
     * @description Detailed memory allocation and availability statistics.
     */
    memory: IHealthInfosMemory;

    /**
     * Storage utilization metrics
     * @description Detailed storage capacity and usage statistics.
     */
    drive: IHealthInfosDrive;

    /**
     * Network traffic metrics
     * @description Detailed network I/O statistics.
     */
    network: IHealthInfosNetwork;
}