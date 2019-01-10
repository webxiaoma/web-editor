/**
 * jq DOM操作
 *  */

var D = document; // 存储document

function Dom(selector,bol){ // selector 为选择元素， bol为是否根元素（true为是）
    
    if(!selector){
        return this
    }
    
    // 返回 "#div" ".div" 或 创建新元素 如"<div>"
    if(typeof selector === 'string'){ 
        // 判断是否是html标签
        var htmlReg = /<(S*?)[^>]*>.*?|<.*?\/>/gim
        // 判断是否是id
        var idReg = /^#/
        
        // 处理选择器为id的
        if(idReg.test(selector)){
            let idName = selector.replace(idReg,"")
            this[0] = D.getElementById(idName)
            this.length = 1;
            return this
        }
        
        if(htmlReg.test(selector)){ 
           //创建新元素 如"<div>" "<div><li>12</li></div>" 不可以创建多节点的元素
            return this.createEle(selector)
            
        }else{ // 返回 "#div" ".div" 
            return this._querySelectorAll(selector)
        }
    }
    
    // 是DOM元素节点
    if(selector.nodeType === 1){
        this._singleEle(selector)
        return this
    }

    // 是 NodeList  或 是数组[node,node,node]
    if(this._isNodeList(selector) || Array.isArray(selector)){
         this._ListEle(selector)
         return this
    }

    return this
}


