# Chrome Publisher

Example usage:

```
const path = require('path');

const chromePublisher = require('@bext/chrome-publisher');

publishToChrome();

async function publishToChrome() {
  try {
    let response;

    // initialize the publisher
    await chromePublisher.init();

    // insert a new extension
    response = await chromePublisher.insert(path.join(__dirname, 'extension-chrome.zip'));
    console.log(response);

    // update an existing extension
    response = await chromePublisher.update(path.join(__dirname, 'extension-chrome-updated.zip'));
    console.log(response);

    // publish a drafted extension
    // this only works if you have uploaded a screenshot for the extension and added a category for it through the developer dashboard
    response = await chromePublisher.publish();
    console.log(response);

    // get the status of a extension
    response = await chromePublisher.getStatus();
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
```