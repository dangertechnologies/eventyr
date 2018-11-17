import color from "color";

import { Platform, Dimensions, PixelRatio } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
  platform === "ios" && (deviceHeight === 812 || deviceWidth === 812);

export default {
  platformStyle,
  platform,

  //Accordion
  headerStyle: "#edebed",
  iconStyle: EStyleSheet.value("$colorText"),
  contentStyle: "#f5f4f5",
  expandedIconStyle: EStyleSheet.value("$colorText"),
  accordionBorderColor: "#d3d3d3",

  //Android
  androidRipple: true,
  androidRippleColor: "rgba(256, 256, 256, 0.3)",
  androidRippleColorDark: "rgba(0, 0, 0, 0.15)",
  btnUppercaseAndroidText: true,

  // Badge
  badgeBg: EStyleSheet.value("$alert"),
  badgeColor: EStyleSheet.value("$colorPrimary"),
  badgePadding: EStyleSheet.value("$paddingBadge"),

  // Button
  btnFontFamily: platform === "ios" ? "System" : "Roboto_medium",
  btnDisabledBg: EStyleSheet.value("$colorDisabled"),
  buttonPadding: EStyleSheet.value("$paddingButton"),
  get btnPrimaryBg() {
    return this.brandPrimary;
  },
  get btnPrimaryColor() {
    return this.inverseTextColor;
  },
  get btnInfoBg() {
    return this.brandInfo;
  },
  get btnInfoColor() {
    return this.inverseTextColor;
  },
  get btnSuccessBg() {
    return this.brandSuccess;
  },
  get btnSuccessColor() {
    return this.inverseTextColor;
  },
  get btnDangerBg() {
    return this.brandDanger;
  },
  get btnDangerColor() {
    return this.inverseTextColor;
  },
  get btnWarningBg() {
    return this.brandWarning;
  },
  get btnWarningColor() {
    return this.inverseTextColor;
  },
  get btnTextSize() {
    return platform === "ios" ? this.fontSizeBase * 1.1 : this.fontSizeBase - 1;
  },
  get btnTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get btnTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },
  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },

  // Card
  cardDefaultBg: EStyleSheet.value("$colorPrimary"),
  cardBorderColor: EStyleSheet.value("$colorBorder"),
  cardBorderRadius: 2,
  cardItemPadding: platform === "ios" ? 10 : 12,

  // CheckBox
  CheckboxRadius: platform === "ios" ? 13 : 0,
  CheckboxBorderWidth: platform === "ios" ? 1 : 2,
  CheckboxPaddingLeft: platform === "ios" ? 4 : 2,
  CheckboxPaddingBottom: platform === "ios" ? 0 : 5,
  CheckboxIconSize: platform === "ios" ? 21 : 16,
  CheckboxIconMarginTop: platform === "ios" ? undefined : 1,
  CheckboxFontSize: platform === "ios" ? 23 / 0.9 : 17,
  checkboxBgColor: EStyleSheet.value("$colorPrimary"),
  checkboxSize: 20,
  checkboxTickColor: EStyleSheet.value("$colorPrimary"),

  // Color
  brandPrimary: EStyleSheet.value("$colorPrimary"),
  brandInfo: EStyleSheet.value("$colorPrimary"),
  brandSuccess: EStyleSheet.value("$colorSuccess"),
  brandDanger: EStyleSheet.value("$colorAlert"),
  brandWarning: EStyleSheet.value("$colorWarning"),
  brandDark: EStyleSheet.value("$colorText"),
  brandLight: EStyleSheet.value("$colorPrimary"),

  //Container
  containerBgColor: "transparent",

  //Date Picker
  datePickerTextColor: EStyleSheet.value("$colorText"),
  datePickerBg: "transparent",

  // Font
  DefaultFontSize: 16,
  fontFamily: platform === "ios" ? "System" : "Roboto",
  fontSizeBase: 15,
  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },

  ...Platform.select({
    ios: {
      // Footer
      footerHeight: 55,
      footerDefaultBg: EStyleSheet.value("$colorPrimary"),
      footerPaddingBottom: 0,

      // FooterTab
      tabBarTextColor: EStyleSheet.value("$colorGrayDark"),
      tabBarTextSize: 14,
      activeTab: EStyleSheet.value("$colorPrimary"),
      sTabBarActiveTextColor: EStyleSheet.value("$colorPrimary"),
      tabBarActiveTextColor: EStyleSheet.value("$colorPrimary"),
      tabActiveBgColor: EStyleSheet.value("$colorInactive"),

      // Header
      toolbarBtnColor: EStyleSheet.value("$colorPrimary"),
      toolbarDefaultBg: EStyleSheet.value("$colorPrimary"),
      toolbarHeight: 64,
      toolbarSearchIconSize: 20,
      toolbarInputColor: EStyleSheet.value("$colorBorder"),
      searchBarHeight: 30,
      searchBarInputHeight: 30,
      toolbarBtnTextColor: EStyleSheet.value("$colorPrimary"),
      iosStatusbar: "dark-content",
      toolbarDefaultBorder: EStyleSheet.value("$colorBorder"),
    },

    android: {
      // Footer
      footerHeight: 55,
      footerDefaultBg:EStyleSheet.value("$colorPrimary"),
      footerPaddingBottom: 0,

      // FooterTab
      tabBarTextColor: "#bfc6ea",
      tabBarTextSize: 11,
      activeTab: EStyleSheet.value("$colorPrimary"),
      sTabBarActiveTextColor: EStyleSheet.value("$colorPrimary"),
      tabBarActiveTextColor: EStyleSheet.value("$colorPrimary"),
      tabActiveBgColor: EStyleSheet.value("$colorPrimary"),

      // Header
      toolbarBtnColor: EStyleSheet.value("$colorPrimary"),
      toolbarDefaultBg: EStyleSheet.value("$colorPrimary"),
      toolbarHeight: 56,
      toolbarSearchIconSize: 23,
      toolbarInputColor: EStyleSheet.value("$colorPrimary"),
      searchBarHeight: 40,
      searchBarInputHeight: 50,
      toolbarBtnTextColor: EStyleSheet.value("$colorPrimary"),
      iosStatusbar: "dark-content",
      toolbarDefaultBorder: EStyleSheet.value("$colorPrimary"),
    }
  })
  
  get statusBarColor() {
    return color(this.toolbarDefaultBg)
      .darken(0.2)
      .hex();
  },
  get darkenHeader() {
    return color(this.tabBgColor)
      .darken(0.03)
      .hex();
  },

  // Icon
  iconFamily: "Ionicons",
  iconFontSize: platform === "ios" ? 30 : 28,
  iconHeaderSize: platform === "ios" ? 33 : 24,

  // InputGroup
  inputFontSize: 17,
  inputBorderColor: EStyleSheet.value("$colorBorder"),
  inputSuccessBorderColor: EStyleSheet.value("$colorSuccess"),
  inputErrorBorderColor: EStyleSheet.value("$colorAlert"),
  inputHeightBase: 50,
  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return "#575757";
  },

  // Line Height
  btnLineHeight: 19,
  lineHeightH1: 32,
  lineHeightH2: 27,
  lineHeightH3: 22,
  lineHeight: platform === "ios" ? 20 : 24,

  // List
  listBg: "transparent",
  listBorderColor: EStyleSheet.value("$colorBorder"),
  listDividerBg: EStyleSheet.value("$colorPrimary"),
  listBtnUnderlayColor: EStyleSheet.value("$colorInactive"),
  listItemPadding: platform === "ios" ? 10 : 12,
  listNoteColor: EStyleSheet.value("$colorGrayDark"),
  listNoteSize: 13,
  listItemSelected: platform === "ios" ? EStyleSheet.value("$colorPrimary") : EStyleSheet.value("$colorPrimary"),

  // Progress Bar
  defaultProgressColor: EStyleSheet.value("$colorAlert"),
  inverseProgressColor: EStyleSheet.value("$colorText"),

  // Radio Button
  radioBtnSize: platform === "ios" ? 25 : 23,
  radioSelectedColorAndroid: EStyleSheet.value("$colorPrimary"),
  radioBtnLineHeight: platform === "ios" ? 29 : 24,
  get radioColor() {
    return this.brandPrimary;
  },

  // Segment
  segmentBackgroundColor: platform === "ios" ? EStyleSheet.value("$colorPrimary") : EStyleSheet.value("$colorPrimary"),
  segmentActiveBackgroundColor: platform === "ios" ? EStyleSheet.value("$colorPrimary") : EStyleSheet.value("$colorPrimary"),
  segmentTextColor: platform === "ios" ? EStyleSheet.value("$colorPrimary") : EStyleSheet.value("$colorPrimary"),
  segmentActiveTextColor: platform === "ios" ? EStyleSheet.value("$colorPrimary") : EStyleSheet.value("$colorPrimary"),
  segmentBorderColor: platform === "ios" ? EStyleSheet.value("$colorPrimary") : EStyleSheet.value("$colorPrimary"),
  segmentBorderColorMain: platform === "ios" ? EStyleSheet.value("$colorBorder") : EStyleSheet.value("$colorPrimary"),

  // Spinner
  defaultSpinnerColor: EStyleSheet.value("$colorSuccess"),
  inverseSpinnerColor: EStyleSheet.value("$colorText"),

  // Tab
  tabDefaultBg: platform === "ios" ? EStyleSheet.value("$colorPrimary") : EStyleSheet.value("$colorPrimary"),
  topTabBarTextColor: platform === "ios" ? "#6b6b6b" : "#b3c7f9",
  topTabBarActiveTextColor: platform === "ios" ? EStyleSheet.value("$colorPrimary") : EStyleSheet.value("$colorPrimary"),
  topTabBarBorderColor: platform === "ios" ? EStyleSheet.value("$colorBorder") : EStyleSheet.value("$colorPrimary"),
  topTabBarActiveBorderColor: platform === "ios" ? EStyleSheet.value("$colorPrimary") : EStyleSheet.value("$colorPrimary"),

  // Tabs
  tabBgColor: EStyleSheet.value("$colorPrimary"),
  tabFontSize: 15,

  // Text
  textColor: EStyleSheet.value("$colorText"),
  inverseTextColor: EStyleSheet.value("$colorPrimary"),
  noteFontSize: 14,
  get defaultTextColor() {
    return this.textColor;
  },

  // Title
  titleFontfamily: platform === "ios" ? "System" : "Roboto_medium",
  titleFontSize: platform === "ios" ? 17 : 19,
  subTitleFontSize: platform === "ios" ? 11 : 14,
  subtitleColor: platform === "ios" ? EStyleSheet.value("$colorText") : EStyleSheet.value("$colorPrimary"),
  titleFontColor: platform === "ios" ? EStyleSheet.value("$colorText") : EStyleSheet.value("$colorPrimary"),

  // Other
  borderRadiusBase: platform === "ios" ? 5 : 2,
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  contentPadding: 10,
  dropdownLinkColor: "#414142",
  inputLineHeight: 24,
  deviceWidth,
  deviceHeight,
  isIphoneX,
  inputGroupRoundedBorderRadius: 30,

  //iPhoneX SafeArea
  Inset: {
    portrait: {
      topInset: 24,
      leftInset: 0,
      rightInset: 0,
      bottomInset: 34
    },
    landscape: {
      topInset: 0,
      leftInset: 44,
      rightInset: 44,
      bottomInset: 21
    }
  }
};
