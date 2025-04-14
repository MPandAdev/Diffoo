import { DefaultPolicyFactory } from '../factory/defaultPolicyFactory';
import { DiffType } from '../enums/diffType';
let policyFactory = new DefaultPolicyFactory();
// describe('Null Check', () => {
//   test('Null', () => {
//     const result = policyFactory.produce(null, null);
//     expect(result.diffType).toBe(DiffType.Equal);
//   })
// })

// describe('String Type Check', () => {
//   test('Equal', () => {
//     const result = policyFactory.produce("String1", "String1");
//     expect(result.diffType).toBe(DiffType.Equal);
//   })
//   test('Add', () => {
//     const result = policyFactory.produce(null, "{}");
//     expect(result.diffType).toBe(DiffType.Add);
//   })
//   test('Update', () => {
//     const result = policyFactory.produce("String1", "String2");
//     expect(result.diffType).toBe(DiffType.Update);
//   })
//   test('Delete', () => {
//     const result = policyFactory.produce("String1", null);
//     expect(result.diffType).toBe(DiffType.Delete);
//   })
// })

// describe('Number Type Check', () => {
//   test('Equal', () => {
//     const result = policyFactory.produce(1, 1);
//     expect(result.diffType).toBe(DiffType.Equal);
//   })
//   test('Add', () => {
//     const result = policyFactory.produce(null, 0);
//     expect(result.diffType).toBe(DiffType.Add);
//   })
//   test('Update', () => {
//     const result = policyFactory.produce(1, 2);
//     expect(result.diffType).toBe(DiffType.Update);
//   })
//   test('Delete', () => {
//     const result = policyFactory.produce(3, null);
//     expect(result.diffType).toBe(DiffType.Delete);
//   })
// })

// describe('Date Type Check', () => {
//   test('Equal', () => {
//     const result = policyFactory.produce(new Date('2020-02-02 16:12:11'), new Date('2020-02-02 16:12:11'));
//     expect(result.diffType).toBe(DiffType.Equal);
//   })
//   test('Equal in specific format', () => {
//     const result = policyFactory.produce(new Date('2020-02-02 17:12:11'), new Date('2020-02-02 16:12:11'), { dateFormat: 'YYYY-MM-DD' });
//     expect(result.diffType).toBe(DiffType.Equal);
//   })
// })

// describe('Object Type Check', () => {
//   test('Equal', () => {
//     const result = policyFactory.produce({
//       name: '1',
//       date: new Date('2020-02-02 16:12:11')
//     }, {
//       name: '1',
//       date: new Date('2020-02-02 16:12:11')
//     });
//     expect(result.diffType).toBe(DiffType.Equal);
//   })
//   test('Update', () => {
//     let origin = {
//       name: '1',
//       number: 123,
//       boolean: true,
//       date: new Date('2020-02-02 16:12:11'),
//       array: [1, 2, 3, 5],
//       object: {
//         key: 'new value',
//         name: '1',
//         number: 123,
//         boolean: true,
//       },
//       nullValue: null,
//       undefinedValue: undefined
//     };
//     let updated = {
//       name: '2',
//       number: 456,
//       boolean: false,
//       date: new Date('2020-02-02 16:12:11'),
//       array: [4, 5, 6],
//       object: {
//         key: 'new',
//         name: '1',
//         number: 1232,
//         boolean: false,
//       },
//       nullValue: null,
//       undefinedValue: undefined
//     };
//     const result = policyFactory.produce(origin, updated, {
//       ignoreFields: {
//         name: true,
//         number: true,
//         boolean: true,
//       }, primaryKeyFields: {
//         object: {
//           name: true
//         }
//       }
//     });
//     expect(result.diffType).toBe(DiffType.Update);
//   })
//   test('Delete', () => {
//     let origin = {
//       name: '1',
//       number: 123,
//       boolean: true,
//       date: new Date('2020-02-02 16:12:11'),
//       array: [1, 2, 3, 5],
//       object: {
//         key: 'new value',
//         name: '1',
//         number: 123,
//         boolean: true,
//       },
//       nullValue: null,
//       undefinedValue: undefined
//     };
//     const result = policyFactory.produce(origin, null, {
//       ignoreFields: {
//         name: true,
//         number: true,
//         boolean: true,
//       }, primaryKeyFields: {
//         object: {
//           name: true
//         }
//       }
//     });
//     expect(result.diffType).toBe(DiffType.Delete);
//   })
//   test('Reference Equal', () => {
//     let origin = {
//       name: '1',
//       number: 123,
//       boolean: true,
//       date: new Date('2020-02-02 16:12:11'),
//       array: [1, 2, 3, 5],
//       object: {
//         key: 'new value',
//         name: '1',
//         number: 123,
//         boolean: true,
//       },
//       nullValue: null,
//       undefinedValue: undefined
//     };
//     const result = policyFactory.produce({ obj: { ref: origin } }, { obj: { ref: origin } }, {
//       ignoreFields: {
//         name: true,
//         number: true,
//         boolean: true,
//       }, primaryKeyFields: {
//         object: {
//           name: true
//         }
//       }
//     });
//     expect(result.diffType).toBe(DiffType.Equal);
//   })
// })

