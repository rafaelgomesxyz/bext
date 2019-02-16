# Firefox Publisher

Example usage:

```
const path = require('path');

const firefoxPublisher = require('@bext/firefox-publisher');

publishToFirefox();

async function publishToFirefox() {
  try {
    let response;

    // initialize the publisher
    await firefoxPublisher.init();

    // insert a new extension
    response = await firefoxPublisher.insert(path.join(__dirname, 'extension-firefox.zip'), {
      body: {
        version: '1.0.0'
      }
    });
    console.log(response);

    // update an existing extension
    response = await firefoxPublisher.update(path.join(__dirname, 'extension-firefox-updated.zip'), {
      path: {
        version: '1.0.1'
      }
    });
    console.log(response);

    // get the status of a extension
    response = await firefoxPublisher.getStatus({
      path: {
        version: '1.0.1'
      }
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
```