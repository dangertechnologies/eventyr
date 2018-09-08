/// <reference types="node" />

declare module "react-native-extended-stylesheet" {
  import { StyleProp } from "react-native";
  interface BuildOptions {
    [key: string]: number | string;
  }

  interface Styles {
    [key: string]: {
      [key: string]: number | string;
    };
  }

  class EStyleSheet {
    public static build(options: BuildOptions): any;
    public static create(
      styles: Styles
    ): { [Key in keyof Styles]: StyleProp<any> };
    public static value(variable: string): string | number;
  }

  export = EStyleSheet;
}