// describe('Array Type Check', () => {
//   test('Number Array Equal', () => {
//     const result = policyFactory.produce([1, 2, 3], [3, 2, 1]);
//     expect(result.diffType).toBe(DiffType.Equal);
//   })
//   test('String Array Equal', () => {
//     const result = policyFactory.produce(['1', '2', '3'], ['3', '2', '1']);
//     expect(result.diffType).toBe(DiffType.Equal);
//     expect(result.diffObj).toHaveLength(3);
//   })
//   test('Object Array Equal(Combined Keys)', () => {
//     const result = policyFactory.produce(
//       [{
//         key: 'new value1',
//         name: '1',
//         number: 123,
//         boolean: true,
//       }, {
//         key: 'new value2',
//         name: '1',
//         number: 123,
//         boolean: true,
//       }],
//       [{
//         key: 'new value1',
//         name: '1',
//         number: 123,
//         boolean: true,
//       }, {
//         key: 'new value2',
//         name: '1',
//         number: 123,
//         boolean: true,
//       }],
//       {
//         primaryKeyFields: {
//           key: true,
//           number: true
//         }
//       });
//     expect(result.diffType).toBe(DiffType.Equal);
//   })
//   test('Object Array Update(Combined Keys)', () => {
//     const result = policyFactory.produce(
//       [{
//         key: 'key',
//         name: 'name1',
//         number: 123,
//         boolean: true,
//       }, {
//         key: 'new value2',
//         name: '1',
//         number: 123,
//         boolean: true,
//       }],
//       [{
//         key: 'new value1',
//         name: 'name1',
//         number: 123,
//         boolean: true,
//       }, {
//         key: 'new value2',
//         name: '1',
//         number: 123,
//         boolean: true,
//       }, {
//         key: 'new value1',
//         name: 'different Name',
//         number: 123,
//         boolean: true,
//       }],
//       {
//         primaryKeyFields: {
//           key: true,
//           name: true
//         }
//       });
//     expect(result.diffType).toBe(DiffType.Update);
//   })
//   test('Mix Array Update', () => {
//     const result = policyFactory.produce(
//       [1, 2, 3, {
//         key: 'key',
//         name: 'name1',
//         number: 123,
//         boolean: true,
//       }, {
//           key: 'new value2',
//           name: '1',
//           number: 123,
//           boolean: true,
//         }],
//       [2, 3, 4, {
//         key: 'new value1',
//         name: 'name1',
//         number: 123,
//         boolean: true,
//       }, {
//           key: 'new value2',
//           name: '1',
//           number: 123,
//           boolean: true,
//         }, {
//           key: 'new value1',
//           name: 'different Name',
//           number: 123,
//           boolean: true,
//         }],
//       {
//         primaryKeyFields: {
//           key: true,
//           name: true
//         }
//       });
//     expect(result.diffType).toBe(DiffType.Update);
//   })
// })
// describe('Dynamic Update', () => {
//   test('Object Array Update', () => {
//     let a =
//       [{
//         key: 'new value1',
//         name: '1',
//         number: 123,
//         boolean: true,
//       }, {
//         key: 'new value1',
//         name: '2',
//         number: 123,
//         boolean: true,
//       }, {
//         key: 'new value1',
//         name: '3',
//         number: 123,
//         boolean: true,
//       }, {
//         key: 'new value1',
//         name: '4',
//         number: 123,
//         boolean: true,
//       }]
//     let b = [{
//       key: 'new value1',
//       name: '1',
//       number: 123,
//       boolean: true,
//     }, {
//       key: 'new value1',
//       name: '2',
//       number: 123,
//       boolean: true,
//     }, {
//       key: 'new value1',
//       name: '5',
//       number: 123,
//       boolean: true,
//     }, {
//       key: 'new value1',
//       name: '6',
//       number: 123,
//       boolean: true,
//     }]
//     let result = policyFactory.produce(a, b,
//       {
//         primaryKeyFields: {
//           key: true,
//           name: true
//         }
//       });
//     result.value = [{
//       key: 'new value1',
//       name: 'new name',
//       number: 123,
//       boolean: true,
//     }]
//     expect(result.diffType).toBe(DiffType.Update);
//   })
// })
// describe('Ignore Test', () => {
//   test('Ignore Test', () => {
//     let a = {
//       key: 'new value1',
//       name: '1',
//       number: 123,
//       boolean: true,
//     }
//     let b = {
//       key: 'new value1',
//       name: '2',
//       number: 123,
//       boolean: true,
//     }
//     let result = policyFactory.produce(a, b,
//       {
//         ignoreFields: {
//           name: true
//         }
//       });
//     expect(result.diffType).toBe(DiffType.Equal);
//   })

