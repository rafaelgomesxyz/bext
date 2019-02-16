# Manifest Distributor

Example usage:

```
const path = require('path');

const manifestDistributor = require('./packages/manifest-distributor');

distributeManifest();

async function distributeManifest() {
  try {
    // initialize the distributor
    await manifestDistributor.init();

    // generate specific manifest.json files for each browser
    (await manifestDistributor.from(path.join(__dirname, 'src', 'manifest.json'))).to({
      chrome: {
        destPath: path.join(__dirname, 'dist', 'chrome', 'manifest.json')
      },
      firefox: {
        destPath: path.join(__dirname, 'dist', 'firefox', 'manifest.json')
      },
      edge: {
        destPath: path.join(__dirname, 'dist', 'edge', 'manifest.json')
      }
    });
  } catch (error) {
    console.log(error);
  }
}
```