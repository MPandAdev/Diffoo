import { DefaultPolicyFactory } from "@/factory/defaultPolicyFactory";
/**
 * 比较选项
 * 
 * Comparison options
 * @export
 * @interface ICompareOptions
 */
export interface ICompareOptions {
  /**
   * 是否忽略大小写
   * 
   * Whether to ignore case
   *
   * @type {boolean}
   * @memberof ICompareOptions
   */
  ignoreCase?: boolean;
  /**
   * 是否忽略空格
   * 
   * Whether to ignore spaces
   *
   * @type {boolean}
   * @memberof ICompareOptions
   */
  ignoreSpace?: boolean;
  /**
   * 匹配日期格式
   * 
   * Match date format
   * @type {string}
   * @memberof ICompareOptions
   */
  dateFormat?: string;
  /**
   * 忽略字段(带层级)
   *
   * Ignore fields (with hierarchy)
   * @type {(Record<string,Boolean>|Record<string,any>)}
   * @memberof ICompareOptions
   */
  ignoreFields?: Record<string, Boolean> | Record<string, any>;
  /**
   * 包含字段(带层级)
   * 
   * Include fields (with hierarchy)
   *
   * @type {(Record<string,Boolean>|Record<string,any>)}
   * @memberof ICompareOptions
   */
  includeFields?: Record<string, Boolean> | Record<string, any>;
  /**
   * 主键字段(带层级,组合主键为将多个字段设置为true)
   * 
   * Primary key fields (with hierarchy, composite primary keys are set to true for multiple fields)
   *
   * @type {(Record<string,Boolean>|Record<string,any>)}
   * @memberof ICompareOptions
   */
  primaryKeyFields?: Record<string, Boolean> | Record<string, any>;
  /**
   * 策略工厂
   *
   * Policy factory
   * 
   * @type {DefaultPolicyFactory}
   * @memberof ICompareOptions
   */
  policyFactory?: DefaultPolicyFactory;
  /**
   * 是否为严格模式
   * 
   * 严格模式下，如果字段类型不一致，将会抛出异常
   * 
   * 非严格模式下，如果字段类型分别为number和string，将会将string转为number进行比较
   * 
   * 如果字段类型分别为string和boolean，将会将string转为number进行比较(string为'TRUE'或'FALSE'或'true'或'false'时转为boolean)
   * 
   * Whether it is in strict mode
   * 
   * In strict mode, if the field types are inconsistent, an exception will be thrown
   * 
   * In non-strict mode, if the field types are number and string respectively, the string will be converted to a number for comparison
   * 
   * If the field types are string and boolean respectively, the string will be converted to a number for comparison (when the string is 'TRUE' or 'FALSE' or 'true' or 'false', it will be converted to boolean)
   *
   * @type {boolean}
   * @memberof ICompareOptions
   */
  strict?: boolean;
  /**
   * 是否调试
   * 
   * Whether to debug, Print log
   *
   * @type {boolean}
   * @memberof ICompareOptions
   */
  debug?: boolean;

  decimalToFixed?: number;
}