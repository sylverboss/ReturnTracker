/**
 * Enhanced logging utility for ReturnTrackr
 * Provides centralized logging with configurable levels and namespaces
 */

// Log levels in order of verbosity
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Configuration for the logger
interface LoggerConfig {
  // Global enable/disable for all logging
  enabled: boolean;
  // Minimum level to log (e.g. if set to 'warn', only 'warn' and 'error' will be logged)
  minLevel: LogLevel;
  // Enable specific namespaces (e.g. ['api', 'auth'] - empty array means all namespaces)
  enabledNamespaces: string[];
  // Development mode only flag
  devOnly: boolean;
}

// Default configuration
const DEFAULT_CONFIG: LoggerConfig = {
  enabled: __DEV__, // Enabled by default in development
  minLevel: 'debug', // Log everything by default
  enabledNamespaces: [], // All namespaces enabled
  devOnly: true, // Only log in development mode
};

// Current configuration (initialized with defaults)
let globalConfig: LoggerConfig = { ...DEFAULT_CONFIG };

// Level priority for filtering
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  private shouldLog(level: LogLevel): boolean {
    // Check if logging is globally enabled
    if (!globalConfig.enabled) return false;
    
    // Check if we're in production and devOnly is true
    if (globalConfig.devOnly && !__DEV__) return false;
    
    // Check if the level meets the minimum level threshold
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[globalConfig.minLevel]) {
      return false;
    }
    
    // Check if the namespace is enabled
    if (globalConfig.enabledNamespaces.length > 0 && 
        !globalConfig.enabledNamespaces.includes(this.namespace)) {
      return false;
    }
    
    return true;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.namespace}]`;
    
    switch (level) {
      case 'debug':
        console.log(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }
}

/**
 * Create a logger for a specific namespace
 * @param namespace The namespace for the logger
 * @returns A Logger instance
 */
export function createLogger(namespace: string): Logger {
  return new Logger(namespace);
}

/**
 * Configure the global logging settings
 * @param config Configuration options
 */
export function configureLogging(config: Partial<LoggerConfig>): void {
  globalConfig = { ...globalConfig, ...config };
}

/**
 * Enable or disable logging globally
 * @param enabled Whether logging should be enabled
 */
export function enableLogging(enabled: boolean): void {
  globalConfig.enabled = enabled;
}

/**
 * Set the minimum log level
 * @param level The minimum level to log
 */
export function setLogLevel(level: LogLevel): void {
  globalConfig.minLevel = level;
}

/**
 * Enable logging for specific namespaces only
 * @param namespaces Array of namespaces to enable
 */
export function enableNamespaces(namespaces: string[]): void {
  globalConfig.enabledNamespaces = namespaces;
}

/**
 * Reset logger configuration to defaults
 */
export function resetLoggingConfig(): void {
  globalConfig = { ...DEFAULT_CONFIG };
}

/**
 * Get the current logger configuration
 * @returns The current configuration
 */
export function getLoggingConfig(): LoggerConfig {
  return { ...globalConfig };
}