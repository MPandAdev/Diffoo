import { DiffType } from "../enums/diffType"; 
import { DiffObjType } from "../type/DiffObjType";
/**
 * 对比结果类型
 *
 * @export
 * @interface IDiffBaseField
 */
export default interface IDiffBaseField {
  __id__: string;
  /**
   *原始对象
   *
   * @type {unknown}
   * @memberof IDiffBaseField
   */
  originRawObj: unknown;
  /**
   *对比对象
   *
   * @type {unknown}
   * @memberof IDiffBaseField
   */
  comparingRawObj: unknown;
  /**
   * 对比结果对象
   *
   * @type {DiffObjType}
   * @memberof IDiffBaseField
   */
  diffObj: DiffObjType;
  /**
   *对比结果类型
   *
   * @type {DiffType}
   * @memberof IDiffBaseField
   */
  diffType: DiffType;

  isLeafNode:boolean;
  /**
   *获取原始对象
   *
   * @return {*}  {unknown}
   * @memberof IDiffBaseField
   */
  getOrigin(): unknown;
    /**
   *获取原始对象
   *
   * @return {*}  {unknown}
   * @memberof IDiffBaseField
   */
  getOriginRaw(): unknown;
  /**
   *获取对比对象
   *
   * @return {*}  {unknown}
   * @memberof IDiffBaseField
   */
  getComparing(): unknown;
}