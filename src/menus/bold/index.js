/**
 * 字体加粗
 */

function Bold(editor){
   this.editor = editor
   this.ele = `<li>
                  <a title="加粗" href="javascript:;" class="editor-a-btn">
                     <i class="iconfont icon-fuhao-jiacu"></i>
                  </a>
               </li>`

  return this
}



Bold.prototype = Object.assign(Bold.prototype,{
    

})






export default Bold