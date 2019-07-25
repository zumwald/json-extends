import * as jetpack from "fs-jetpack";
import { parse } from "json5";
import merge from "lodash.merge";

const EXTENDS = "extends";

function ReadJson5File(path: string): any {
  // Read template as a string, then remove comments and parse into an object
  // before we provide it to an engine for processing.
  let templateUtf8 = jetpack.read(path);
  return parse(templateUtf8);
}

/**
 * Read the template, following 'extends' property in each file.
 * @param templatePath the path to the file to read recursively
 * @param maxDepth the maximum number of configurations which can be inherited. Default is 25.
 */
export function GetJsonObject(
  templatePath: string,
  maxDepth: number = 25
): any {
  let templateLayers: Array<any> = [];
  let pathMap: { [key: string]: Boolean } = {};

  do {
    let template = ReadJson5File(templatePath);

    // Check for circular reference, if no circular reference then push the template into the array
    // and save the current template's path for subsequent circular reference checks.
    if (pathMap[templatePath] === true) {
      throw new Error("Circular reference detected, aborting now.");
    } else {
      templateLayers.unshift(template);
      pathMap[templatePath] = true;
    }

    if (template[EXTENDS]) {
      templatePath = jetpack.path(templatePath, "..", template[EXTENDS]);
    } else {
      break;
    }
  } while (templateLayers.length > 0 && templateLayers.length < maxDepth);

  let combinedTemplate = merge({}, ...templateLayers);
  return combinedTemplate;
}
