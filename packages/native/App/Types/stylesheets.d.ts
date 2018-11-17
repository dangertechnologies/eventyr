/// <reference types="node" />

declare module "react-native-extended-stylesheet" {
  import { StyleProp } from "react-native";
  import Theme from "App/Themes/default";
  interface BuildOptions {
    [key: string]: number | string;
  }

  interface Styles {
    [key: string]: {
      [key: string]: number | string | Array<Object> | Object;
    };
  }

  class EStyleSheet {
    public static build(options: BuildOptions): any;
    public static create(
      styles: Styles
    ): { [Key in keyof Styles]: StyleProp<any> };
    public static value<K extends keyof typeof Theme>(
      variable: K
    ): typeof Theme[K];
  }

  export = EStyleSheet;
}