Dom.prototype = {
    constructor: Dom,
    jqDom:true, // 用于内部判断是否是jqDom元素
    // 扩展方法
    extends(obj){
      Dom.prototype = Object.assign(Dom.prototype,obj)
      return this
    },

    // 同jq html方法
    html(htmlStr){
       if(!htmlStr&&htmlStr !== ""){
          return this[0].innerHTML
       }

       if(typeof htmlStr === "string" || typeof htmlStr === "number"){
          this._forEachDom(dom=>{
              dom.innerHTML =  htmlStr
          })
       }
       return this
    },
    // 获取元素文本内容
    text(textStr){
        if(!textStr&&textStr !== ""){
            return this[0].innerText
        }

        if(typeof textStr === "string" || typeof textStr === "number"){
            this._forEachDom(dom=>{
                dom.innerText =  textStr
            })
         }
         return this
    },
    // 添加class
    addClass(className){
       if(typeof className === 'string'){
            let classList;
            // 遍历选中的每个元素
            this._forEachDom(dom=>{
               classList = dom.className.split(" ")
               classList = classList.filter(name=>{
                   if(name){
                       return name.trim()
                   }
               })
               
               // 如果不存在要添加的className就添加上
                if(classList.indexOf(className) < 0){
                  classList.push(className)
               }
               
               dom.className = classList.join(" ")
            })
       }
       return this
    },
    // 移除class
    removeClass(className){
        if(typeof className === 'string'){
            let classList;
            // 遍历选中的每个元素
            this._forEachDom(dom=>{
               classList = dom.className.split(" ")

               // 过滤class
               classList = classList.filter(name=>{
                   if(name&&name !== className){
                       return name.trim()
                   }
               })
               dom.className = classList.join(" ")
            })
        }
        return this
    },
    // 只能append jqDom元素
    append(html){
        this._forEachDom(dom=>{
            for(let i=0;i<html.length;i++){
                dom.appendChild(html[i])
            }
         })
         return this;
    },
    // 替换元素节点
    replaceNode(oldNode,newNode){
        if(!this._isNode(oldNode)){
            return new Error("请求输入节点")
        }
        // debugger
        var $parentNode = $(oldNode).parent()[0]
        
        //newNode 是节点
        if(this._isNode(newNode)){ 
            $parentNode.replaceChild(oldNode,newNode)
        }

        // newNode 是字符串
        if(typeof newNode === 'string'){
            let div = D.createElement('div')
            div.innerHTML = newNode;
            $parentNode.replaceChild(div.firstElementChild,oldNode)
        }

        return this
    },
    // 添加获取属性
    attr(name,val){
        if (!val) { // 获取值
            return this[0].getAttribute(name)
        } else { // 设置值
            return this._forEachDom(dom => {
                dom.setAttribute(name, val)
            })
        }
    },
    // 获取input value值
    val(value){
        if(!value&&value !== ""){
            return this[0].value
        }
        if(typeof value === "string" || typeof value === "number"){
            return this._forEachDom(dom=>{
                dom.value = value
            })
        }
        
    },
    // input 获取焦点事件
    focus(){
       this[0].focus()
       return this;
    },
    // 绑定监听事件
    on(eventName,selector,callback){
        let eventAry = eventName.trim().split(/\s+/ig)
        return  this._forEachDom(dom => {

            if(callback){ // 第三个参数是否存在
                // 判断selector 是否是jqDom
                if(selector.jqDom){
                    selector = selector[0]
                }
                // 代理
                eventAry.forEach(name=>{
                    dom.addEventListener(name,function(e){
                        var target = e.target
                   
                        if(target === selector){
                             callback.call(target,e)
                        }
                    })
                })
               
            }else{
                // 非代理
                let  callbackFun = selector

                eventAry.forEach(name=>{
                    dom.addEventListener(name,function(e){
                        callbackFun.call(this,e)
                    })
                })
            }

        })
    },

    // 取消监听事件
    off(eventName,callback){
        let eventAry = eventName.trim().split(/\s+/ig)
        return this._forEachDom(dom => {
            eventAry.forEach(name=>{
               dom.removeEventListener(name,callback)
            })
        })
    },

    // hover 事件
    hover(senter=()=>{},leave=()=>{}){
       this.on("mouseenter",(e)=>{
           senter.call(e.target,e)
       })

       this.on("mouseleave",(e)=>{
           leave.call(e.target,e)
       })
    },

    // 修改css
    css(style,val){
        return this._forEachDom(dom => {
           if(typeof style === 'string'){ 
              dom.style[style] = val;
           }
           
           if(typeof style === 'object'){ 
              for(item of style){
                  dom.style[item] = style[item]
              }
           }
        })
    },  
    // 元素显示
    show(){
        this.css("display","block")
    },
    // 元素隐藏
    hide(){
        this.css("display","none")
    },

    // each循环遍历
    each(callback){

        for(let i=0;i<this.length;i++){
            callback($(this[i]))
        }

        return this
    },
    // 获取子元素
    children(ele){
        if(ele){ 
           return $(this[0].querySelectorAll(ele))
        }else{
           return $(this[0].children)
        }
        
    },
    // 获取祖先元素
    parents(ele){
       let parentsAry = [],
           currentEle = this[0],
           _that = this;
        
       function eachParent(element){
           var parentEle = element.parentElement
           if(ele){
                if(parentEle&&parentEle.nodeType === 1){ // 是节点
                     // 判断是否是id或class 还是 tag
                     var  flag = _that._isIdOrClassOrTag(ele)
                     if(flag === 1){ // id
                         if(_that._isIncludeId(parentEle,ele)){
                            parentsAry.push(parentEle)
                         }    
                     }
                     if(flag === 2){ // class
                         if(_that._isIncludeClass(parentEle,ele)){
                            parentsAry.push(parentEle)
                         }
                         eachParent(parentEle)
                     }
                     if(flag === 3){  //tag
                         if(parentEle.localName === ele.trim()){
                           parentsAry.push(parentEle)
                         }
                         eachParent(parentEle)
                     }
                }
           }else{
                if(parentEle&&parentEle.nodeType === 1){ // 是节点
                    parentsAry.push(parentEle)
                    eachParent(parentEle)
                }
           }
       }
       eachParent(currentEle);
       

       return $(parentsAry)
    //    let len=parentsAry.length;
    //    for(var i = 0;i<len;i++){
    //        this[i] = parentsAry[i]
    //    }
    //    this.length = len;
    //    if(len) return this;

    },
    // 获取父元素
    parent(){
       if(this[0]){
          return $(this[0].parentNode)
       }
    },
    // 获取同胞元素
    siblings(ele){
       let siblingsAry = []
       let currentEle = this[0];
       let _that = this

       // 遍历上级
       function siblingPrev(curEle){
            var prev = curEle.previousElementSibling;
            if(ele){ 
                // 遍历上级
                if(prev&&prev.nodeType === 1){
                    // 判断是否是id或class 还是 tag
                    var  flag = _that._isIdOrClassOrTag(ele)

                    if(flag === 2){ // class
                        if(_that._isIncludeClass(prev,ele)){
                            siblingsAry.push(prev)
                        }
                    }
                    if(flag === 3){ // tag
                        if(prev.localName === ele.trim()){
                            siblingsAry.push(prev)
                        }
                    }

                    siblingPrev(prev)
                }
            }else{

                // 遍历上级
                if(prev&&prev.nodeType === 1){
                    siblingsAry.push(prev)
                    siblingPrev(prev)
                }

            }

        }
        siblingPrev(currentEle)

        // 遍历下级
        siblingNext(currentEle)
        function siblingNext(curEle){
            var next = curEle.nextElementSibling;
            if(ele){ 
                // 遍历下级
                if(next&&next.nodeType === 1){
                    // 判断是否是id或class 还是 tag
                    var  flag = _that._isIdOrClassOrTag(ele)

                    if(flag === 2){ // class
                        if(_that._isIncludeClass(next,ele)){
                            siblingsAry.push(next)
                        }
                    }
                    if(flag === 3){ // tag
                        if(next.localName === ele.trim()){
                            siblingsAry.push(next)
                        }
                    }

                    siblingNext(next)
                }

            }else{
                // 遍历下级
                if(next&&next.nodeType === 1){

                    siblingsAry.push(next)
                    siblingNext(next)
                }
            }
        }

        return $(siblingsAry)
    },
    // 上边的同胞元素
    prev(){
       let currentEle = this[0];
       let prevEle = currentEle.previousElementSibling

       return $(prevEle)

    },
    // 下边的同胞元素
    next(){
        let currentEle = this[0];
        let nextEle = currentEle.nextElementSibling
        return $(nextEle)
    }
}