//   test('Ignore sub Object field Test', () => {
//     let a = {
//       key: 'new value1',
//       name: '1',
//       number: 123,
//       boolean: true,
//       object: {
//         key: 'new value1',
//         name: '1',
//         number: 123,
//         boolean: true,
//       }
//     }
//     let b = {
//       key: 'new value1',
//       name: '1',
//       number: 123,
//       boolean: true,
//       object: {
//         key: 'new value1',
//         name: '2',
//         number: 123,
//         boolean: true
//       }
//     }
//     let result = policyFactory.produce(a, b,
//       {
//         ignoreFields: {
//           object: {
//             name: true
//           }
//         }
//       });
//     expect(result.diffObj.object.diffObj.name.diffType).toBe(DiffType.Ignore);
//     expect(result.diffObj.object.diffType).toBe(DiffType.Equal);
//     expect(result.diffType).toBe(DiffType.Equal);
//   })

//   test('Include Test', () => {
//     let a = {
//       key: 'new value1',
//       name: '2',
//       number: 123,
//       boolean: true,
//     }
//     let b = {
//       key: 'new value2',
//       name: '2',
//       number: 1234,
//       boolean: false,
//     }
//     let result = policyFactory.produce(a, b,
//       {
//         includeFields: {
//           name: true
//         }
//       });
//     expect(result.diffType).toBe(DiffType.Equal);
//   })



// }) 
// describe('Strice Check', () => {

//   test('String Number Equal', () => {
//     let a = () => {
//       //   throw Error("error");
//       throw "error";
//     };
//     expect(a).toThrow("error");
//   })

//   test('String Boolean Equal', () => {
//     const result = policyFactory.produce(true, 'true', { strict: false });
//     expect(result.diffType).toBe(DiffType.Equal);
//   })
//   test('String Boolean not Equal', () => {
//     try{
//       policyFactory.produce(true, 'true', { strict: true })
//     }catch(e){
//       expect(e.message).toMatch("Object types are inconsistent and cannot be compared!")
//     }
//   })

//   test('String Number Equal', () => {
//     const result = policyFactory.produce(1, '1', { strict: false });
//     expect(result.diffType).toBe(DiffType.Equal);
//   })
//   test('String Number not Equal', () => {
//     try{
//       policyFactory.produce(1, '1', { strict: true })
//     }catch(e){
//       expect(e.message).toMatch("Object types are inconsistent and cannot be compared!")
//     }
//   })
// })

describe('Test Array multiple items show', () => {
  const result = policyFactory.produce(
    [{
      key: 'new value1',
      name: '1',
      number: 123,
      boolean: true,
    }, {
      key: 'new value1',
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
      primaryKeyFields: {
        key: true,
        number: true
      },
      showDuplicate:true
    });
  expect(result.diffType).toBe(DiffType.Equal);
})