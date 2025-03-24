import { DiffType } from "@/enums/diffType";
import { ArrayDiffBaseField, BaseDiffField, ObjectDiffBaseField } from "@/policys";

export default function (prop,target) {
  if(null == target){
    return null;
  }  
  return __getDiffTree(target);
}
function __getDiffTree(root){
  let leafNodes = __getLeafNode(root);
  return leafNodes;
}

function __getLeafNode(node){ 
  if(null == node){
    return null;
  }
  if(node.isLeafNode){
    return node;
  }
  if(skipNode(node)){
    return null;
  }
  if(node instanceof Array){
    return node.map(item => {
      return __getLeafNode(item);
    }).filter(i=>i);
  } 
  return Object.values(node.diffObj).map(item => {
    return __getLeafNode(item);
  }).filter(i=>i);
}
function __getRootNode(node){
  if(null == node){
    return node;
  }
  if(node.parent){
    return __getRootNode(node.parent);
  } 
  return node;
}
function skipNode(root){
  return [DiffType.Equal, DiffType.Ignore].includes(root.diffType) ;
}