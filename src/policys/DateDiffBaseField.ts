import { DiffType } from '../enums/diffType';
import { BaseDiffField } from './BaseDiffField';
import { ICompareOptions } from '../interface/ICompareOptions';
import dayjs from 'dayjs';
export class DateDiffBaseField extends BaseDiffField {
  constructor(originRawObj, comparingRawObj, compareOptions: ICompareOptions) {
    super(originRawObj, comparingRawObj, compareOptions);
  }
  compare(origin: unknown, comparing: unknown): DiffType {
    if (origin && this.compareOptions && this.compareOptions.dateFormat) {
      origin = (origin as Date).getTime();
      origin = dayjs(dayjs((origin as Date)).format(this.compareOptions.dateFormat), this.compareOptions.dateFormat).toDate();
    }
    if (origin === "Invalid Date") {
      throw new Error("[Origin] Invalid Date");
    }
    if (comparing && this.compareOptions && this.compareOptions.dateFormat) {
      comparing = (comparing as Date).getTime();
      comparing = dayjs(dayjs((comparing as Date)).format(this.compareOptions.dateFormat), this.compareOptions.dateFormat).toDate();
    }
    if (comparing === "Invalid Date") {
      throw new Error("[Comparing] Invalid Date");
    }
    if (null === origin && null === comparing) {
      return DiffType.Equal;
    }
    if (dayjs((origin as Date)).isSame((comparing as Date))) {
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