import { ICompareOptions } from '../interface/ICompareOptions';
import { BaseDiffField } from './BaseDiffField';
import { DiffType } from '../enums/diffType';
export class StringDiffBaseField extends BaseDiffField {
  constructor(originRawObj, comparingRawObj, compareOptions: ICompareOptions) {
    super(originRawObj, comparingRawObj, compareOptions);
  }
  compare(origin: unknown, comparing: unknown): DiffType {
    if (origin && null === comparing) {
      return DiffType.Delete;
    }
    if (null === origin && comparing) {
      return DiffType.Add;
    }
    if (origin === comparing && (comparing === null || comparing === undefined)) {
      return DiffType.Equal;
    }
    if (this.compareOptions) {
      if (this.compareOptions.ignoreCase) {
        origin = (origin as string).toLowerCase();
        comparing = (comparing as string).toLowerCase();
      }
      if (this.compareOptions.ignoreSpace) {
        origin = (origin as string).replace(/\s/g, "");
        comparing = (comparing as string).replace(/\s/g, "");
      }
    }
    return origin === comparing ? DiffType.Equal : DiffType.Update;
  }
}