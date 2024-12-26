import { BaseDiffField } from "@/policys/BaseDiffField";
/**
 * DiffObjType
 * 包含了所有的BaseDiffField类型（数组，键值对，Map）
 */
export type DiffObjType = BaseDiffField|Array<BaseDiffField>|Record<string,BaseDiffField>|Record<string,Record<string,BaseDiffField>>;