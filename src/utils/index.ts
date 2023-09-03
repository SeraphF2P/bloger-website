

export const toggleValueByKey = <T>(array:T[],key:keyof T,value:T,opts = {force :undefined})=>{
  const {force} =opts
  const index = array.findIndex(val=> val[key] == value[key]);
 if(force !==undefined){
   if(force){
    return   [...array,value]
  }else{
    return [...array.slice(0,index),...array.slice(index + 1)]
  }
 }
if(index == -1){
return [...array,value]
}  else{
  return [...array.slice(0,index),...array.slice(index + 1)]
}
}