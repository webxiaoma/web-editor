import $ from  '@/utils/jq-utils'

/**
 * H1 - H6 标题
 */

function Title(editor){
   this.editor = editor
   this.$ele = $(`<li>
                    <ul class="simple-editor-ul-h" style="display: none;">
                        <li data-h="">
                            <a href="javascript:;">
                                正文
                            </a>
                        </li>
                        <li data-h="h1">
                            <a href="javascript:;">
                                <h1>h1</h1>
                            </a>
                        </li><li data-h="h2">
                            <a href="javascript:;">
                                <h2>h2</h2>
                            </a>
                        </li><li data-h="h3">
                            <a href="javascript:;">
                                <h3>h3</h3>
                            </a>
                        </li><li data-h="h4"  class="aaaa">
                            <a href="javascript:;">
                                <h4>h4</h4>
                            </a>
                        </li>
                    </ul>
                    <a title="H1~H6标题" href="javascript:;" class="editor-a-btn">
                        <i class="iconfont icon-titleicon"></i>
                    </a>
                </li>`)
   this.init()
   return this
}


Title.prototype = Object.assign(Title.prototype,{ 
    init(){
       let $ele = this.$ele
       this.hover()
       this.click()
    },
    click(e){ // 点击事件
       let _that = this
       this.$ele.children(".simple-editor-ul-h li").on("click",function(e){
            var tag = $(this).attr("data-h") || "<p>"
 
            _that.editor.command.exce("formatBlock",tag);
          
            _this.changeStyle()
            _that.$ele.children(".simple-editor-ul-h").hide()
       })
    },
    hover(){ // hover 事件
        this.$ele.children(".aaaa").siblings() //aa

        this.$ele.hover(function(){
            $(this).children(".simple-editor-ul-h")
                   .show()
        },function(){
            $(this).children(".simple-editor-ul-h")
                   .hide()
        })
    },
    changeStyle(){ // 添加激活样式
        var bol = this.editor.command.getStyle("formatBlock");
        var bolAry = bol.split("");
        if(bolAry[0] === "h"){
            this.$ele.children(".editor-a-btn").addClass("active")
        }else{
            this.$ele.children(".editor-a-btn").removeClass("active")
        }




    }

})

export default Title


