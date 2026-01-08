import fs from 'node:fs';
import { stringify } from 'yaml';
import { openApiDoc } from './openapi-generator';

// convert OpenAPI document to YAML format
const yamlDoc = stringify(openApiDoc);

const openapiYamlPath = new URL('./openapi.yaml', import.meta.url);
// write the yaml file
fs.writeFileSync(openapiYamlPath, yamlDoc);
console.log('OpenAPI document written in YAML format');

// json version
const openapiJsonPath = new URL('./openapi.json', import.meta.url);
const jsonDoc = JSON.stringify(openApiDoc, null, 2);
// write the json file
fs.writeFileSync(openapiJsonPath, jsonDoc);
console.log('OpenAPI document written in JSON format');
