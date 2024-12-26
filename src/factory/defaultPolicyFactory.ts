import { DiffType } from "@/enums/diffType";
import { ValueType } from "@/enums/valueType";
import { ICompareOptions } from "@/interface/ICompareOptions";
import { ArrayDiffBaseField } from "@/policys/ArrayDiffBaseField";
import { BaseDiffField } from "@/policys/BaseDiffField";
import { BooleanDiffBaseField } from "@/policys/BooleanDiffBaseField";
import { DateDiffBaseField } from "@/policys/DateDiffBaseField";
import { NumberDiffBaseField } from "@/policys/NumberDiffBaseField";
import { ObjectDiffBaseField } from "@/policys/ObjectDiffBaseField";
import { RegExpDiffBaseField } from "@/policys/RegExpDiffBaseField";
import { StringDiffBaseField } from "@/policys/StringDiffBaseField";
const version = require('../../package.json').version
/**
 * 默认策略工厂
 *
 * @export
 * @class DefaultPolicyFactory
 */
export class DefaultPolicyFactory {
  static policyMap:Map<string,any> = new Map();
  constructor(){
    // 注册默认策略
    DefaultPolicyFactory.policyMap.set(ValueType.String,StringDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.Number,NumberDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.Date,DateDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.Boolean,BooleanDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.RegExp,RegExpDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.Array,ArrayDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.Object,ObjectDiffBaseField);
    DefaultPolicyFactory.version();
  }
  static version(){
    if(sessionStorage){
      if(!sessionStorage.getItem('Diffoo')){
        console.log(`Diffoo ${version}`);
        sessionStorage.setItem('Diffoo', version);
      }
    }else{
      console.log(`Diffoo ${version}`);
    }
  }
  /**
   * 创建对应类的代理
   * 
   * create proxy for corresponding class
   * @param c  策略类
   * @param originRawObj 
   * @param comparingRawObj 
   * @param compareOptions 
   * @returns 
   */
  static createProxy<T extends BaseDiffField>(c:new(origin,comparing,compareOptions:ICompareOptions)=>T,originRawObj,comparingRawObj,compareOptions:ICompareOptions):BaseDiffField{
    return (new c(originRawObj,comparingRawObj,compareOptions).getProxy());
  }
  /**
   * 比较两个对象，返回比较结果对象
   * 
   * Compare two objects, return the comparison object
   * @template T
   * @param {*} originRawObj
   * @param {*} comparingRawObj
   * @param {ICompareOptions} [compareOptions]
   * @return {*}  {T}
   * @memberof DefaultPolicyFactory
   */
  produce<T extends BaseDiffField>(originRawObj,comparingRawObj,compareOptions?:ICompareOptions):T{
    let types = [originRawObj,comparingRawObj].filter(obj=>{
      if(typeof obj === ValueType.Number || typeof obj === ValueType.Boolean){
        return true
      } else{
        return obj
      }
    })
    .map(obj=>obj.constructor.name.toLowerCase())
    .filter((obj,index,self)=>{
      return self.indexOf(obj) === index
    });
    let result = null;
    if(types.length>0){
      if(compareOptions&&!compareOptions.strict){
          /**
           * 是否为严格模式
           * 严格模式下，如果字段类型不一致，将会抛出异常
           * 非严格模式下，如果字段类型分别为number和string，将会将string转为number进行比较
           * 如果字段类型分别为string和boolean，将会将string转为number进行比较(string为'TRUE'或'FALSE'或'true'或'false'时转为boolean)
           */ 
          if(types.length==2 && types.every(type=>[ValueType.String,ValueType.Number].includes(type))){
            if(originRawObj!==null&&originRawObj!==undefined){
              originRawObj = Number(originRawObj)
            }
            if(comparingRawObj!==null&&comparingRawObj!==undefined){
              comparingRawObj = Number(comparingRawObj)
            }
          }
          if(types.length==2 &&types.every(type=>[ValueType.String,ValueType.Boolean].includes(type))){
            if(originRawObj!==null&&originRawObj!==undefined){
              originRawObj = originRawObj.toString().toLowerCase()=== 'true' ? true : false
            }
            if(comparingRawObj!==null&&comparingRawObj!==undefined){
              comparingRawObj = comparingRawObj.toString().toLowerCase()=== 'true' ? true : false
            }
          }
      }
      let type = types[0];
      if(!DefaultPolicyFactory.policyMap.has(type))
        throw new Error(`No corresponding policy class found for type: ${type}`);
      result = DefaultPolicyFactory.createProxy(DefaultPolicyFactory.policyMap.get(type),originRawObj,comparingRawObj,{...compareOptions,policyFactory:this});
    }
    else if (types.length === 0){
      result = DefaultPolicyFactory.createProxy(DefaultPolicyFactory.policyMap.get(ValueType.Object),originRawObj,comparingRawObj,{...compareOptions,policyFactory:this});
    }
    return result;
  }
  /**
   * 比较两个对象，返回比较结果对象
   * 
   * Compare two objects, return the comparison object 
   * @template T
   * @param {*} originRawObj
   * @param {*} comparingRawObj
   * @param {ICompareOptions} [compareOptions]
   * @return {*}  {T}
   * @memberof DefaultPolicyFactory
   */
  compare<T extends BaseDiffField>(originRawObj,comparingRawObj,compareOptions?:ICompareOptions):T{
    return this.produce(originRawObj,comparingRawObj,compareOptions);
  }
  /**
   * 比较两个对象，返回比较结果
   * 
   * Compare two objects, return the comparison result
   * @param originRawObj 
   * @param comparingRawObj 
   * @param compareOptions 
   * @returns 
   */
  compareResult(originRawObj,comparingRawObj,compareOptions?:ICompareOptions):DiffType{
    let resutl = this.compare(originRawObj,comparingRawObj,compareOptions);
    return resutl.diffType;
  }
  /**
   *  添加策略
   * 
   *  Add comparison policy
   * @param type 
   * @param policy 
   */
  addPolicy(type:string,policy:BaseDiffField){
    DefaultPolicyFactory.policyMap.set(type,policy);
  } 
}