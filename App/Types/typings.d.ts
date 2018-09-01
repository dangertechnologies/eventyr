interface AppConfig {
  appVersion: string;
}

declare module "app.json" {
  const Config: AppConfig;
  export default Config;
}

declare module "*.json" {
  const value: any;
  export default value;
}
