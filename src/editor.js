import $ from './utils/jq-utils'
import initOptions from './options'
import menusAry from './menus'
import exceCom from './exceCommand'

function Editor(el,options = {}){
    this.el = $(el,true);
    this.options = Object.assign(initOptions,options);
    this.currentRange = null;
    this.com = null;  // 富文本功能
    
    return this._init()
}

Editor.fn = Editor.prototype = {
    menus:[],

    // 初始化
    _init(){ 
        this._initMenus() // 初始化菜单
        this._layout() // 初始化样式构架
        this._eventListening() // 初始化事件监听
        this._execCom()  // 初始化富文本方法
        return  this;
    },

    // 初始化菜单
    _initMenus(){
       this.menus = menusAry.map(item=>{
           return new item(this)
       })
    },

    // 初始化编辑器样式结构 
    _layout(){
        let $editorWarp = $('<div>');
        let $editorHeader = $('<div>');
        let $editorBody = $('<div>');
        let $editorUl = $("<ul>");

        $editorUl.addClass("simple-editor-ul")
        $editorHeader.addClass("simple-editor-header").append($editorUl)
        $editorBody.html("<div><br/></div>") // 回车以div换行问题
                   .addClass("simple-editor-body")
                   .attr("contentEditable",true)
               

        $editorWarp.append($editorHeader)
                   .append($editorBody)
                   .addClass("simple-editor-wrap");
        
        // 循环添加菜单栏
        for(let i=0,len=this.menus.length;i<len;i++){
            $editorUl.append(this.menus[i].$ele)
        }
       
       this.el.html("").append($editorWarp)
    },

     // 事件监听
    _eventListening(){
        let $editorBody = this.el.children(".simple-editor-body")

        /**
         * 模拟change事件 光标变化时会触发
         **/
        $editorBody.on("input  click",(e)=>{

            // 循环添加菜单栏
            for(let i=0,len=this.menus.length;i<len;i++){
                this.menus[i].changeStyle()
            }
            // this.options.onchange(e.target.innerHTML)
        })

         /**
         * 监听键盘事件
         **/
        // $editorBody.on("keyup",(e)=>{
        //     this.saveRange() // 保存光标状态
        //     // 监听回车
        //     if(e.keyCode == 13&&this.getCursor().commonAncestorContainer.localName === "blockquote"){
        //         this.changeTag("p")
        //     }

        //     //按下了删除键
        //     if(e.keyCode === 8){
        //         if(!this.innerHTML || this.innerHTML === "<br>"){
        //             // this.innerHTML = "<p><br/></p>"
        //             this.innerHTML = "<div><br/></div>"
        //         }
        //     }
        // })

         /**
         * 监听blur事件
         **/
        // $editorBody.on("blur",(e)=>{
        //     // 头部active
        //     this.saveRange()
        //     this.activeIcon(this.currentRange)
        // })

        return this
    },

 
    // 扩展富文本 execCommand
    _execCom(name,value=null){
        this.com = exceCom
    },

     // 扩展功能
    extends(obj = {}){
        Editor.prototype = Object.assign(this,obj)
    }

}


// 扩展功能
Editor.fn.extends({
     
})

export default Editor;