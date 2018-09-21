const blacklist = require("metro-config/src/defaults/blacklist");

module.exports = {
  watchFolders: alternateRoots,
  resolver: {
    blacklistRE: blacklist
  },

  transformer: {
    babelTransformerPath: require.resolve("react-native-typescript-transformer")
  },

  getTransformModulePath() {
    return require.resolve("react-native-typescript-transformer");
  },
  getSourceExts() {
    return ["ts", "tsx"];
  }
};
