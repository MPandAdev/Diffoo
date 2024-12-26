import { Logger } from "@/utils/Logger";
import { DiffType } from "../enums/diffType";
import { DefaultPolicyFactory } from "../factory/defaultPolicyFactory";
import { ICompareOptions } from "../interface/ICompareOptions";
import { IDefaultDiffBaseField } from "../interface/IDefaultDiffBaseField";
import { DiffObjType } from "../type/DiffObjType";

/**
 * 基础比较策略类
 * 
 * Base comparison strategy class
 *
 * @export
 * @class BaseDiffField
 * @implements {IDefaultDiffBaseField}
 */
export class BaseDiffField implements IDefaultDiffBaseField{
  originRawObj: unknown;
  /**
   * 原始对象
   * 
   * Original object
   *
   * @type {unknown}
   * @memberof BaseDiffField
   */
  originObj: unknown;
  comparingRawObj: unknown; 
  /**
   * 比较对象
   * 
   * Comparing object
   *
   * @type {unknown}
   * @memberof BaseDiffField
   */
  comparingObj: unknown;
  diffObj: DiffObjType;
  valueType: string;
  diffType: DiffType;

  /**
   * 比较选项
   * 
   * Comparison options
   *
   * @type {ICompareOptions}
   * @memberof BaseDiffField
   */
  compareOptions: ICompareOptions;
  policyFactory: DefaultPolicyFactory;
  logger: Logger;
  constructor(originRawObj,comparingRawObj,compareOptions?:ICompareOptions){
    this.originRawObj = originRawObj;
    this.comparingRawObj = comparingRawObj;
    this.compareOptions = compareOptions;
    this.policyFactory = compareOptions.policyFactory;
    this.logger = new Logger(compareOptions.debug);
    if(this.checkObjectType(originRawObj,comparingRawObj)){
      this.__compare__(this.originRawObj,this.comparingRawObj);
    } else {
      throw new Error("Object types are inconsistent and cannot be compared!");
    }
  }
  /**
   * 比较两个对象
   * 
   * Compare two objects
   *
   * @template T
   * @param {(null|undefined|T)} originRawObj
   * @param {(null|undefined|T)} comparingRawObj
   * @memberof BaseDiffField
   */
  __compare__<T>(originRawObj: null|undefined|T, comparingRawObj: null|undefined|T) {
    this.diffType = this.compare(originRawObj,comparingRawObj);
    this.__doDiff(originRawObj,comparingRawObj);
    this.originObj = this.__getOriginFromDiff(this.diffObj);
    this.comparingObj = this.__getComparingFromDiff(this.diffObj);
  }


/**
 * 从比较结果中获取原始对象
 * 
 * Get the original object from the comparison result
 *
 * @param {DiffObjType} diffObj
 * @return {*}  {unknown}
 * @memberof BaseDiffField
 */
__getOriginFromDiff(diffObj: DiffObjType): unknown { 
    if(!diffObj){
      return this
    }
    const diffType = (diffObj as BaseDiffField).diffType;
    return ([DiffType.Delete,DiffType.Update,DiffType.Equal].includes(diffType)) ? diffObj : null;
  }
  /**
   * 从比较结果中获取比较对象
   * 
   * Get the comparison object from the comparison result
   *
   * @param {DiffObjType} diffObj
   * @return {*}  {unknown}
   * @memberof BaseDiffField
   */
  __getComparingFromDiff(diffObj: DiffObjType): unknown { 
    if(!diffObj){
      return this
    }
    const diffType = (diffObj as BaseDiffField).diffType;
    return ([DiffType.Add,DiffType.Update,DiffType.Equal].includes(diffType)) ?  diffObj : null;
  }
  /**
   * 执行比较
   * 
   * Perform comparison
   *
   * @template T
   * @param {(null|undefined|T)} originRawObj
   * @param {(null|undefined|T)} comparingRawObj
   * @return {*}  {DiffObjType}
   * @memberof BaseDiffField
   */
  __doDiff<T>(originRawObj: null|undefined|T, comparingRawObj: null|undefined|T): DiffObjType {
    if(!this.diffObj){
      this.diffObj = this.doDiff(originRawObj,comparingRawObj);
    }
    return this.diffObj;
  }
  /**
   * 执行比较
   * 
   * Perform comparison
   *
   * @template T
   * @param {(null|undefined|T)} originRawObj
   * @param {(null|undefined|T)} comparingRawObj
   * @return {*}  {DiffObjType}
   * @memberof BaseDiffField
   */
  doDiff<T>(originRawObj: null|undefined|T, comparingRawObj: null|undefined|T): DiffObjType {
    return this;
  }
  /**
   * 比较两个对象
   *
   * @template T
   * @param {(null|undefined|T)} origin
   * @param {(null|undefined|T)} comparing
   * @return {*}  {DiffType}
   * @memberof BaseDiffField
   */
  compare<T>(origin: null|undefined|T, comparing: null|undefined|T): DiffType {
    if(origin === comparing){
      return DiffType.Equal;
    }else{
      if(origin && !comparing){
        return DiffType.Delete;
      }
      if(!origin && comparing){
        return DiffType.Add;
      }
      return DiffType.Update;
    }
  }
  /**
   * 检查对象类型
   * 
   * Check object type
   *
   * @param {unknown} origin
   * @param {unknown} comparing
   * @return {*}  {boolean}
   * @memberof BaseDiffField
   */
  checkObjectType(origin: unknown, comparing: unknown): boolean {
    const ifOriginNull = origin === null || origin === undefined;
    const ifComparingNull = comparing === null || comparing === undefined;
    if(ifOriginNull || ifComparingNull){
      return true;
    }else{
      let types = [origin,comparing].map(obj=>obj.constructor.name.toLowerCase()).filter(obj=>obj).filter((obj,index,self)=>self.indexOf(obj) === index);
      if(types.length === 1){
        this.setValueType(types[0]);
        return true
      }else{
        return false;
      }
    }
  }
  setValueType(valueType: string) {
    this.valueType = valueType;
  }
  getOriginRaw(): unknown {
    return this.originRawObj;
  }
  getOrigin(): unknown {
    return this.originObj;
  }
  getComparingRaw(): unknown {
    return this.comparingRawObj;
  }
  getComparing(): unknown {
    return this.comparingObj;
  }
  setValue(value: unknown) {
    if(this.checkObjectType(value,this.comparingRawObj)){
      this.comparingRawObj = value;
      this.__compare__(this.originRawObj,this.comparingRawObj);
    } 
  }
  /**
   * 获取代理对象
   * 
   * Get proxy object
   *
   * @return {*} 
   * @memberof BaseDiffField
   */
  getProxy(){
    return new Proxy(this,{
      get(target,prop,receiver){
        if(prop === 'value'){
          return target.comparingRawObj;
        }
        if(prop === 'diff'||prop === 'diffObj'){
          return target === target.diffObj?null:target.diffObj;
        } 
        return Reflect.get(target,prop,receiver);
      },
      set(target,prop,value,receiver){
        if(prop === 'value'){
          target.setValue(value);
          return true
        }
        return Reflect.set(target,prop,value,receiver);
      },
      
    })
  }
}