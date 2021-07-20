import { assert } from '@open-wc/testing';
import { AmfLoader } from '../AmfLoader.js';
import { AmfSerializer } from '../../index.js';

describe('AmfSerializer', () => {
  describe('RAML parameters', () => {
    describe('parameter()', () => {
      let api;
      /** @type AmfSerializer */
      let serializer;
      before(async () => {
        api = await AmfLoader.load(true, 'demo-api');
        serializer = new AmfSerializer();
        serializer.amf = api;
      });
  
      it('has the name and the paramName', () => {
        const op = AmfLoader.lookupOperation(api, '/parameters', 'get');
        const ex = serializer._computeExpects(op);
        const headers = serializer._computeHeaders(ex);
        const result = serializer.parameter(headers[0]); // Accept
        assert.equal(result.name, 'Accept', 'has the name');
        assert.equal(result.paramName, 'Accept', 'has the paramName');
      });
  
      it('has the description', () => {
        const op = AmfLoader.lookupOperation(api, '/parameters', 'get');
        const ex = serializer._computeExpects(op);
        const headers = serializer._computeHeaders(ex);
        const result = serializer.parameter(headers[0]); // Accept
        assert.equal(result.description, 'Selects the response\'s media type, when supported.', 'has the name');
      });
  
      it('has the required', () => {
        const op = AmfLoader.lookupOperation(api, '/parameters', 'get');
        const ex = serializer._computeExpects(op);
        const headers = serializer._computeHeaders(ex);
        const header = headers[1]; // x-required
        const result = serializer.parameter(header);
        assert.isTrue(result.required);
      });
  
      it('has the binding', () => {
        const op = AmfLoader.lookupOperation(api, '/parameters', 'get');
        const ex = serializer._computeExpects(op);
        const headers = serializer._computeHeaders(ex);
        const header = headers[1]; // x-required
        const result = serializer.parameter(header);
        assert.equal(result.binding, 'header');
      });
  
      it('has the example', () => {
        const op = AmfLoader.lookupOperation(api, '/parameters', 'get');
        const ex = serializer._computeExpects(op);
        const headers = serializer._computeHeaders(ex);
        const header = headers[3]; // If-Modified-Since
        const result = serializer.parameter(header);
        // the example is passed to the schema.
        assert.deepEqual(result.examples, []);
      });
  
      it('has the examples', () => {
        const op = AmfLoader.lookupOperation(api, '/parameters', 'get');
        const ex = serializer._computeExpects(op);
        const qp = serializer._computeQueryParameters(ex);
        const param = qp[3]; // combo
        const result = serializer.parameter(param);
        // the example is passed to the schema.
        assert.deepEqual(result.examples, []);
      });
    });
  });

  describe('OAS parameters', () => {
    let api;
    /** @type AmfSerializer */
    let serializer;
    before(async () => {
      api = await AmfLoader.load(true, 'petstore');
      serializer = new AmfSerializer();
      serializer.amf = api;
    });

    it('has the OAS properties', () => {
      const op = AmfLoader.lookupOperation(api, '/pet/{petId}', 'post');
      const ex = serializer._computeExpects(op);
      const params = serializer._computeQueryParameters(ex);
      const param = params.find(p => serializer._getValue(p, serializer.ns.aml.vocabularies.apiContract.paramName) === 'name');
      const result = serializer.parameter(param);
      assert.isFalse(result.required, 'is not required');
      assert.isTrue(result.deprecated, 'is deprecated');
      assert.isTrue(result.allowEmptyValue, 'is allowEmptyValue');
      assert.isTrue(result.explode, 'is explode');
      assert.isTrue(result.allowReserved, 'is allowReserved');
      assert.equal(result.style, 'form', 'has style');
    });

    it('has the content property', () => {
      const op = AmfLoader.lookupOperation(api, '/pet/{petId}', 'post');
      const ex = serializer._computeExpects(op);
      const params = serializer._computeQueryParameters(ex);
      const param = params.find(p => serializer._getValue(p, serializer.ns.aml.vocabularies.apiContract.paramName) === 'filter');
      const result = serializer.parameter(param);
      const [p] = result.payloads;
      assert.include(p.types, serializer.ns.aml.vocabularies.apiContract.Payload, 'has the type');
      assert.deepEqual(p.customDomainProperties, [], 'has empty customDomainProperties');
      assert.deepEqual(p.examples, [], 'has empty examples');
      assert.equal(p.mediaType, 'application/json', 'has mediaType');
      assert.typeOf(p.schema, 'object', 'has schema');
    });
  });
});
