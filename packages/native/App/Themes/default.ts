import { Dimensions, Platform } from "react-native";
import color from "color";

const platform = Platform.OS;

const theme: { [key: string]: number | string } = {
  // Metrics
  $screenWidth: Dimensions.get("window").width,
  $screenHeight: Dimensions.get("window").height,
  $spacing: 16,
  $spacingDouble: 32,
  $paddingButton: 6,
  $paddingBadge: platform === "ios" ? 3 : 0,
  $heightInputBase: 50,

  // Colors
  $colorBackground: "#DFF9FF",

  $colorPrimary: "#5cb85c",
  $colorPrimaryDark: "#40802C",
  $colorPrimaryLight: "#51DE69",

  $colorSecondary: "#fbfffe",
  $colorSecondaryLight: "#FFFFFF",
  $colorSecondaryDark: "#c8cccb",

  $colorSuccess: "#5cb85c",
  $colorWarning: "#f0ad4e",
  $colorAlert: "#ED1727",

  $colorAccent: "#5CAEFF",
  $colorAccentAlternative: "rgb(104, 44, 196)",

  $colorDifficultyEasy: "#5cb85c",
  $colorDifficultyNormal: "#FFD300",
  $colorDifficultyHard: "#ED1727",

  $colorPoints: "#F2B134",
  $colorPointsIcon: "#d459cb",

  $colorGreyDark: "#737373",
  $colorGrayLight: "#CDE1F9",

  $colorText: "rgba(0, 21, 20, 1)",

  $colorDisabled: "#b5b5b5",
  $colorInactive: "#cde1f9",
  $colorBorder: "#a7a6ab",

  $borderRadius: 20,
  $borderColor: "#a7a6ab",

  // Fonts
  $sizeInput: 17,

  ...Platform.select({
    android: {
      $fontFamily: "Roboto"
    },
    ios: {
      $fontFamily: "System"
    }
  }),

  // Icons
  ...Platform.select({
    android: {
      $iconSize: 28,
      $iconSizeHeader: 24
    },
    ios: {
      $iconSize: 30,
      $iconSizeHeader: 33
    }
  }),

  $sizeH1: 32,
  $sizeH2: 26,
  $sizeH3: 20,
  $sizeH4: 18,
  $sizeParagraph: 15,
  $sizeTiny: 12
};

export default theme;
