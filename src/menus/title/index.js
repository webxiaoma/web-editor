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
                        </li><li data-h="h4">
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
       // 绑定click
   
       this.hover()
    },
    click(e){ // 点击事件
        // this.editor.com.exce("bold")
        // this.changeStyle()
    },
    hover(){ // hover 事件
        console.log(this.$ele.children(".simple-editor-ul-h"))
        this.$ele.children(".simple-editor-ul-h").on("click",()=>{
            console.log(111)
        })
    },
    changeStyle(){ // 添加激活样式
    //    let bol = this.editor.com.getState("bold");
    //    let $a = this.$ele.children("a")

    //    bol?$a.addClass("active"):$a.removeClass("active")
    }

})

export default Title


