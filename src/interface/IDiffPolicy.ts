import { DiffType } from "@/enums/diffType";
import { ValueType } from "@/enums/valueType"; 
import { DiffObjType } from "@/type/DiffObjType";
/**
 * 对比策略接口
 */
export interface IDiffPolicy {
  /**
   * 值类型
   */
  valueType: ValueType|string;
  /**
   * 每个策略类里重写该方法，比较两个对象是否一致，并且把比较结果返回到diffType字段
   * @param origin 
   * @param comparing 
   * @returns {DiffType}
   */
  compare<T>(origin: null|undefined|T, comparing: null|undefined|T): DiffType ;
    /**
   * 检查传入的对象类型是否一致，忽略null和undefined
   * 也可以重写该方法，实现自定义的类型检查逻辑，检查比较的两个对象类型是否一致，若不一致则抛出异常
   * @param origin 
   * @param comparing 
   * @returns {boolean}
   */
  checkObjectType<T>(origin: null|undefined|T, comparing: null|undefined|T): boolean ;
  
  /**
   * 生成diff对象
   * @param originRawObj 
   * @param comparingRawObj  
   * @returns {DiffObjType}
   */
  doDiff<T>(originRawObj: null|undefined|T, comparingRawObj: null|undefined|T): DiffObjType
}