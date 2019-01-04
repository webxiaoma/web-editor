import $ from  '@/utils/jq-utils'

/**
 * 字体加粗
 */

function Bold(editor){
   this.editor = editor
   this.$ele = $(`<li>
                     <a title="加粗" href="javascript:;" class="editor-a-btn">
                        <i class="iconfont icon-fuhao-jiacu"></i>
                     </a>
                  </li>`)
   this.init()
   return this
}


Bold.prototype = Object.assign(Bold.prototype,{ 
    init(){
       let $ele = this.$ele
       // 绑定click
       $ele.on("click",(e)=>this.click(e))
      
    },
    click(e){ // 点击事件
        this.editor.com.exce("bold")
        this.changeStyle()
    },
    changeStyle(){ // 添加激活样式
       let bol = this.editor.com.getState("bold");
       let $a = this.$ele.children("a")

       bol?$a.addClass("active"):$a.removeClass("active")
    }

})

export default Bold