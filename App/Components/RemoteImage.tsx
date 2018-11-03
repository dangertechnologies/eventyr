import React from "react";

import FastImage, { FastImageProperties } from "react-native-fast-image";
import Config from "../../app.json";

interface Props extends FastImageProperties {}

const RemoteImage = ({ source, ...rest }: Props) => {
  let src;
  if (
    source &&
    typeof source === "object" &&
    source.uri &&
    !source.uri.startsWith("http")
  ) {
    src = {
      ...source,
      uri: `${
        __DEV__ ? `http://${Config.baseUrlDev}` : `https://${Config.baseUrl}`
      }${source.uri}`
    };
  } else {
    src = source;
  }

  return <FastImage source={src} {...rest} />;
};

export default RemoteImage;
