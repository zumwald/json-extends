import * as jetpack from "fs-jetpack";
import { parse } from "json5";
import { mergeWith, merge } from "lodash";

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
 * @param customMergeFn allows a custom method to merge two objects, objValue merged into srcValue, returning undefined will use default merge
 */
export function GetJsonObject(
  templatePath: string,
  maxDepth: number = 25,
  customMergeFn?: (objValue: object, srcValue: object) => object
): any {
  let templateLayers: Array<any> = [];
  let pathMap: { [key: string]: Boolean } = {};
  let templateStack: Array<string> = [templatePath];

  while (templateStack.length > 0) {
    let path = templateStack.pop();
    let template = ReadJson5File(path);

    // Check for circular reference, if no circular reference then push the template into the array
    // and save the current template's path for subsequent circular reference checks.
    if (pathMap[path] === true) {
      throw new Error("Circular reference detected, aborting now.");
    } else {
      templateLayers.unshift(template);
      let mapKey = templateStack.join(":") + ":" + path;
      pathMap[mapKey] = true;
    }

    const getNewPath = (x: string): string => jetpack.path(path, "..", x);
    // inspect EXTENDS property and push relevant configuration paths (fully-qualified) onto the stack
    if (!template[EXTENDS]) {
      continue;
    } else if (typeof template[EXTENDS] === "string") {
      templateStack.push(getNewPath(template[EXTENDS]));
    } else if (Array.isArray(template[EXTENDS])) {
      (<string[]>template[EXTENDS]).forEach(x =>
        templateStack.push(getNewPath(x))
      );
    } else {
      throw new Error(`Invalid 'extends' property detected in ${path}`);
    }
  }

  if (templateLayers.length >= maxDepth) {
    throw new Error(
      "Exited early due to maximum inheritance. If this is by design, increase maxDepth property to the desired level."
    );
  }

  let combinedTemplate: object;

  if (customMergeFn != null) {
    combinedTemplate = mergeWith({}, ...templateLayers, customMergeFn);
  } else {
    combinedTemplate = merge({}, ...templateLayers);
  }

  return combinedTemplate;
}
