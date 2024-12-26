import { DiffType } from '../enums/diffType';
import { BaseDiffField } from './BaseDiffField';
import { ICompareOptions } from '../interface/ICompareOptions';
export class BooleanDiffBaseField extends BaseDiffField {
  constructor(originRawObj, comparingRawObj, compareOptions: ICompareOptions) {
    // console.log(originRawObj, comparingRawObj)
    super(originRawObj, comparingRawObj, compareOptions);
  }
  compare<Boolean>(origin: undefined | null | Boolean, comparing: undefined | null | Boolean): DiffType {

    if (origin && (null === comparing || undefined === comparing)) {
      return DiffType.Delete;
    }
    if ((null === origin || undefined === origin) && comparing) {
      return DiffType.Add;
    }
    if (origin === comparing) {
      return DiffType.Equal;
    } else {
      return DiffType.Update;
    }
  }
}