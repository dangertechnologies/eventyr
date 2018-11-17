import { compose, withState, withProps } from "recompose";

export interface MeasurementProps {
  elementX: number;
  elementY: number;
  elementWidth: number;
  elementHeight: number;
}

export interface OnLayoutProps {
  onLayoutSetMeasurements(event: any): any;
}

const withMeasurements = compose<MeasurementProps, any>(
  withState("elementX", "setX", 0),
  withState("elementY", "setY", 0),
  withState("elementWidth", "setWidth", 0),
  withState("elementHeight", "setHeight", 0)
);

const withOnLayout = withProps<OnLayoutProps, any>(
  ({ setX, setY, setWidth, setHeight }) => ({
    onLayoutSetMeasurements: event => {
      setX(event.nativeEvent.layout.x);
      setY(event.nativeEvent.layout.y);
      setWidth(event.nativeEvent.layout.width);
      setHeight(event.nativeEvent.layout.height);
    }
  })
);

export const withSelfMeasure = compose<MeasurementProps & OnLayoutProps, any>(
  withMeasurements,
  withOnLayout
);
