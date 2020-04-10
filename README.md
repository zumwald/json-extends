# json-extends

![CI](https://github.com/zumwald/json-extends/workflows/CI/badge.svg?branch=master) ![npm](https://img.shields.io/npm/v/json-extends) ![npm](https://img.shields.io/npm/dw/json-extends)

An npm library for reading json files with tsconfig-like "extends" inheritence.

# Install

`yarn add json-extends`

# Use

```json
// config-base.json
{
  "a": true,
  "b": {
    "someProperty": 5
  }
}
```

```json
// config-yellow.json
{
  "extends": "config-base.json",
  "a": false,
  "b": {
    "other": "orange"
  }
}
```

```typescript
// usage
import { GetJsonObject } from "json-extends";

let result = GetJsonObject("config-yellow.json");
console.log(result);
```

output:

```json
{
  "a": false,
  "b": {
    "someProperty": 5,
    "other": "orange"
  }
}
```

## For more detailed examples, check out the tests!
