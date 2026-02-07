const prefix = "[POS]";

export function log(...args: unknown[]): void {
  console.log(prefix, ...args);
}

export function info(...args: unknown[]): void {
  console.info(prefix, ...args);
}

export function warn(...args: unknown[]): void {
  console.warn(prefix, ...args);
}

export function error(...args: unknown[]): void {
  console.error(prefix, ...args);
}
