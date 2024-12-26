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
export class DefaultPolicyFactory {
  static policyMap:Map<string,any> = new Map();
  constructor(){
    DefaultPolicyFactory.policyMap.set(ValueType.String,StringDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.Number,NumberDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.Date,DateDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.Boolean,BooleanDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.RegExp,RegExpDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.Array,ArrayDiffBaseField);
    DefaultPolicyFactory.policyMap.set(ValueType.Object,ObjectDiffBaseField);
    console.log(`Diffoo ${version}`);
  }
  static create<T extends BaseDiffField>(c:new(origin,comparing,compareOptions:ICompareOptions)=>T,originRawObj,comparingRawObj,compareOptions:ICompareOptions):BaseDiffField{
    return (new c(originRawObj,comparingRawObj,compareOptions).getProxy());
  }
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
      result = DefaultPolicyFactory.create(DefaultPolicyFactory.policyMap.get(type),originRawObj,comparingRawObj,{...compareOptions,policyFactory:this});
    }
    else if (types.length === 0){
      result = DefaultPolicyFactory.create(DefaultPolicyFactory.policyMap.get(ValueType.Object),originRawObj,comparingRawObj,{...compareOptions,policyFactory:this});
    }
    return result;
  }
  /**
   *  添加策略
   * @param type 
   * @param policy 
   */
  addPolicy(type:string,policy:BaseDiffField){
    DefaultPolicyFactory.policyMap.set(type,policy);
  }

  static addProxy<T extends BaseDiffField>(diffObj:T){
    return diffObj.getProxy()
  }
}