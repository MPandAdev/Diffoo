import { DefaultPolicyFactory } from "@/factory/defaultPolicyFactory";

export interface ICompareOptions {
  /**
   *  是否忽略大小写
   */
  ignoreCase?: boolean;
  /**
   * 是否忽略空格
   */ 
  ignoreSpace?: boolean;
  /**
   *  匹配日期格式
   */
  dateFormat?: string;
  /**
   * 忽略字段(带层级)
   * */ 
  ignoreFields?: Record<string,Boolean>|Record<string,any>;
  /**
   *包含字段(带层级)
   */ 
  includeFields?: Record<string,Boolean>|Record<string,any>;
  /**
   * 主键字段(带层级,组合主键为将多个字段设置为true)
   */
  primaryKeyFields?: Record<string,Boolean>|Record<string,any>;
  /**
   * 策略工厂
   */
  policyFactory?: DefaultPolicyFactory;
  /**
   * 是否为严格模式
   * 严格模式下，如果字段类型不一致，将会抛出异常
   * 非严格模式下，如果字段类型分别为number和string，将会将string转为number进行比较
   * 如果字段类型分别为string和boolean，将会将string转为number进行比较(string为'TRUE'或'FALSE'或'true'或'false'时转为boolean)
   */
  strict?: boolean;
  debug?: boolean;
}