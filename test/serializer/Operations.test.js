import { assert } from '@open-wc/testing';
import { AmfLoader } from '../AmfLoader.js';
import { AmfSerializer } from '../../index.js';

/** @typedef {import('../../src/types').ApiScalarNode} ApiScalarNode */

describe('AmfSerializer', () => {
  describe('OAS operations', () => {
    let api;
    /** @type AmfSerializer */
    let serializer;
    before(async () => {
      api = await AmfLoader.load(true, 'petstore');
      serializer = new AmfSerializer();
      serializer.amf = api;
    });

    it('returns an operation', () => {
      const shape = AmfLoader.lookupOperation(api, '/pet', 'post');
      const result = serializer.operation(shape);
      assert.typeOf(result, 'object', 'has the result');
      assert.equal(result.id, shape['@id'], 'has the id');
      assert.include(result.types, serializer.ns.aml.vocabularies.apiContract.Operation, 'has the type');
      assert.equal(result.method, 'post', 'has the method');
      assert.equal(result.name, 'addPet', 'has the name');
      assert.equal(result.description, 'Add a new pet to the store', 'has the description');
      assert.equal(result.summary, 'Add a new pet to the store', 'has the summary');
      assert.equal(result.operationId, 'addPet', 'has the operationId');
      assert.isTrue(result.deprecated, 'is deprecated');
      assert.deepEqual(result.customDomainProperties, [], 'has no customDomainProperties');
      assert.deepEqual(result.callbacks, [], 'has no callbacks');
      assert.deepEqual(result.accepts, [], 'has no accepts');
      assert.deepEqual(result.schemes, [], 'has no schemes');
      assert.deepEqual(result.contentType, [], 'has no contentType');
      assert.typeOf(result.sourceMaps, 'object', 'has source maps');
    });

    it('adds the responses', () => {
      const shape = AmfLoader.lookupOperation(api, '/pet', 'post');
      const result = serializer.operation(shape);
      const { responses } = result;
      assert.typeOf(responses, 'array', 'has the responses');
      assert.lengthOf(responses, 2, 'has all responses');
      const [success] = responses;
      assert.equal(success.statusCode, '200', 'has response definition')
    });

    it('adds the request', () => {
      const shape = AmfLoader.lookupOperation(api, '/pet', 'post');
      const result = serializer.operation(shape);
      const { request } = result;
      assert.typeOf(request, 'object', 'has the request');
      assert.include(request.types, serializer.ns.aml.vocabularies.apiContract.Request, 'has the type');
      assert.typeOf(request.payloads, 'array', 'has the payloads');
      assert.isNotEmpty(request.payloads, 'the payloads is set');
    });

    it('adds the response', () => {
      const shape = AmfLoader.lookupOperation(api, '/pet', 'post');
      const result = serializer.operation(shape);
      const { responses } = result;
      assert.typeOf(responses, 'array', 'has the responses');
      assert.lengthOf(responses, 2, 'has all responses');
      const [r] = responses;
      assert.typeOf(r, 'object', 'response is an object');
      assert.include(r.types, serializer.ns.aml.vocabularies.apiContract.Response, 'response has the type');
      assert.typeOf(r.payloads, 'array', 'has the payloads');
      assert.isNotEmpty(r.payloads, 'the payloads is set');
      assert.equal(r.name, '200', 'response has the name');
      assert.equal(r.statusCode, '200', 'response has the statusCode');
      assert.equal(r.description, 'Successful operation', 'response has the description');
    });

    it('adds the cookie parameters', () => {
      const shape = AmfLoader.lookupOperation(api, '/pet/{petId}', 'post');
      const result = serializer.operation(shape);
      const { request } = result;
      assert.typeOf(request.cookieParameters, 'array', 'has the payloads');
      assert.isNotEmpty(request.cookieParameters, 'the payloads is set');
    });

    it('adds the query parameters', () => {
      const shape = AmfLoader.lookupOperation(api, '/pet/{petId}', 'post');
      const result = serializer.operation(shape);
      const { request } = result;
      assert.typeOf(request.queryParameters, 'array', 'has the payloads');
      assert.isNotEmpty(request.queryParameters, 'the payloads is set');
    });

    it('adds the URI parameters', () => {
      const shape = AmfLoader.lookupOperation(api, '/pet/{petId}', 'post');
      const result = serializer.operation(shape);
      const { request } = result;
      assert.typeOf(request.uriParameters, 'array', 'has the payloads');
      assert.isNotEmpty(request.uriParameters, 'the payloads is set');
    });

    it('adds the tags', () => {
      const shape = AmfLoader.lookupOperation(api, '/pet', 'post');
      const result = serializer.operation(shape);
      const { tags } = result;
      assert.typeOf(tags, 'array', 'has the tags');
      assert.lengthOf(tags, 1, 'has a single tag');
      const [tag] = tags;
      assert.typeOf(tag, 'object', 'has a tag');
      assert.equal(tag.name, 'pet', 'tag has name');
      assert.include(tag.types, serializer.ns.aml.vocabularies.apiContract.Tag, 'tag has Tag type');
    });

    it('adds the links info', () => {
      const shape = AmfLoader.lookupOperation(api, '/user', 'post');
      const result = serializer.operation(shape);
      const { responses } = result;
      const [response] = responses;
      const { links } = response;
      assert.typeOf(links, 'array', 'has the links');
      assert.isNotEmpty(links, 'the links is set');
      const [l1, l2] = links;
      assert.include(l1.types, serializer.ns.aml.vocabularies.apiContract.TemplatedLink, 'l1 has the type');
      assert.include(l2.types, serializer.ns.aml.vocabularies.apiContract.TemplatedLink, 'l2 has the type');
      assert.equal(l1.name, 'GetUserByUserName', 'l1 has the name');
      assert.equal(l2.name, 'GetUserByRef', 'l2 has the name');
      assert.equal(l1.operationId, 'getUserByName', 'l1 has the name');
      assert.typeOf(l1.description, 'string', 'l1 has the description');
      assert.typeOf(l2.description, 'string', 'l2 has the description');
      assert.typeOf(l1.mapping, 'object', 'l1 has the mapping');
      assert.typeOf(l2.mapping, 'object', 'l2 has the mapping');
      const { mapping } = l1;
      assert.include(mapping.types, serializer.ns.aml.vocabularies.apiContract.IriTemplateMapping, 'mapping has the type');
      assert.equal(mapping.templateVariable, 'username', 'mapping has the templateVariable');
      assert.equal(mapping.linkExpression, '$request.body#/username', 'mapping has the linkExpression');
    });

    
  });

  describe('RAML operations', () => {
    let api;
    /** @type AmfSerializer */
    let serializer;
    before(async () => {
      api = await AmfLoader.load(true, 'demo-api');
      serializer = new AmfSerializer();
      serializer.amf = api;
    });

    it('returns an operation', () => {
      const shape = AmfLoader.lookupOperation(api, '/files', 'get');
      const result = serializer.operation(shape);
      assert.typeOf(result, 'object', 'has the result');
      assert.equal(result.id, shape['@id'], 'has the id');
      assert.include(result.types, serializer.ns.aml.vocabularies.apiContract.Operation, 'has the type');
      assert.equal(result.method, 'get', 'has the method');
      assert.equal(result.name, 'list', 'has the name');
      assert.typeOf(result.description, 'string', 'has the description');
      assert.isFalse(result.deprecated, 'is not deprecated');
      assert.deepEqual(result.customDomainProperties, [], 'has no customDomainProperties');
      assert.deepEqual(result.callbacks, [], 'has no callbacks');
      assert.deepEqual(result.responses, [], 'has no responses');
      assert.deepEqual(result.servers, [], 'has no servers');
      assert.deepEqual(result.accepts, [], 'has no accepts');
      assert.deepEqual(result.schemes, [], 'has no schemes');
      assert.deepEqual(result.contentType, [], 'has no contentType');
      assert.typeOf(result.sourceMaps, 'object', 'has source maps');
    });

    it('adds the security info', () => {
      const shape = AmfLoader.lookupOperation(api, '/files', 'get');
      const result = serializer.operation(shape);
      const { security } = result;
      assert.typeOf(security, 'array', 'has the security');
      assert.lengthOf(security, 1, 'has the defined security');
      assert.include(security[0].types, serializer.ns.aml.vocabularies.security.securityRequirement, 'has the type');
      assert.typeOf(security[0].schemes, 'array', 'has the schemes');
      assert.typeOf(security[0].schemes[0], 'object', 'has the security scheme');
      assert.deepEqual(security[0].customDomainProperties, [], 'has no customDomainProperties');
    });

    it('adds the annotations info', () => {
      const shape = AmfLoader.lookupOperation(api, '/files', 'post');
      const result = serializer.operation(shape);
      const { customDomainProperties } = result;
      assert.typeOf(customDomainProperties, 'array', 'has the security');
      assert.lengthOf(customDomainProperties, 1, 'has the defined security');
      const [cdp] = customDomainProperties;
      assert.include(cdp.types, serializer.ns.aml.vocabularies.data.Scalar, 'has the type');
      assert.equal(cdp.name, 'scalar_1', 'has the name');
      assert.equal(cdp.extensionName, 'deprecated', 'has the extensionName');
      const typed = /** @type ApiScalarNode */ (cdp);
      assert.equal(typed.value, 'This operation is deprecated and will be removed.', 'has the value');
      assert.equal(typed.dataType, serializer.ns.w3.xmlSchema.string, 'has the dataType');
    });

    it('adds the request with payloads', () => {
      const shape = AmfLoader.lookupOperation(api, '/files/{fileId}/comments', 'post');
      const result = serializer.operation(shape);
      const { request } = result;
      assert.typeOf(request, 'object', 'has the request');
      assert.include(request.types, serializer.ns.aml.vocabularies.apiContract.Request, 'has the type');
      assert.typeOf(request.payloads, 'array', 'has the payloads');
      assert.isNotEmpty(request.payloads, 'the payloads is set');
    });

    it('adds the request with query parameters', () => {
      const shape = AmfLoader.lookupOperation(api, '/files/{fileId}/comments', 'get');
      const result = serializer.operation(shape);
      const { request } = result;
      assert.typeOf(request, 'object', 'has the request');
      assert.include(request.types, serializer.ns.aml.vocabularies.apiContract.Request, 'has the type');
      assert.typeOf(request.queryParameters, 'array', 'has the queryParameters');
      assert.isNotEmpty(request.queryParameters, 'the queryParameters is set');
    });

    it('adds the annotations', () => {
      const shape = AmfLoader.lookupOperation(api, '/files', 'post');
      const result = serializer.operation(shape);
      const { customDomainProperties } = result;
      assert.typeOf(customDomainProperties, 'array', 'has the customDomainProperties');
      const [cdp] = customDomainProperties;
      assert.typeOf(cdp, 'object', 'has the property');
      assert.include(cdp.types, serializer.ns.aml.vocabularies.data.Scalar, 'has the type');
      assert.equal(cdp.extensionName, 'deprecated', 'has the extensionName');
    });

    it('adds query parameters from a trait', () => {
      const shape = AmfLoader.lookupOperation(api, '/files/{fileId}/comments', 'get');
      const result = serializer.operation(shape);
      const { request } = result;
      const mr = request.queryParameters.find((p) => p.name === 'maxResults');
      assert.typeOf(mr, 'object', 'has a queryParameters');
    });
  });
});
