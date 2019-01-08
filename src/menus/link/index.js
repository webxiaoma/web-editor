import $ from  '@/utils/jq-utils'

/**
 * 超链接
 */

function Link(editor){
   this.editor = editor
   this.$ele = $(`  <li>
                        <div class="simple-editor-link" style="display: none;">
                            <div class="simple-editor-wrap">
                                <div class="simple-editor-link-header">添加超链接</div>
                                <div class="simple-editor-link-text"><input type="text" placeholder="超链接标题"></div>
                                <div class="simple-editor-link-links"><input type="text" placeholder="超链接地址"></div>
                                <div class="simple-editor-link-btn">
                                    <span class="inset">插入</span>
                                    <span class="delete">删除</span>
                                </div>
                            </div>
                        </div>
                        <a title="超链接" href="javascript:;" class="editor-a-btn">
                          <i class="iconfont icon-link"></i>
                        </a>
                    </li>`)
   this.init()
   return this
}


Link.prototype = Object.assign(Link.prototype,{ 
    init(){
       let $ele = this.$ele
       // 初始化点击事件
       this.click()
       // 初始化插入事件
       this.insertClick()
       // 初始化删除事件
       this.deleteClick()

    },
    click(){ // 点击事件
        this.$ele.children(".editor-a-btn").on("click",function(e){
               $(this).prev().show()
        })
    },
    insertClick(){ // 插入
        var $ele = this.$ele
        $ele.children(".inset").on("click",(e)=>{

            console.log(this.editor)

            $ele.children(".simple-editor-link").hide()
        })
    },
    deleteClick(){ // 删除
        var $ele = this.$ele
        $ele.children(".delete").on("click",(e)=>{
            $ele.children(".simple-editor-link").hide()
        })
    },
    changeStyle(){ // 添加激活样式
       let bol = this.editor.command.getState("Link");
       let $a = this.$ele.children("a")

       bol?$a.addClass("active"):$a.removeClass("active")
    }

})

export default Link