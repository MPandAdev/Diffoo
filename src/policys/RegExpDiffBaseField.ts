import { DiffType } from '../enums/diffType';
import { BaseDiffField } from './BaseDiffField';
import { ICompareOptions } from '../interface/ICompareOptions';
export class RegExpDiffBaseField extends BaseDiffField {
  constructor(originRawObj, comparingRawObj, compareOptions: ICompareOptions) {
    super(originRawObj, comparingRawObj, compareOptions);
  }
  compare(origin: unknown, comparing: unknown): DiffType {
    if (origin && (null === comparing || undefined === comparing)) {
      return DiffType.Delete;
    }
    if ((null === origin || undefined === origin) && comparing) {
      return DiffType.Add;
    }
    origin = origin as RegExp;
    comparing = comparing as RegExp;

    if (origin === comparing) {
      return DiffType.Equal;
    } else {
      return DiffType.Update;
    }
  }
}