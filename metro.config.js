const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {wrapWithReanimatedMetroConfig} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = mergeConfig(getDefaultConfig(__dirname), {
  // Add asset extensions if needed
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif'],
  },
});

// Wrap the merged config with Reanimated's config
module.exports = wrapWithReanimatedMetroConfig(config);