import defaultTheme from "./default";

interface Themes {
  [name: string]: { [key: string]: string | number };
}
const themes: Themes = {
  default: defaultTheme
};

export default themes;
