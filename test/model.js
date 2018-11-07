const generator = require('@api-components/api-model-generator');

const files = new Map();
files.set('demo-api/demo-api.raml', 'RAML 1.0');

generator(files, {
  src: 'test',
  dest: 'test'
})
.then(() => console.log('Finito'))
.catch((cause) => console.error(cause));
