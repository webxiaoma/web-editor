
// 添加样式事件
const exce = (name="",value=null)=>{
    return document.execCommand(name, false, value);
}


// 获取样式
const getStyle = (style)=>{ 
   return document.queryCommandValue(style)
}

//获取某操作的状态，是否开启
const getState = () =>{
   return document.queryCommandState('bold')
}

 
 export default {
   exce,
   getStyle,
   getState
 }
 
 