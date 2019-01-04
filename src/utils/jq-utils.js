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
    var htmlReg = /<(S*?)[^>]*>.*?|<.*?\/>/gim

        // console.log(htmlReg.test(`<li>`))
        
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
    // 是 NodeList 
    if(this._isNodeList(selector)){
         this._ListEle(selector)
    }
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
       if(typeof htmlStr === "string" || typeof htmlStr === "number"){
          this._forEachDom(dom=>{
              dom.innerHTML =  htmlStr
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
    // 添加获取属性
    attr(name,val){
        if (!val) { // 获取值
            return this[0].getAttribute(key)
        } else { // 设置值
            return this._forEachDom(dom => {
                dom.setAttribute(name, val)
            })
        }
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
                callback = selector
                eventAry.forEach(name=>{
                    dom.addEventListener(name,function(e){
                        callback.call(this,e)
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

    // 修改css
    css(){

    },  

    // 循环遍历
    foreach(){

    },

    // 获取子元素
    children(ele){
        if(ele){ 
           return $(this[0].querySelectorAll(ele))
        }else{
           return $(this[0].children)
        }
        
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
            this._singleEle(eleAll)
        }else if(length > 1){
            this._ListEle(eleAll)
        }
    },
    // 单个元素包装真实DOM元素为$ 元素
    _singleEle(ele){
        this[0] = ele[0]
        this.length = 1;
    },
    // nodeList元素包装真实DOM元素为$ 元素
    _ListEle(ele){
        var length = ele.length;
        for(let i = 0; i<length; i++){
            this[i] = ele[i]
        }
        this.length = length
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
   
})



export default function $(selector,el){
   return new Dom(selector,el)
}

