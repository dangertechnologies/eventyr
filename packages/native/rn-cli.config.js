const path = require("path");
const process = require("process");

const extraNodeModules = {
  "react-native": path.resolve(__dirname, "node_modules/react-native")
};

const blacklistRegexes = [
  new RegExp(path.resolve(__dirname, "../core/node_modules/react-native")),
  new RegExp(path.resolve(__dirname, "../graphql/node_modules/react-native"))
];
const watchFolders = [
  path.resolve(__dirname, "..", "packages", "graphql"),
  path.resolve(__dirname, "..", "packages", "core")
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
