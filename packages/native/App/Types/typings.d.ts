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

// graphql.d.ts file
declare module "*.graphql" {
  import { DocumentNode } from "@eventyr/graphql";

  const value: DocumentNode;
  export default value;
}
