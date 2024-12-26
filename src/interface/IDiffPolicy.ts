import { DiffType } from "../enums/diffType";
import { ValueType } from "../enums/valueType";
import { DiffObjType } from "../type/DiffObjType";
/**
 * 对比策略接口
 *
 * @export
 * @interface IDiffPolicy
 */
export interface IDiffPolicy {
  /**
   * 值类型
   * 
   * Valur Type
   *
   * @type {(ValueType|string)}
   * @memberof IDiffPolicy
   */
  valueType: ValueType | string;
  /**
   * 每个策略类里重写该方法，比较两个对象是否一致，并且把比较结果返回到diffType字段
   *
   * Compare two objects to see if they are the same, and return the comparison result to the diffType field
   * 
   * @template T
   * @param {(null | undefined | T)} origin
   * @param {(null | undefined | T)} comparing
   * @return {*}  {DiffType}
   * @memberof IDiffPolicy
   */
  compare<T>(origin: null | undefined | T, comparing: null | undefined | T): DiffType;
  /**
   * 检查传入的对象类型是否一致，忽略null和undefined
   * 
   * 也可以重写该方法，实现自定义的类型检查逻辑，检查比较的两个对象类型是否一致，若不一致则抛出异常
   *
   * Check if the types of the passed objects are consistent, ignoring null and undefined
   * 
   * You can also override this method to implement custom type checking logic, check if the types of the two objects being compared are consistent, and throw an exception if they are not
   * 
   * @template T
   * @param {(null | undefined | T)} origin
   * @param {(null | undefined | T)} comparing
   * @return {*}  {boolean}
   * @memberof IDiffPolicy
   */
  checkObjectType<T>(origin: null | undefined | T, comparing: null | undefined | T): boolean;
  /**
   * 生成diff对象
   * 
   * Generate diff object
   *
   * @template T
   * @param {(null | undefined | T)} originRawObj
   * @param {(null | undefined | T)} comparingRawObj
   * @return {*}  {DiffObjType}
   * @memberof IDiffPolicy
   */
  doDiff<T>(originRawObj: null | undefined | T, comparingRawObj: null | undefined | T): DiffObjType
}