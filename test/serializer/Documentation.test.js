import { assert } from '@open-wc/testing';
import { AmfLoader } from '../AmfLoader.js';
import { AmfSerializer } from '../../index.js';

/** @typedef {import('../../src/types').ApiScalarShape} ApiScalarShape */
/** @typedef {import('../../src/types').ApiObjectNode} ApiObjectNode */

describe('AmfSerializer', () => {
  describe('OAS documentation', () => {
    let api;
    /** @type AmfSerializer */
    let serializer;
    before(async () => {
      api = await AmfLoader.load(true, 'petstore');
      serializer = new AmfSerializer();
      serializer.amf = api;
    });

    it('has the documentation properties', () => {
      const enc = serializer._computeEncodes(api);
      const docs = enc[serializer._getAmfKey(serializer.ns.aml.vocabularies.core.documentation)][0];
      const result = serializer.documentation(docs);
      assert.typeOf(result, 'object', 'has the result');
      assert.equal(result.url, 'http://swagger.io', 'has the url');
      assert.equal(result.description, 'Find out more about Swagger', 'has the description');
      assert.deepEqual(result.customDomainProperties, [], 'has no customDomainProperties');
      assert.typeOf(result.sourceMaps, 'object', 'has source maps');
    });
  });

  describe('RAML documentation', () => {
    let api;
    /** @type AmfSerializer */
    let serializer;
    before(async () => {
      api = await AmfLoader.load(true, 'demo-api');
      serializer = new AmfSerializer();
      serializer.amf = api;
    });

    it('has the documentation properties', () => {
      const enc = serializer._computeEncodes(api);
      const docs = enc[serializer._getAmfKey(serializer.ns.aml.vocabularies.core.documentation)][0];
      const result = serializer.documentation(docs);
      assert.typeOf(result, 'object', 'has the result');
      assert.isUndefined(result.url, 'has no url');
      assert.equal(result.title, 'How to begin', 'has the title');
      assert.equal(result.description, 'Example content\n', 'has the description');
      assert.deepEqual(result.customDomainProperties, [], 'has no customDomainProperties');
      assert.typeOf(result.sourceMaps, 'object', 'has source maps');
    });
  });
});