Dom.fn = Dom.prototype


/**
 *  扩展方法 内部用
 **/

Dom.fn.extends({
    // 扩展querySelectorAll 选择器
    _querySelectorAll(selector){
        var eleAll = D.querySelectorAll(selector)
        var length = eleAll.length;
        if(length === 1){
            this._singleEle(eleAll[0])
        }else if(length > 1){
            this._ListEle(eleAll)
        }
    },
    // 单个元素包装真实DOM元素为$ 元素
    _singleEle(ele){
        this[0] = ele
        this.length = 1;
        return this
    },
    // nodeList元素包装真实DOM元素为$ 元素
    _ListEle(ele){
        var length = ele.length;
        for(let i = 0; i<length; i++){
            this[i] = ele[i]
        }
        this.length = length
        return this
    },
    // 判断是否是dom节点
    _isNode(ele){
       return ele.nodeType === 1 // dom 节点
    },
    // 判断是否是NodeList 对象
    _isNodeList(selector){
        if (!selector) {
            return false
        }
        if (selector instanceof HTMLCollection || selector instanceof NodeList) {
            return true
        }
        return false
    },

    // 遍历$ 元素 操作相应Dom
    _forEachDom(callback){
        for(let i=0;i<this.length;i++){
            callback(this[i])
        }
        return this
    },
    // 创建元素
    createEle(ele){
        let div = D.createElement('div');
        div.innerHTML = ele;
        
        this[0] = div.children[0];
        this.length = 1;
        
        return this
    },

    // 判断是包含class
    _isIncludeClass(ele,value){
        let classList = ele.jqDom?ele[0].classList:ele.classList
        let newValue = value.trim().replace(/^\./,"")
        let result = false;

        for(var i = 0, len=classList.length;i<len;i++){
            if(classList[i] === newValue){
                result = true;
                break;
            }
        }

        return result;
    },
    // 判断是否包含id
    _isIncludeId(ele,value){
        var result = false;
        var idStr = ele.jqDom?ele.attr("id"):$(ele).attr("id")
        var newValue = value.trim().replace(/^#/,"")
        var idAry = idStr.trim().split(/\s+/ig)

        for(var i = 0,len=idAry.length;i<len;i++){
            if(idAry[i] === newValue){
                result = true;
                break;
            } 
        }

        return result;
    },
    // 判断是Id 1  还是class 2  否则是tag 3
    _isIdOrClassOrTag(nameStr){
        var result = 3;
        var trimEle = nameStr.trim()
        if(/^#/.test(trimEle)){ // id
            result = 1;
        }
        if(/^\./.test(trimEle)){ // class
            result = 2;
        }


        return result;
    },
    _returnThis(ele){
        if(!ele || ele.length == 0){
            delete this[0]
            this.length = 0;
        }

        if(Array.isArray(ele)&&ele.length>1){
            let len = ele.length
            for(let i = 0; i<len; i++){
                this[i] = ele[i]
            }
            this.length = len
        }

        if(ele&&ele.length == 1){
           this[0] = ele;
           this.length = 1;
        }

        return this
    }
   
})


$.utils = Dom.prototype

export default function $(selector,el){
   return new Dom(selector,el)
}

