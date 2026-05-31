export interface IDatabaseHealth {
  checkConnection(): Promise<boolean>;
}
