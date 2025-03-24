import definedFunctions from './functions'
export const handleProxyFuncs = (prop,target) => {
  return definedFunctions[prop] && definedFunctions[prop](prop,target);
}
export const checkProxyFuncExist = (prop) => {
  return !!definedFunctions[prop];
}