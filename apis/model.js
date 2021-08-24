/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const generator = require('@api-components/api-model-generator');

generator('./apis/apis.json')
.then(() => console.log('Models created'))
.catch((cause) => console.error(cause));
