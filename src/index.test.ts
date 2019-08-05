import { GetJsonObject } from "./index";

const testDir = __dirname + "/../test-assets/";

test("Json file with comments (.jsonc) and multiple inherited files across different directories", () => {
  let result = GetJsonObject(testDir + "config-1.jsonc");
  expect(result).toHaveProperty("foo", "red");
  expect(result).toHaveProperty("bar", [null]);
  expect(result).toHaveProperty("color", "blue");
  expect(result).toHaveProperty("extends");
  expect(Object.getOwnPropertyNames(result)).toHaveLength(4);
});

test("Json file with json5 syntax (.json5)", () => {
  let result = GetJsonObject(testDir + "config-2.json5");
  expect(result).toHaveProperty("foo", "yellow");
  expect(result).toHaveProperty("bar");
  expect(result.bar).toHaveLength(2);
  expect(result.bar[0]).toHaveProperty("a", true);
  expect(result.bar[1]).toHaveProperty("a", false);
  expect(result.bar[1]).toHaveProperty("b", "apple");
  expect(result).toHaveProperty("extends");
  expect(Object.getOwnPropertyNames(result)).toHaveLength(3);
});

test("Json file with json5 syntax and overridden array", () => {
  let result = GetJsonObject(testDir + "config-3.json5");
  expect(result).toHaveProperty("foo", "yellow");
  expect(result).toHaveProperty("bar");
  expect(result.bar).toHaveLength(2);
  expect(result.bar[0]).toHaveProperty("a", "overridden!");
  expect(result.bar[1]).toHaveProperty("a", "overridden again!");
  expect(result.bar[1]).toHaveProperty("b", "apple");
  expect(result).toHaveProperty("extends");
  expect(Object.getOwnPropertyNames(result)).toHaveLength(3);
});

test("Json file with multiple extends", () => {
  let result = GetJsonObject(testDir + "config-4.jsonc");
  expect(result).toHaveProperty("foo", "yellow");
  expect(result).toHaveProperty("bar", "orange");
  expect(result).toHaveProperty("count", 4);
  expect(result).toHaveProperty("color", "none");
  expect(Object.getOwnPropertyNames(result)).toHaveLength(5);
});
