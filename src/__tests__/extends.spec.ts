
import { ArrayDiffBaseField, BaseDiffField, BooleanDiffBaseField, DateDiffBaseField, NumberDiffBaseField, ObjectDiffBaseField, RegExpDiffBaseField, StringDiffBaseField } from "../policys/index";
import { ICompareOptions } from "../interface/ICompareOptions";
import { DefaultPolicyFactory } from "../factory/defaultPolicyFactory";
import { DiffType } from "../enums/diffType";

let policyFactory = new DefaultPolicyFactory();
describe('Expend Tests', () => {

  describe('Expend method', () => {

    test('value func valid', () => {
      const result = policyFactory.produce<BaseDiffField>([1, 2], [2, 3]);
      // console.log('[value]result.value',result.value)
      expect(result).toBeInstanceOf(ArrayDiffBaseField);
    });

    test('diffObj func valid', () => {
      const result = policyFactory.produce<BaseDiffField>({ a: 1 }, { a: 2 });
      // console.log('[diffObj]result.value',result.diffObj)
      expect(result).toBeInstanceOf(ObjectDiffBaseField);
    });
    test('diff func valid', () => {
      const result = policyFactory.produce<BaseDiffField>({ a: 1 }, { a: 2 });
      // console.log('[diff]result.value',result.diff)
      expect(result).toBeInstanceOf(ObjectDiffBaseField);
    });
    test('getDiffTree func valid', () => {
      // const result = policyFactory.produce<BaseDiffField>({ a: 1 }, { a: 2 });
      let a =
        {
          key: 'new value1',
          name: '1',
          number: 123,
          boolean: true,
        }
      let b = {
        key: 'new value1',
        name: '1',
        number: 123,
        boolean: false,
      }
      let result = policyFactory.produce(a, b,
        {
          primaryKeyFields: {
            key: true,
            name: true
          },
          injectId: true
        });
      console.log('[getDiffTree]result.diffTree', result.diffTree)
      expect(result.diffType).toBe(DiffType.Update);
      // expect(result).toBeInstanceOf(ArrayDiffBaseField);
    });
  });
});