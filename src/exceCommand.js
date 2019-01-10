let D = document;

function Command(editor){
    this.editor = editor
}

Command.prototype = Object.assign(Command.prototype,{
   exce(name="",value=null){// execCommand

      // 恢复选区
      this.editor.range.recoverRange() 
      D.execCommand('styleWithCSS', null, true)

      let _name = `_${name}`

      if (this[_name]) {
         // 有自定义事件
         this[_name](value)
     } else {
         // 默认 command
         return D.execCommand(name, false, value);
     }
     
   } ,

    // 获取样式
   getStyle(style){
      return D.queryCommandValue(style)
   },

  //获取某操作的状态，是否开启
   getState(name){
      return D.queryCommandState(name)
   },
   // command方法是否被支持 document.queryCommandSupported
   getSupported(name){
      return D.queryCommandSupported(name)
   }
   
},{
   // 封装 insertHTML
  _insertHTML(html){
      let editor = this.editor
      let range = editor.range.currentRange

      if (this.getSupported('insertHTML')) {
         // W3C
         D.execCommand('insertHTML', false, html);
      } else if (range.insertNode) {
         // IE
         range.deleteContents()
         range.insertNode($(html)[0])
      } else if (range.pasteHTML) {
         // IE <= 10
         range.pasteHTML(html)
      } 
  }


})


export default Command
 
 