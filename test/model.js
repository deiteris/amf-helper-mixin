const generator = require('@api-components/api-model-generator');
generator('./test/apis.json')
.then(() => console.log('Models created'))
.catch((cause) => console.error(cause));
