# json-extends

A npm library for reading json files with tsconfig-like "extends" inheritence

# Install

`yarn add json-extends``

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
import { GetJsonObject } from "json-extends"

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
