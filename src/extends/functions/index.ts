import value from './value';
import diffObj from './diffObj';
import getDiffTree from './getDiffTree';
import diffId from './id';
const definedFunctions = {
  value,
  diffObj,
  diff:diffObj,
  diffTree:getDiffTree,
  diffId
}
export default definedFunctions;