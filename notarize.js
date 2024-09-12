require('dotenv').config();
const { notarize } = require('@electron/notarize');

console.log('Notarizing...');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir, outDir } = context;

  if (electronPlatformName !== 'darwin') {
    return;
  }


  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  await notarize({
    appBundleId: 'com.contler.hotel',
    appPath,
    appleApiKey: process.env.APPLE_API_KEY,
    appleApiIssuer: process.env.APPLE_API_ISSUER,
    appleApiKeyId: process.env.APPLE_API_KEY_ID,
  });

  console.log('Notarization complete.');
};
