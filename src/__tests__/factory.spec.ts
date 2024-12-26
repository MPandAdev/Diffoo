
import { ArrayDiffBaseField, BaseDiffField,BooleanDiffBaseField,DateDiffBaseField,NumberDiffBaseField,ObjectDiffBaseField,RegExpDiffBaseField,StringDiffBaseField } from "../policys/index";
import { ICompareOptions } from "../interface/ICompareOptions";
import { DefaultPolicyFactory } from "../factory/defaultPolicyFactory";

let policyFactory = new DefaultPolicyFactory();
describe('DefaultPolicyFactory Tests', () => {

  describe('produce method', () => {
    test('should produce StringDiffBaseField', () => {
      const result = policyFactory.produce<BaseDiffField>("String1", "String2");
      expect(result).toBeInstanceOf(StringDiffBaseField);
    });

    test('should produce NumberDiffBaseField', () => {
      const result = policyFactory.produce<BaseDiffField>(1, 2);
      expect(result).toBeInstanceOf(NumberDiffBaseField);
    });

    test('should produce DateDiffBaseField', () => {
      const result = policyFactory.produce<BaseDiffField>(new Date(), new Date());
      expect(result).toBeInstanceOf(DateDiffBaseField);
    });

    test('should produce BooleanDiffBaseField', () => {
      const result = policyFactory.produce<BaseDiffField>(true, false);
      expect(result).toBeInstanceOf(BooleanDiffBaseField);
    });

    test('should produce RegExpDiffBaseField', () => {
      const result = policyFactory.produce<BaseDiffField>(/abc/, /def/);
      expect(result).toBeInstanceOf(RegExpDiffBaseField);
    });

    test('should produce ArrayDiffBaseField', () => {
      const result = policyFactory.produce<BaseDiffField>([1, 2], [2, 3]);
      expect(result).toBeInstanceOf(ArrayDiffBaseField);
    });

    test('should produce ObjectDiffBaseField', () => {
      const result = policyFactory.produce<BaseDiffField>({ a: 1 }, { a: 2 });
      expect(result).toBeInstanceOf(ObjectDiffBaseField);
    }); 
    
    test('should handle compareOptions', () => {
      const compareOptions: ICompareOptions = { dateFormat: 'YYYY-MM-DD' };
      const result = policyFactory.produce<BaseDiffField>(new Date(), new Date(), compareOptions);
      expect(result).toBeInstanceOf(DateDiffBaseField);
    });
  });

  describe('addPolicy method', () => {
    test('should add and use custom policy', () => {
      class CustomDiffField extends BaseDiffField {}
      policyFactory.addPolicy('custom', CustomDiffField);
      class Custom {}
      const result = policyFactory.produce<CustomDiffField>(new Custom(), new Custom());
      expect(result).toBeInstanceOf(CustomDiffField);
    });
  });

  describe('create method', () => {
    test('should create instance of StringDiffBaseField', () => {
      const result = DefaultPolicyFactory.create(StringDiffBaseField, "String1", "String2", {});
      expect(result).toBeInstanceOf(StringDiffBaseField);
    });

    test('should create instance of NumberDiffBaseField', () => {
      const result = DefaultPolicyFactory.create(NumberDiffBaseField, 1, 2, {});
      expect(result).toBeInstanceOf(NumberDiffBaseField);
    });
  }); 
});