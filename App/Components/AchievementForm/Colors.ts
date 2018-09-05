import randomColor from "randomcolor";

// @ts-ignore We know it returns an array when we pass count property
const generatedColors: string[] = randomColor({
  count: 100,
  luminosity: "bright"
});
export default generatedColors;
