import { ICompareOptions } from '../interface/ICompareOptions';
import { BaseDiffField } from './BaseDiffField';
import { DiffType } from '../enums/diffType';
export class NumberDiffBaseField extends BaseDiffField {
  constructor(originRawObj, comparingRawObj, compareOptions: ICompareOptions) {
    super(originRawObj, comparingRawObj, compareOptions);
  }
  compare(origin: unknown, comparing: unknown): DiffType {
    if ((null === origin || undefined === origin) && 0 === comparing) {
      return DiffType.Add;
    }
    if (0 === origin && (null === comparing || undefined === comparing)) {
      return DiffType.Delete;
    }
    if(this.compareOptions.decimalToFixed){
      origin = parseFloat(Number(origin).toFixed(this.compareOptions.decimalToFixed))
      comparing = parseFloat(Number(comparing).toFixed(this.compareOptions.decimalToFixed))
    }
    if (origin === comparing) {
      return DiffType.Equal;
    } else {
      if (origin && !comparing) {
        return DiffType.Delete;
      }
      if (!origin && comparing) {
        return DiffType.Add;
      }
      return DiffType.Update;
    }
  }
}