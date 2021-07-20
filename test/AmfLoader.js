import { AmfHelperMixin } from '../amf-helper-mixin.js';

/** @typedef {import('../src/amf').EndPoint} EndPoint */
/** @typedef {import('../src/amf').Operation} Operation */
/** @typedef {import('../src/amf').Server} Server */
/** @typedef {import('../src/amf').AmfDocument} AmfDocument */
/** @typedef {import('../src/amf').Shape} Shape */
/** @typedef {import('../src/amf').Request} Request */
/** @typedef {import('../src/amf').Response} Response */

export class AmfHelper extends AmfHelperMixin(Object) {
  /**
   * 
   * @param {boolean} compact 
   * @param {string=} fileName 
   * @returns 
   */
  async load(compact, fileName = 'demo-api') {
    const suffix = compact ? '-compact' : '';
    const file = `${fileName}${suffix}.json`;
    const url = `${window.location.protocol}//${window.location.host}/base/apis/${file}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Unable to download API data model');
    }
    return response.json();
  }

  /**
   * @param {any} model 
   * @param {string=} endpointId 
   * @param {string=} methodId 
   * @returns {Server[]}
   */
  lookupServers(model, endpointId, methodId) {
    this.amf = model;
    return this._getServers({ endpointId, methodId });
  }

  /**
   * @param {any} model
   * @param {string} endpoint
   * @return {EndPoint}
   */
  lookupEndpoint(model, endpoint) {
    this.amf = model;
    const webApi = this._computeApi(model);
    return this._computeEndpointByPath(webApi, endpoint);
  }

  /**
   * @param {Object} model
   * @param {string} endpoint
   * @param {string} operation
   * @return {Operation}
   */
  lookupOperation(model, endpoint, operation) {
    const endPoint = this.lookupEndpoint(model, endpoint);
    const opKey = this._getAmfKey(this.ns.aml.vocabularies.apiContract.supportedOperation);
    const ops = this._ensureArray(endPoint[opKey]);
    return ops.find((item) => this._getValue(item, this.ns.aml.vocabularies.apiContract.method) === operation);
  }

  /**
   * @param {Object} model
   * @param {string} endpoint
   * @param {string} operation
   * @return {Request}
   */
  lookupExpects(model, endpoint, operation) {
    const op = this.lookupOperation(model, endpoint, operation);
    if (!op) {
      throw new Error(`Unknown operation for path ${endpoint} and method ${operation}`);
    }
    let expects = op[this._getAmfKey(this.ns.aml.vocabularies.apiContract.expects)];
    if (!expects) {
      throw new Error(`Operation has no "expects" value.`);
    }
    if (Array.isArray(expects)) {
      [expects] = expects;
    }
    return expects;
  }

  /**
   * @param {Object} model
   * @param {string} endpoint
   * @param {string} operation
   * @return {Response[]}
   */
  lookupReturns(model, endpoint, operation) {
    const op = this.lookupOperation(model, endpoint, operation);
    if (!op) {
      throw new Error(`Unknown operation for path ${endpoint} and method ${operation}`);
    }
    let returns = op[this._getAmfKey(this.ns.aml.vocabularies.apiContract.returns)];
    if (!returns) {
      throw new Error(`Operation has no "returns" value.`);
    }
    if (!Array.isArray(returns)) {
      returns = [returns];
    }
    return returns;
  }

  /**
   * Lookups a shape object from the declares array
   * @param {AmfDocument} model 
   * @param {string} name 
   * @returns {Shape}
   */
  lookupDeclaredShape(model, name) {
    this.amf = model;
    const items = this._computeDeclares(model);
    return items.find((item) => {
      const typed = /** @type Shape */ (item);
      const objectName = this._getValue(typed, this.ns.w3.shacl.name);
      return objectName === name;
    });
  }
}

export const AmfLoader = new AmfHelper();
