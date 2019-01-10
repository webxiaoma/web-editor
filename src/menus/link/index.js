import $ from  '@/utils/jq-utils'

/**
 * 超链接
 * 
 * insertHTML 方法在IE 不支持
 */

function Link(editor){
   this.editor = editor
   this.range = editor.range
   this.cmd = editor.command
   this.$ele = $(`  <li>
                        <div class="simple-editor-link" style="display: none;">
                            <div class="simple-editor-wrap">
                                <div class="simple-editor-link-header">添加超链接</div>
                                <div class="simple-editor-link-text"><input type="text" class="title-input" placeholder="超链接标题"></div>
                                <div class="simple-editor-link-links"><input type="text" class="link-input" placeholder="超链接地址"></div>
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
    _status:{ // 需要用到的状态
        isInEditor:'', // 存储光标是否在editor中
        a:null, // 存储光标父元素a
    },
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
        var _that = this,
            $ele = this.$ele;
        $ele.children(".editor-a-btn").on("click",function(e){
            let content = _that.range.getRangeString() // 获取选区文字内容
            let rangeEle = _that.range.getContainerEle() // 获取选区元素
         
            // 判断光标是否位与a标签内
            _that._status.a = null;
            if(rangeEle&&rangeEle.localName === "a"){
                _that._status.a = rangeEle
            }
            if(rangeEle&&$(rangeEle).parents("a").length>0){
                _that._status.a = $(rangeEle).parents("a")[0]
            }

             
                // 初始化input框
                if(_that._status.a){
                    var $a  = $(_that._status.a)
                    $ele.children(".title-input").val($a.text())
                    $ele.children(".link-input").val($a.attr("href"))
                    $ele.children(".delete").show()
                }else{
                    $ele.children(".title-input").val(content)
                    $ele.children(".link-input").val("")
                    $ele.children(".delete").hide()
                }
          
               $(this).prev().show()
        })
    },
    insertClick(){ // 插入
        var $ele = this.$ele
        $ele.children(".inset").on("click",(e)=>{
            var title = $ele.children(".title-input").val()
            var link = $ele.children(".link-input").val()

            if(!title&&!link){
                this.range.recoverRange()  
                $ele.children(".simple-editor-link").hide()
                return
            }

            let a = `<a  href="${link}" target="_blank">${title}</a>`
            
            if(this._status.a){ // 是否修改已存在的a标签
                $(this._status.a).text(title)
                                 .attr("href",link)
                this.range.moveRange() // 移动光标
                
            }else{ // 插入新a标签
                this.editor.command.exce('insertHTML',a)
            }
     
            $ele.children(".simple-editor-link").hide()
        })
    },
    deleteClick(){ // 删除
        var $ele = this.$ele
        $ele.children(".delete").on("click",(e)=>{ 
            if(this._status.a){
                var text = $(this._status.a).text()
                var span = `<span>${text}</span>`
                // 将a标签替换为span标签
                $.utils.replaceNode(this._status.a,span)
            }
            $ele.children(".simple-editor-link").hide()
        })
    },
    changeStyle(){ // 添加激活样式
       let bol = this.cmd.getState("Link");
       let $a = this.$ele.children("a")

       bol?$a.addClass("active"):$a.removeClass("active")
    }

})

export default Link


