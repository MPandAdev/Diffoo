import { ICompareOptions } from '../interface/ICompareOptions';
import { BaseDiffField } from './BaseDiffField';
import { DiffType } from '../enums/diffType';
import { ValueType } from '../enums/valueType';
import { DiffObjType } from '../type/DiffObjType';
import { Logger } from '@/utils/Logger';
export class ObjectDiffBaseField extends BaseDiffField {
  constructor(originRawObj, comparingRawObj, compareOptions: ICompareOptions) {
    super(originRawObj, comparingRawObj, compareOptions);
  }
  compare(origin: Object, comparing: Object): DiffType {
    if (origin === comparing) {
      return DiffType.Equal;
    }
    if (origin && !comparing) {
      return DiffType.Delete;
    }
    if (!origin && comparing) {
      return DiffType.Add;
    }
    const compared = this.doDiff(origin, comparing) as Record<string, BaseDiffField>;
    let arr = []
    for (let value of Object.values(compared)) {
      arr.push(value)
    }  
    return  arr.filter(item=>item).filter(item => ![DiffType.Equal,DiffType.Ignore].includes(item.diffType)).length>0?DiffType.Update:DiffType.Equal
  }
  doDiff(originRawObj: Object, comparingRawObj: Object): DiffObjType {
    // if ([originRawObj, comparingRawObj].some(item => (null === item || undefined === item))) return this;
    let policyFactory = this.policyFactory
    const resultDiffObj: DiffObjType = {} as Record<string, BaseDiffField>;
    const fieldMap = new Set<string>();
    const originFieds = originRawObj?Object.keys(originRawObj):[];
    originFieds.forEach(key => {
      fieldMap.add(key);
    });
    const comparingFieds = comparingRawObj?Object.keys(comparingRawObj):[];
    comparingFieds.forEach(key => {
      fieldMap.add(key);
    });
    let ignoreFields: Record<string, Boolean> | Record<string, Record<string, Boolean>> = this.compareOptions.ignoreFields;
    let includeFields: Record<string, Boolean> | Record<string, Record<string, Boolean>> = this.compareOptions.includeFields;
    const fullFields = originFieds.concat(comparingFieds).filter((value, index, self) => self.indexOf(value) === index)
    if(!originRawObj){
      originRawObj = {}
    }
    if(!comparingRawObj){
      comparingRawObj = {}
    }
    if(includeFields && Object.keys(includeFields).length>0 ){
      fullFields.forEach(key => {
        if(!ignoreFields){
          ignoreFields = {}
        }
        if(!!!ignoreFields[key]){
          ignoreFields[key] = true
        }
        if(typeof includeFields[key] === ValueType.Boolean){
          ignoreFields[key] = !includeFields[key];
        }
      })
    }
    this.logger.log('[ObjectDiffBaseField]includeFields',includeFields)
    this.logger.log('[ObjectDiffBaseField]ignoreFields',ignoreFields)
    fieldMap.forEach(key => {
      let primaryKeyFields: Record<string, Boolean> | Record<string, Record<string, Boolean>> = this.compareOptions.primaryKeyFields;
      let nextLayerPrimaryKeyFields;
      this.logger.log('[ObjectDiffBaseField]fieldMap[key:'+key+']')
      if (this.compareOptions.primaryKeyFields && this.compareOptions.primaryKeyFields[key] && typeof this.compareOptions.primaryKeyFields[key] === ValueType.Object) {
        nextLayerPrimaryKeyFields = primaryKeyFields;
        if (null === nextLayerPrimaryKeyFields || undefined === nextLayerPrimaryKeyFields || typeof nextLayerPrimaryKeyFields === ValueType.Boolean) {
          nextLayerPrimaryKeyFields = {};
        }
      }
      let nextLayerIgnoreFields = this.compareOptions?.ignoreFields?this.compareOptions?.ignoreFields[key]:null;
      let nextLayerIncludeFields = this.compareOptions?.includeFields?this.compareOptions?.includeFields[key]:null;
      if( null === nextLayerIgnoreFields || undefined === nextLayerIgnoreFields || typeof nextLayerIgnoreFields === ValueType.Boolean ){
        nextLayerIgnoreFields = {};
      }
      if( null === nextLayerIncludeFields || undefined === nextLayerIncludeFields || typeof nextLayerIncludeFields === ValueType.Boolean ){
        nextLayerIncludeFields = {};
      }  
      if(!Object.keys(originRawObj).find(k => k === key)){
        originRawObj[key] = null;
      }
      if(!Object.keys(comparingRawObj).find(k => k === key)){
        comparingRawObj[key] = null;
      }
      let result = null;
      try{
        if(ignoreFields && ignoreFields[key] && typeof ignoreFields[key] === ValueType.Boolean){
          result = policyFactory.produce(originRawObj[key], null, { ...this.compareOptions, primaryKeyFields:nextLayerPrimaryKeyFields ,ignoreFields:nextLayerIgnoreFields, includeFields:nextLayerIncludeFields});
          result.diffType = DiffType.Ignore;
        }else{
          result = policyFactory.produce(originRawObj[key], comparingRawObj[key], { ...this.compareOptions, primaryKeyFields:nextLayerPrimaryKeyFields ,ignoreFields:nextLayerIgnoreFields, includeFields:nextLayerIncludeFields});
        }
        if(!result){
          resultDiffObj[key] = null;
        }else{
          resultDiffObj[key] = result;
        }
      }catch(e){ 
        this.logger.error(e)
      } 
    });
    return resultDiffObj;
  }
}