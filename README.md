# DIFFOO

A library for diffing most JS object changes.

## Installation

To install the library, you can use package managers such as npm or yarn:

```bash
npm install diffoo
```

or

```bash
yarn add diffoo
```

## Usage

Here is an example of how to use the library:

### Example 1: Simple base type diff
```javascript
import DefaultPolicyFactory from 'diffoo'

const policyFactory = new DefaultPolicyFactory();
const result = policyFactory.produce("String1", "String2");
console.log(result.diffObj) 
```
result:
```json
StringDiffBaseField {
    originRawObj: 'String1',
    comparingRawObj: 'String2',
    compareOptions: { policyFactory: DefaultPolicyFactory {} },
    policyFactory: DefaultPolicyFactory {},
    valueType: 'string',
    diffType: 'Update',
    diffObj: [Circular *1],
    originObj: [Circular *1],
    comparingObj: [Circular *1]
  }
```

### Example 2: Complex type diff
```javascript
 const result = policyFactory.produce(
  [{
    key: 'new value1',
    name: '1',
    number: 123,
    boolean: true,
  }, {
    key: 'new value2',
    name: '1',
    number: 123,
    boolean: true,
  }],
  [{
    key: 'new value1',
    name: '1',
    number: 123,
    boolean: true,
  }, {
    key: 'new value2',
    name: '1',
    number: 123,
    boolean: true,
  }],
  {
    // Support combined PK definition
    primaryKeyFields: {
      key: true,
      number:true
    }
  }); 
  console.log(result)
```
result:
```json
  ArrayDiffBaseField {
        originRawObj: [
          { key: 'new value1', name: '1', number: 123, boolean: true },
          { key: 'new value2', name: '1', number: 123, boolean: true }
        ],
        comparingRawObj: [
          { key: 'new value1', name: '1', number: 123, boolean: true },
          { key: 'new value2', name: '1', number: 123, boolean: true }
        ],
        compareOptions: {
          primaryKeyFields: { key: true, number: true },
          policyFactory: DefaultPolicyFactory {}
        },
        policyFactory: DefaultPolicyFactory {},
        valueType: 'array',
        diffType: 'Equal',
        diffObj: [
          ObjectDiffBaseField {
            originRawObj: [Object],
            comparingRawObj: [Object],
            compareOptions: [Object],
            policyFactory: DefaultPolicyFactory {},
            valueType: 'object',
            diffType: 'Equal',
            diffObj: [Object],
            originObj: null,
            comparingObj: null
          },
          ObjectDiffBaseField {
            originRawObj: [Object],
            comparingRawObj: [Object],
            compareOptions: [Object],
            policyFactory: DefaultPolicyFactory {},
            valueType: 'object',
            diffType: 'Equal',
            diffObj: [Object],
            originObj: null,
            comparingObj: null
          }
        ],
        originObj: [],
        comparingObj: []
      }
```
## Documentation
The author is too lazy and will improve this part of the content in their lifetime.

~~For detailed documentation, please refer to the [official documentation](https://library-docs.com).~~

## API Reference
The author is too lazy and will improve this part of the content in their lifetime.

~~For detailed information on the library's API, please refer to the [API documentation](https://library-docs.com/api).~~

## Contributing

Contributions are welcome! Please follow the guidelines outlined in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This library is licensed under the [MIT License](LICENSE).































