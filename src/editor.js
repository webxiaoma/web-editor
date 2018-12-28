import $ from './utils/jq-utils'
import initOptions from './options'
import menusAry from './menus'


function Editor(el,options = {}){
    this.el = $(el,true);
    this.options = Object.assign(initOptions,options);
    this.currentRange = null;

    return this.init()
}

Editor.fn = Editor.prototype = {
    // 初始化
    init(){ 
        let div = document.querySelectorAll("div")
        // let div = document.createElement("div")
        this.layout() // 样式构架
        this.eventListening() // 事件监听
    },

    // 初始化编辑器样式结构
    layout(){
        let $editorWarp = $('<div>');
        let $editorHeader = $('<div>');
        let $editorBody = $('<div>');
        let $editorUl = $("<ul>")
        
        $editorUl.addClass("simple-editor-ul")
        $editorHeader.addClass("simple-editor-header").append($editorUl)
        $editorBody.html("<div><br/></div>") // 回车以div换行问题
                   .addClass("simple-editor-body")
                   .attr("contentEditable",true)

        $editorWarp.append($editorHeader)
                   .append($editorBody)
                   .addClass("simple-editor-wrap");
        
                  
        console.log(new menusAry[0](this).ele)
        $editorUl.html(new menusAry[0](this).ele)

        this.el.html("").append($editorWarp)
        let editorStr = `<div class="simple-editor-wrap">
                            <div class="simple-editor-header">
                                <ul class="simple-editor-ul"></ul>
                            </div>
                            <div class="simple-editor-body" contenteditable="true">
                                <div><br></div>
                            </div>
                         </div>`

        
         console.log(this.el.children(".simple-editor-body"))
       
        // let keyAryLength = actionsKeys.length
        // for(let i=0;i<keyAryLength;i++){
        //    let actionsObj = actions[actionsKeys[i]]
        //    let li = D.createElement("li");
        //    let a = D.createElement("a");

        //    a.title = actionsObj.title;
        //    a.href = "javascript:;"
        //    a.classList.add("editor-a-btn");
        // //    a.onclick = actionsObj.actions;  // 采用有问题

        //    // 使用on 来绑定事件
        //    actionsObj.element = a;
           

        //    if(actionsObj.hoverLeave){
        //      actionsObj.hoverLeave(li,this)
        //    }

        //    a.on("click",function(e){
        //        if(!actionsObj.hoverLeave){
        //          actionsObj.actions(this)
        //        }
        //    })

        //    a.innerHTML = `<i class="iconfont ${actionsObj.icon}"></i>`;
        //    li.append(a)
        //    editorUl.append(li)
        // }
        // $editorWarp.classList.add("simple-editor-wrap")
        // editorHeader.classList.add("simple-editor-header")
        // editorUl.classList.add("simple-editor-ul")
        // editorBody.innerHTML = "<div><br/></div>" // 回车以div换行问题
        // editorBody.classList.add("simple-editor-body")
        // editorBody.setAttribute("contentEditable",true)

        // editorHeader.append(editorUl)
        // $editorWarp.append(editorHeader)
        // $editorWarp.append(editorBody)
        // this.el.innerHTML = "";
        // this.el.append($editorWarp)
    },

     // 事件监听
    eventListening(){
        let $editorBody = this.el.children(".simple-editor-body")

        /**
         * 监听input事件
         **/
        $editorBody.on("input",(e)=>{
            //  this.onchange(e.target.innerHTML)
            var range = this.getCursor()
            this.activeIcon(range) // 头部active 样式激活
            this.options.onchange(e.target.innerHTML)
        })

        /**
         * 监听click事件
         **/
        $editorBody.on("click",()=>{
            this.saveRange()// 保存光标状态
            this.activeIcon(this.currentRange) // 头部active 样式激活
            this.options.cursorChange(this.currentRange)
        })

         /**
         * 监听键盘事件
         **/
        $editorBody.on("keyup",(e)=>{
            this.saveRange() // 保存光标状态
            // 监听回车
            if(e.keyCode == 13&&this.getCursor().commonAncestorContainer.localName === "blockquote"){
                this.changeTag("p")
            }

            //按下了删除键
            if(e.keyCode === 8){
                if(!this.innerHTML || this.innerHTML === "<br>"){
                    // this.innerHTML = "<p><br/></p>"
                    this.innerHTML = "<div><br/></div>"
                }
            }
        })

         /**
         * 监听blur事件
         **/
        $editorBody.on("blur",(e)=>{
            // 头部active
            this.saveRange()
            this.activeIcon(this.currentRange)
        })

        return this


       
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