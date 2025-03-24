import { ICompareOptions } from '../interface/ICompareOptions';
import { BaseDiffField } from './BaseDiffField';
import { DiffType } from '../enums/diffType';
import { ValueType } from '../enums/valueType';
import { DiffObjType } from '../type/DiffObjType';
import { default_id_key } from '@/extends/functions/id';
export class ArrayDiffBaseField extends BaseDiffField {
  constructor(originRawObj, comparingRawObj, compareOptions: ICompareOptions) {
    super(originRawObj, comparingRawObj, compareOptions);
  } 
  __handleComparingRawObj__(comparingRawObj,compareOptions) {
    if(comparingRawObj && null !== compareOptions.injectId && undefined !== compareOptions.injectId){
      let injectIdKey = compareOptions.injectId;
      if(typeof compareOptions.injectId === ValueType.Boolean){
        comparingRawObj.forEach((item,index) => { 
          if(compareOptions.injectId){
            injectIdKey = default_id_key
            comparingRawObj[index][injectIdKey] = this.__id__;
          }
        })
      }else{
        comparingRawObj.forEach((item,index) => { 
          comparingRawObj[index][injectIdKey] = this.__id__;
        })
      }
    }
    return comparingRawObj
  }
  compare(origin: unknown, comparing: unknown): DiffType {
    if ((null === origin && null === comparing) || (origin === comparing)) {
      return DiffType.Equal;
    }
    if (origin && !comparing) {
      return DiffType.Delete;
    }
    if (!origin && comparing) {
      return DiffType.Add;
    }
    const compared: any = this.doDiff(origin, comparing)
    return compared.filter(item => item).filter(item => ![DiffType.Equal, DiffType.Ignore].includes(item.diffType)).length > 0 ? DiffType.Update : DiffType.Equal
  }
  applyArray(originRawList, comparingRawList) {
    // 取最大长度，补全数组长度
    const listArr = [originRawList, comparingRawList]
    const maxLenght = listArr.map(arr => arr.length).sort((a, b) => b - a)[0];
    return listArr.map(arr => {
      const nullArray = Array.from({ length: maxLenght - arr.length }).fill(null);
      arr = arr.concat(nullArray)
      return arr
    })
  }
  __getOriginFromDiff(diffObj: DiffObjType): unknown {
    if (!diffObj) {
      return null
    }
    const diffObjArray = (diffObj as Array<BaseDiffField>);
    return diffObjArray.filter(item => [DiffType.Delete, DiffType.Update, DiffType.Equal, DiffType.Ignore].includes(item.diffType))
  }
  __getComparingFromDiff(diffObj: DiffObjType): unknown {
    if (!diffObj) {
      return null
    }
    const diffObjArray = (diffObj as Array<BaseDiffField>);
    return diffObjArray.filter(item => [DiffType.Add, DiffType.Update, DiffType.Equal, DiffType.Ignore].includes(item.diffType))
  }
  getCombinedKey(item: any, combinedKeyArr: string[], identifier: string) {
    if (!combinedKeyArr || combinedKeyArr.length === 0) {
      throw new Error('Primary key not defined!')
    }
    return combinedKeyArr.map(key => {
      if(this.compareOptions.ignoreSpace){
        item[key] = item[key].trim();
      }
      return item[key]
    }).join(identifier)
  }
  doDiff(originRawObj: unknown, comparingRawObj: unknown): DiffObjType {
    let policyFactory = this.policyFactory
    let result = null;
    if ([originRawObj, comparingRawObj].some(item => item === null)) {
      originRawObj = originRawObj || []
      comparingRawObj = comparingRawObj || []
      result = policyFactory.produce(originRawObj, comparingRawObj, this.compareOptions)
      if (null === result) {
        return this;
      }
    }
    let originRawList = originRawObj as any[]
    let comparingRawList = comparingRawObj as any[]
    if (!originRawList) {
      originRawList = []
    }
    if (!comparingRawList) {
      comparingRawList = []
    }
    // 取最大长度，补全数组长度
    // if(originRawList.length !== comparingRawList.length){
    //   const [originList,comparingList] = this.applyArray(originRawList,comparingRawList)
    //   originRawList = originList;
    //   comparingRawList = comparingList
    // }
    const resultDiffObj: DiffObjType = new Array<BaseDiffField>();
    // 根据数据类型分组
    const originObjectTypes = originRawList.map(item => item.constructor.name.toLowerCase()).filter((item, index, self) => self.indexOf(item) === index)
    const comparingObjectTypes = comparingRawList.map(item => item.constructor.name.toLowerCase()).filter((item, index, self) => self.indexOf(item) === index)
    const summaryObjectTypes = originObjectTypes.concat(comparingObjectTypes).filter((item, index, self) => self.indexOf(item) === index)
    let combinedKey = null
    this.compareOptions.__parent__node__ = this;
    // ,__parent__node__:this
    if (this.compareOptions.primaryKeyFields) {
      combinedKey = Object.keys(this.compareOptions.primaryKeyFields).filter(key => this.compareOptions.primaryKeyFields[key].constructor.name.toLowerCase() === ValueType.Boolean).filter((key, index, self) => self.indexOf(key) === index)
    }
    this.logger.log('[ArrayDiffBaseField]combinedKey', combinedKey)
    const originObjectMap = new Map<string, any[]>();
    const comparingObjectMap = new Map<string, any[]>();
    summaryObjectTypes.forEach(type => {
      originObjectMap.set(type, originRawList.filter(item => item.constructor.name.toLowerCase() === type))
      comparingObjectMap.set(type, comparingRawList.filter(item => item.constructor.name.toLowerCase() === type))
    })
    const basicTypes = [ValueType.Boolean, ValueType.Date, ValueType.Number, ValueType.String, ValueType.RegExp]
    summaryObjectTypes.map(type => {
      const originObjectList = originObjectMap.get(type)
      const comparingObjectList = comparingObjectMap.get(type)
      if (!basicTypes.includes(type)) {
        // 非标准的数据类型，则根据key值进行比较
        const summaryKey = [...originObjectList.map(item => this.getCombinedKey(item, combinedKey, '_')), ...comparingObjectList.map(item => this.getCombinedKey(item, combinedKey, '_'))].filter((item, index, self) => self.indexOf(item) === index)
        summaryKey.forEach(key => {
          const originObjects = originObjectList.filter(item => this.getCombinedKey(item, combinedKey, '_') === key)
          const comparingObjects = comparingObjectList.filter(item => this.getCombinedKey(item, combinedKey, '_') === key)
          if (originObjects.length > 1) {
            this.logger.error(`[Origin] Primary key (${combinedKey.join(',')}) is duplicated! Duplicate values are ${JSON.stringify(originObjects)}`);
            throw new Error(`[Origin] Primary key (${combinedKey.join(',')}) is duplicated!`);
          }
          const originObject = originObjects[0];
          if (comparingObjects.length > 1) {
            this.logger.error(`[Comparing] Primary key (${combinedKey.join(',')}) is duplicated! Duplicate values are ${JSON.stringify(comparingObjects)}`);
            throw new Error(`[Comparing] Primary key (${combinedKey.join(',')}) is duplicated!`);
          }
          const comparingObject = comparingObjects[0]
          resultDiffObj.push(policyFactory.produce(originObject, comparingObject, this.compareOptions))
        })
      } else {
        // 标准的数据类型，则需要挨个比较是否存在
        const originSortedArray = originObjectList.sort((a, b) => a - b)
        const comparingSortedArray = comparingObjectList.sort((a, b) => a - b)
        for (let i = 0; i < comparingSortedArray.length; i++) {
          let comparingValue = comparingSortedArray[i]
          // 如果找到了相同的值，则直接返回，并且将其从originSortedArray中删除
          let index = originSortedArray.findIndex(item => item === comparingValue)
          if (index > -1) {
            resultDiffObj.push(policyFactory.produce(originSortedArray[index], comparingValue, this.compareOptions))
            originSortedArray.splice(index, 1)
          } else {
            // 如果没有找到，则说明是新增的
            resultDiffObj.push(policyFactory.produce(null, comparingValue, this.compareOptions))
          }
        }
        // 剩下的就是删除的
        originSortedArray.forEach(item => {
          resultDiffObj.push(policyFactory.produce(item, null, this.compareOptions))
        })
      }
    })
    return resultDiffObj;
  }
}