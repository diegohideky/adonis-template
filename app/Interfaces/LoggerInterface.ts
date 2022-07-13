export interface LoggerInterface {
  info(logId: string, location: string, message: string, payload: any): void
  error(logId: string, location: string, message: string, payload: any): void
  warn(logId: string, location: string, message: string, payload: any): void
}
