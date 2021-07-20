import { Server } from "./amf";

interface ServersQueryOptions {
  /**
   * An EndPoint to look for the servers in
   */
  endpointId?: string
  /**
   * An Operation to look for the servers in
   */
  methodId?: string
}

interface ServerQueryOptions {
  /**
   * An EndPoint to look for the servers in. Required if Operation is provided
   */
  endpointId?: string
  /**
   * An Operation to look for the servers in
   */
  methodId?: string
  /**
   * Optional selected server id
   */
  id?: string;
}

interface ComputeUriOptions {
  /**
   * Model for the current server, if available.
   */
  server?: Server;
  /**
   * Base URI to be used with the endpoint's path.
   * Note, base URI is ignored when `ignoreBase` is set
   */
  baseUri?: string;
  /**
   * Current version of the API. It is used to replace
   * `{version}` from the URI template.
   */
  version?: string;
  /**
   * List of available protocols of the base URI with path.
   */
  protocols?: string[];
  /**
   * Whether or not to ignore rendering
   */
  ignoreBase?: boolean;
  ignorePath?: boolean;
}

export interface ApiDomainProperty {
  id: string;
  types: string[];
  customDomainProperties: ApiCustomDomainProperty[];
}

export interface ApiCustomDomainProperty extends ApiDataNode {
  extensionName: string;
}

export type ScalarDataTypes = 'string' | 'base64Binary' | 'boolean' | 'date' | 'dateTime' | 'double' | 'float' | 'integer' | 'long' | 'number' | 'time';

export interface ApiEndPoint extends ApiDomainProperty {
  description?: string;
  name?: string;
  summary?: string;
  path: string;
  operations: ApiOperation[];
  parameters: ApiParameter[];
  payloads: ApiPayload[];
  servers: ApiServer[];
  security: ApiSecurityRequirement[];
}

export interface ApiOperation extends ApiDomainProperty {
  method: string;
  name?: string;
  description?: string;
  summary?: string;
  deprecated: boolean;
  schemes?: string[];
  accepts?: string[];
  contentType?: string[];
  operationId?: string;
  documentation?: ApiDocumentation;
  request?: ApiRequest;
  responses: ApiResponse[];
  security: ApiSecurityRequirement[];
  callbacks: ApiCallback[];
  servers: ApiServer[];
  tags: ApiTag[];
}

export interface ApiTag extends ApiDomainProperty {
  name: string;
}

export interface ApiServer extends ApiDomainProperty {
  url: string;
  description?: string;
  variables: ApiParameter[];
}

export interface ApiParameter extends ApiDomainProperty {
  name?: string;
  paramName?: string;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  binding?: string;
  schema?: ApiShapeUnion;
  payloads: ApiPayload[];
  examples: ApiExample[];
}

export interface ApiExample extends ApiDomainProperty {
  name?: string;
  displayName?: string;
  description?: string;
  value?: string;
  structuredValue?: ApiDataNodeUnion;
  strict: boolean;
  mediaType?: string;
}

export interface ApiPayload extends ApiDomainProperty {
  name?: string;
  mediaType?: string;
  schema?: ApiShapeUnion;
  examples: ApiExample[];
  // encoding: ApiEncoding[];
}

export interface ApiResponse extends ApiDomainProperty {
  name?: string;
  description?: string;
  statusCode?: string;
  headers: ApiParameter[];
  payloads: ApiPayload[];
  examples: ApiExample[];
  links: ApiTemplatedLink[];
}

export interface ApiTemplatedLink extends ApiDomainProperty {
  name?: string;
  description?: string;
  template?: string;
  operationId?: string;
  requestBody?: string;
  mapping?: ApiIriTemplateMapping;
  server?: ApiServer;
}

export interface ApiIriTemplateMapping extends ApiDomainProperty {
  templateVariable?: string;
  linkExpression?: string;
}

export interface ApiSecurityRequirement extends ApiDomainProperty {
  name?: string;
  schemes: ApiParametrizedSecurityScheme[];
}

export interface ApiParametrizedSecurityScheme extends ApiDomainProperty {
  name?: string;
  settings?: ApiSecuritySettingsUnion;
  scheme?: ApiSecurityScheme;
}

export interface ApiSecurityScheme extends ApiDomainProperty {
  name?: string;
  type?: string;
  displayName?: string;
  description?: string;
  settings?: ApiSecuritySettingsUnion;
  headers: ApiParameter[];
  queryParameters: ApiParameter[];
  responses: ApiResponse[];
  queryString?: ApiShapeUnion;
}


export interface ApiSecuritySettings extends ApiDomainProperty {
  additionalProperties?: ApiDataNodeUnion;
}

export interface ApiSecurityOAuth1Settings extends ApiSecuritySettings {
  requestTokenUri?: string;
  authorizationUri?: string;
  tokenCredentialsUri?: string;
  signatures: string[];
}

export interface ApiSecurityOAuth2Settings extends ApiSecuritySettings {
  authorizationGrants: string[];
  flows: ApiSecurityOAuth2Flow[];
}

export interface ApiSecurityApiKeySettings extends ApiSecuritySettings {
  name?: string;
  in?: string;
}

export interface ApiSecurityHttpSettings extends ApiSecuritySettings {
  scheme?: string;
  bearerFormat?: string;
}

