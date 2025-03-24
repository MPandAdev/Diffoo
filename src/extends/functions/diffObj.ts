export default function (prop,target) {
  return target === target.diffObj?null:target.diffObj;
}