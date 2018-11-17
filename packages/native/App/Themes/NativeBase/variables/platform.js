import color from "color";

import { Platform, Dimensions, PixelRatio } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
  platform === "ios" && (deviceHeight === 812 || deviceWidth === 812);

export default () => ({
  platformStyle,
  platform,

  //Accordion
  headerStyle: EStyleSheet.value("$colorSecondaryDark"),
  iconStyle: EStyleSheet.value("$colorText"),
  contentStyle: EStyleSheet.value("$colorSecondary"),
  expandedIconStyle: EStyleSheet.value("$colorText"),
  accordionBorderColor: EStyleSheet.value("$colorBorder"),

  // Android
  androidRipple: true,
  androidRippleColor: "rgba(256, 256, 256, 0.3)",
  androidRippleColorDark: "rgba(0, 0, 0, 0.15)",
  btnUppercaseAndroidText: true,

  // Badge
  badgeBg: EStyleSheet.value("$colorAlert"),
  badgeColor: EStyleSheet.value("$colorSecondaryLight"),
  badgePadding: platform === "ios" ? 3 : 0,

  // Button
  btnFontFamily: platform === "ios" ? "System" : "Roboto_medium",
  btnDisabledBg: EStyleSheet.value("$colorDisabled"),
  buttonPadding: 6,
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
  cardDefaultBg: EStyleSheet.value("$colorSecondaryLight"),
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
  checkboxBgColor: EStyleSheet.value("$colorPrimaryLight"),
  checkboxSize: 20,
  checkboxTickColor: EStyleSheet.value("$colorSecondaryLight"),

  // Color
  brandPrimary:
    platform === "ios"
      ? EStyleSheet.value("$colorPrimary")
      : EStyleSheet.value("$colorPrimaryDark"),
  brandInfo: EStyleSheet.value("$colorPrimaryLight"),
  brandSuccess: EStyleSheet.value("$colorSuccess"),
  brandDanger: EStyleSheet.value("$colorAlert"),
  brandWarning: EStyleSheet.value("$colorWarning"),
  brandDark: EStyleSheet.value("$colorText"),
  brandLight: EStyleSheet.value("$colorSecondary"),

  //Container
  containerBgColor: EStyleSheet.value("$colorSecondaryLight"),

  //Date Picker
  datePickerTextColor: EStyleSheet.value("$colorText"),
  datePickerBg: "transparent",

  // Font
  DefaultFontSize: EStyleSheet.value("$sizeParagraph"),
  fontFamily: platform === "ios" ? "System" : "Roboto",
  fontSizeBase: EStyleSheet.value("$sizeParagraph"),
  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },

  // Footer
  footerHeight: 55,
  footerDefaultBg:
    platform === "ios"
      ? EStyleSheet.value("$colorSecondary")
      : EStyleSheet.value("$colorPrimaryDark"),
  footerPaddingBottom: 0,

  // FooterTab
  tabBarTextColor: platform === "ios" ? "#6b6b6b" : "#b3c7f9",
  tabBarTextSize: platform === "ios" ? 14 : 11,
  activeTab:
    platform === "ios"
      ? EStyleSheet.value("$colorPrimary")
      : EStyleSheet.value("$colorSecondaryLight"),
  sTabBarActiveTextColor: EStyleSheet.value("$colorPrimary"),
  tabBarActiveTextColor:
    platform === "ios"
      ? EStyleSheet.value("$colorPrimary")
      : EStyleSheet.value("$colorSecondaryLight"),
  tabActiveBgColor:
    platform === "ios" ? "#cde1f9" : EStyleSheet.value("$colorPrimaryDark"),

  // Header
  toolbarBtnColor:
    platform === "ios"
      ? EStyleSheet.value("$colorPrimary")
      : EStyleSheet.value("$colorSecondaryLight"),
  toolbarDefaultBg:
    platform === "ios"
      ? EStyleSheet.value("$colorSecondary")
      : EStyleSheet.value("$colorPrimaryDark"),
  toolbarHeight: platform === "ios" ? 64 : 56,
  toolbarSearchIconSize: platform === "ios" ? 20 : 23,
  toolbarInputColor:
    platform === "ios" ? "#CECDD2" : EStyleSheet.value("$colorSecondaryLight"),
  searchBarHeight: platform === "ios" ? 30 : 40,
  searchBarInputHeight: platform === "ios" ? 30 : 50,
  toolbarBtnTextColor:
    platform === "ios"
      ? EStyleSheet.value("$colorPrimary")
      : EStyleSheet.value("$colorSecondaryLight"),
  toolbarDefaultBorder:
    platform === "ios" ? "#a7a6ab" : EStyleSheet.value("$colorPrimaryDark"),
  iosStatusbar: platform === "ios" ? "dark-content" : "light-content",
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
  iconFamily: "MaterialCommunityIcons",
  iconFontSize: EStyleSheet.value("$iconSize"),
  iconHeaderSize: EStyleSheet.value("$iconSizeHeader"),

  // InputGroup
  inputFontSize: 17,
  inputBorderColor: EStyleSheet.value("$colorBorder"),
  inputSuccessBorderColor: EStyleSheet.value("$colorSuccess"),
  inputErrorBorderColor: EStyleSheet.value("$colorAlert"),
  inputHeightBase: EStyleSheet.value("$heightInputBase"),
  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return "#575757";
  },

  // Line Height
  btnLineHeight: 19,
  lineHeightH1: EStyleSheet.value("$sizeH1"),
  lineHeightH2: EStyleSheet.value("$sizeH2"),
  lineHeightH3: EStyleSheet.value("$sizeH3"),
  lineHeight: platform === "ios" ? 20 : 24,
  listItemSelected:
    platform === "ios"
      ? EStyleSheet.value("$colorPrimary")
      : EStyleSheet.value("$colorPrimaryDark"),

  // List
  listBg: "transparent",
  listBorderColor: EStyleSheet.value("$colorBorder"),
  listDividerBg: EStyleSheet.value("$colorSecondary"),
  listBtnUnderlayColor: "#DDD",
  listItemPadding: EStyleSheet.value("$spacingDouble"),
  listNoteColor: EStyleSheet.value("$colorGreyDark"),
  listNoteSize: EStyleSheet.value("$sizeTiny"),

  // Progress Bar
  defaultProgressColor: EStyleSheet.value("$colorAlert"),
  inverseProgressColor: EStyleSheet.value("$colorText"),

  // Radio Button
  radioBtnSize: platform === "ios" ? 25 : 23,
  radioSelectedColorAndroid: EStyleSheet.value("$colorPrimaryDark"),
  radioBtnLineHeight: platform === "ios" ? 29 : 24,
  get radioColor() {
    return this.brandPrimary;
  },

  // Segment
  segmentBackgroundColor:
    platform === "ios"
      ? EStyleSheet.value("$colorSecondary")
      : EStyleSheet.value("$colorPrimaryDark"),
  segmentActiveBackgroundColor:
    platform === "ios"
      ? EStyleSheet.value("$colorPrimary")
      : EStyleSheet.value("$colorSecondaryLight"),
  segmentTextColor:
    platform === "ios"
      ? EStyleSheet.value("$colorPrimary")
      : EStyleSheet.value("$colorSecondaryLight"),
  segmentActiveTextColor:
    platform === "ios"
      ? EStyleSheet.value("$colorSecondaryLight")
      : EStyleSheet.value("$colorPrimaryDark"),
  segmentBorderColor:
    platform === "ios"
      ? EStyleSheet.value("$colorPrimary")
      : EStyleSheet.value("$colorSecondaryLight"),
  segmentBorderColorMain:
    platform === "ios" ? "#a7a6ab" : EStyleSheet.value("$colorPrimaryDark"),

  // Spinner
  defaultSpinnerColor: "#45D56E",
  inverseSpinnerColor: EStyleSheet.value("$colorText"),

  // Tab
  tabDefaultBg:
    platform === "ios"
      ? EStyleSheet.value("$colorSecondary")
      : EStyleSheet.value("$colorPrimaryDark"),
  topTabBarTextColor: platform === "ios" ? "#6b6b6b" : "#b3c7f9",
  topTabBarActiveTextColor:
    platform === "ios"
      ? EStyleSheet.value("$colorPrimary")
      : EStyleSheet.value("$colorSecondaryLight"),
  topTabBarBorderColor:
    platform === "ios" ? "#a7a6ab" : EStyleSheet.value("$colorSecondaryLight"),
  topTabBarActiveBorderColor:
    platform === "ios"
      ? EStyleSheet.value("$colorPrimary")
      : EStyleSheet.value("$colorSecondaryLight"),

  // Tabs
  tabBgColor: EStyleSheet.value("$colorSecondary"),
  tabFontSize: 15,

  // Text
  textColor: EStyleSheet.value("$colorText"),
  inverseTextColor: EStyleSheet.value("$colorSecondaryLight"),
  noteFontSize: 14,
  get defaultTextColor() {
    return this.textColor;
  },

  // Title
  titleFontfamily: platform === "ios" ? "System" : "Roboto_medium",
  titleFontSize: platform === "ios" ? 17 : 19,
  subTitleFontSize: platform === "ios" ? 11 : 14,
  subtitleColor:
    platform === "ios" ? "#8e8e93" : EStyleSheet.value("$colorSecondaryLight"),
  titleFontColor:
    platform === "ios"
      ? EStyleSheet.value("$colorText")
      : EStyleSheet.value("$colorSecondaryLight"),

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
});
