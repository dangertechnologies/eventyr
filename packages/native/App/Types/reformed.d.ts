/// <reference types="node" />

declare module "react-reformed/lib/validateSchema" {
  export interface ValidationProps<TModel> {
    schema: {
      isValid?: boolean;
      fields: {
        [Field in keyof TModel]: {
          errors: Array<string>;
          isValid: boolean;
        }
      };
    };
  }

  export type ValidationOptions<TModel extends {}> = {
    [Field in keyof TModel]?: {
      type: "string" | "object" | "number";
      required?: boolean;
      test(value: TModel[Field], fail: (message: string) => any): any;
    }
  };

  function validateSchema<TModel extends {}>(
    options?: ValidationOptions<TModel>
  ): <TOriginalProps extends {}>(
    Component: React.ComponentType<TOriginalProps & ValidationProps<TModel>>
  ) => React.ReactNode;

  export default validateSchema;
}

declare module "react-reformed" {
  // State of the HOC you need to compute the InjectedProps
  interface State<TModel> {
    model: TModel;
  }

  // Props you want the resulting component to take (besides the props of the wrapped component)
  export interface ExternalProps<TModel> {
    initialModel: TModel;
  }

  interface BindInputFuncResult<TModel> {
    name: keyof TModel;
    value: string;
    onChange: (e: any) => void;
  }

  type BindInputFunc<TModel> = (
    name: keyof TModel
  ) => BindInputFuncResult<TModel>;

  // Props the HOC adds to the wrapped component
  export interface ReformedProps<TModel> {
    bindInput: BindInputFunc<TModel>;
    bindToChangeEvent: (e: any) => void;
    model: TModel;
    setProperty: (prop: keyof TModel, value: any) => TModel;
    setModel: (model: TModel) => TModel;
  }

  // // Options for the HOC factory that are not dependent on props values
  interface HocProps<TModel> {
    // // TODO can i make types better ?
    middleware?: (props: ReformedProps<TModel>) => ReformedProps<TModel>;
    trace?: boolean;
  }

  class Reformed<
    ResultProps extends object,
    TModel extends object
  > extends React.Component<ResultProps, State<TModel>> {
    // Define how your HOC is shown in ReactDevTools
    public static insideName: string;
    public displayName: string;

    constructor(props: ResultProps, ctx: any);

    trace(context: string, data: string | undefined | null): void;

    setModel(model: TModel): TModel;

    setProperty(prop: keyof TModel, value: any): TModel;

    bindToChangeEvent(e: any): void;

    /**
     * Output props suitable to bind to a dom elements name, value, onChange.
     */
    bindInput(name: keyof TModel): BindInputFuncResult<TModel>;
  }

  /**
   * Inject utilities and model into a core Form component.
   *
   * Requires explicit type of model. eg `reformed<Model>()(FormComponent)`.
   */
  function reformedHoC<TModel extends {}>(
    options?: HocProps<TModel>
  ): <TOriginalProps extends {}>(
    Component: React.ComponentType<TOriginalProps & ReformedProps<TModel>>
  ) => React.ReactNode;

  export default reformedHoC;
}
