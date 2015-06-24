module.exports = function(objA, objB, checkChildren){
  if(objA === objB){
    return true;
  }
  if(typeof objA !== 'object' || objA == null || typeof objB !== 'object' || objB == null){
    return false;
  }
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if(checkChildren){
    keysA = _removeItem(keysA, 'children');
    keysB = _removeItem(keysB, 'children');
  }
  if(keysA.length !== keysB.length){
    return false;
  }
  var bHasOwn = Object.prototype.hasOwnProperty.bind(objB);
  var key;
  for(var i = 0, l = keysA.length; i < l; i++){
    key = keysA[i];
    if(bHasOwn(keysA[i]) || objA[key] !== objB[key]){
      return false;
    }
  }
  if(checkChildren){
    if(!Array.isArray(objA.children) || !Array.isArray(objB.children)) return false;
    return objA.children.length === objB.children.length;
  }
  return true;
};

function _removeItem(a, item){
  var idx = a.indexOf(item);
  if(idx > -1) a.splice(idx, 1);
  return a;
}