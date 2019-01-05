


function Command(editor){
    this.editor = editor
}

Command.prototype = Object.assign(Command.prototype,{
   exce(name="",value=null){// execCommand
      document.execCommand('styleWithCSS', null, true)
      return document.execCommand(name, false, value);
   },
   getStyle(style){// 获取样式
      return document.queryCommandValue(style)
   },
   getState(name){//获取某操作的状态，是否开启
      return document.queryCommandState(name)
   }
})


export default Command
 
 