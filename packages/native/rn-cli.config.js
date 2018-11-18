const path = require("path");

const extraNodeModules = {
  "react-native": path.resolve(__dirname, "node_modules/react-native")
};
const blacklistRegexes = [
  /[/\\]Users[/\\]amnesthesia[/\\]Code[/\\]AchievementsApp[/\\]Achievements[/\\]packages[/\\]graphql[/\\]node_modules[/\\]react-native[/\\].*/,
  /[/\\]Users[/\\]amnesthesia[/\\]Code[/\\]AchievementsApp[/\\]Achievements[/\\]packages[/\\]core[/\\]node_modules[/\\]react-native[/\\].*/
];
const watchFolders = [
  path.resolve(
    "/Users/amnesthesia/Code/AchievementsApp/Achievements/packages/graphql"
  ),
  path.resolve(
    "/Users/amnesthesia/Code/AchievementsApp/Achievements/packages/core"
  )
];

const metroVersion = require("metro/package.json").version;
const metroVersionComponents = metroVersion.match(/^(\d+)\.(\d+)\.(\d+)/);
if (
  metroVersionComponents[1] === "0" &&
  parseInt(metroVersionComponents[2], 10) >= 43
) {
  module.exports = {
    resolver: {
      extraNodeModules,
      blacklistRE: require("metro-config/src/defaults/blacklist")(
        blacklistRegexes
      )
    },
    watchFolders
  };
} else {
  module.exports = {
    extraNodeModules,
    getBlacklistRE: () => require("metro/src/blacklist")(blacklistRegexes),
    getProjectRoots: () => [path.resolve(__dirname)].concat(watchFolders)
  };
}