export interface ApiSecurityOpenIdConnectSettings extends ApiSecuritySettings {
  url?: string;
}

export type ApiSecuritySettingsUnion = ApiSecuritySettings | ApiSecurityOAuth1Settings | ApiSecurityOAuth2Settings | ApiSecurityApiKeySettings | ApiSecurityHttpSettings | ApiSecurityOpenIdConnectSettings;

export interface ApiSecurityOAuth2Flow extends ApiDomainProperty {
  authorizationUri?: string;
  accessTokenUri?: string;
  flow?: string;
  refreshUri?: string;
  scopes: ApiSecurityScope[];
}

export interface ApiSecurityScope extends ApiDomainProperty {
  name?: string;
  description?: string;
}

export interface ApiRequest extends ApiDomainProperty {
  description?: string;
  required?: boolean;
  queryParameters: ApiParameter[];
  headers: ApiParameter[];
  payloads: ApiPayload[];
  queryString?: ApiShapeUnion;
  uriParameters: ApiParameter[];
  cookieParameters: ApiParameter[];
}


export interface ApiCallback extends ApiDomainProperty {
  name?: string;
  expression?: string;
  endpoint?: ApiEndPoint;
}

/**
 * The definition of the domain extension
 */
export interface ApiCustomDomainExtension extends ApiDomainProperty {
  name?: string;
  displayName?: string;
  description?: string;
  domain: string[];
  schema?: ApiShapeUnion;
}

/**
 * Applies to an object domain extension
 */
export interface ApiDomainExtension extends ApiDomainProperty {
  name?: string;
  definedBy?: ApiCustomDomainExtension;
  extension?: ApiDataNodeUnion;
}

export interface ApiDocumentation extends ApiDomainProperty {
  url?: string;
  description?: string;
  title?: string;
}

export interface SerializedApi extends ApiDomainProperty {
  isAsyncApi: boolean;
  isWebApi: boolean;
  name?: string;
  description?: string;
  identifier?: string;
  schemes: string[];
  endPoints: string[];
  accepts: string[];
  contentType: string[];
  version?: string;
  termsOfService?: string;
  provider?: string;
  license?: string;
  documentations: string[];
  servers: string[];
  security: string[];
}

export type ApiShapeUnion = ApiScalarShape | ApiNodeShape | ApiUnionShape | ApiFileShape | ApiSchemaShape | ApiAnyShape | ApiArrayShape | ApiTupleShape | ApiRecursiveShape;

export interface ApiShape extends ApiDomainProperty {
  values: ApiDataNodeUnion[];
  inherits: ApiShapeUnion[];
  or: ApiShapeUnion[];
  and: ApiShapeUnion[];
  xone: ApiShapeUnion[];
  name?: string;
  displayName?: string;
  description?: string;
  defaultValueStr?: string;
  defaultValue?: ApiDataNodeUnion;
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  not?: ApiShapeUnion;
  /**
   * A label that appeared on a link.
   */
  linkLabel?: string;
}

export interface ApiPropertyShape extends ApiShape {
  path?: string;
  range?: ApiShapeUnion;
  minCount?: number;
  maxCount?: number;
  patternName?: string;
}

export interface ApiAnyShape extends ApiShape {
  documentation?: ApiDocumentation;
  xmlSerialization: ApiXMLSerializer;
  examples: ApiExample[];
}

export interface ApiNodeShape extends ApiAnyShape {
  minProperties?: number;
  maxProperties?: number;
  closed?: boolean;
  customShapeProperties: string[];
  customShapePropertyDefinitions: string[];
  discriminator?: string;
  discriminatorValue?: string;
  properties: ApiPropertyShape[];
  dependencies: string[];
}

export interface ApiXMLSerializer extends ApiDomainProperty {
  attribute?: boolean;
  wrapped?: boolean;
  name?: string;
  namespace?: string;
  prefix?: string;
}

export interface ApiScalarShape extends ApiAnyShape {
  dataType?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  format?: string;
  multipleOf?: number;
}

export interface ApiFileShape extends ApiAnyShape {
  fileTypes?: string[];
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  format?: string;
  multipleOf?: number;
}

export interface ApiSchemaShape extends ApiAnyShape {
  mediaType?: string;
  raw?: string;
}

export interface ApiUnionShape extends ApiAnyShape {
  anyOf: ApiShapeUnion[];
}

export interface ApiDataArrangeShape extends ApiAnyShape {
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export interface ApiArrayShape extends ApiDataArrangeShape {
  items?: ApiShapeUnion;
}

export interface ApiTupleShape extends ApiDataArrangeShape {
  items: ApiShapeUnion[];
  additionalItems?: boolean;
}

export interface ApiRecursiveShape extends ApiShape {
  fixPoint: string;
}

export interface ApiDataNode extends ApiDomainProperty {
  name?: string;
}

export interface ApiObjectNode extends ApiDataNode {
  properties: { [key: string]: ApiDataNodeUnion };
}

export interface ApiScalarNode extends ApiDataNode {
  value?: string;
  dataType?: string;
}

export interface ApiArrayNode extends ApiDataNode {
  members: ApiDataNodeUnion[];
}

export type ApiDataNodeUnion = ApiDataNode | ApiObjectNode | ApiScalarNode | ApiArrayNode;

export interface ApiEncoding {
  propertyName?: string;
  contentType?: string;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  headers: ApiParameter[];
}
