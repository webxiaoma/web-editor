import $ from '../utils/jq-utils.js'

// 光标选取控制
function Range(editor){
   this.editor = editor
   this.currentRange = null;
}


Range.prototype = Object.assign(Range.prototype,{
    
    // 保存光标
    saveRange(){
        let  selection = window.getSelection()
        let range = selection.getRangeAt(0);

        if(this.isInEditor(range)){
            this.currentRange = range
        }
    },

    // 恢复选取
    recoverRange(curRange){
        let range = curRange || this.currentRange
        if(!range){
           this.editor.focus()
           return;
        }

        let selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
    },
    // 移动光标位置(默认移动到最后)
    moveRange(curRange,start,end){
        let range  =  curRange || window.getSelection().getRangeAt(0);
        let textEle  =  range.commonAncestorContainer;
        let setStart = start || textEle.length;
        let setEnd = end || textEle.length;
        range.setStart(range.startContainer,setStart);
        range.setEnd(range.endContainer,setEnd);
    },
    // 拿到选区对象
    getRange(){
        let  selection = window.getSelection()
        let range = selection.rangeCount !== 0
                    ?selection.getRangeAt(0)
                    :null;
        
        return range
    },
    // 拿到选区文字内容
    getRangeString(curRange){
        let range = curRange || this.currentRange
        if (range) {
            return this.currentRange.toString()
        } else {
            return ''
        }
    },
    
    // 拿到选区元素
    getContainerEle(curRange){
        let range = curRange || this.currentRange

        if(!range){
           return null
        }
        let ele = range.commonAncestorContainer.nodeType === 1
                  ?range.commonAncestorContainer
                  :range.commonAncestorContainer.parentNode
    
        return ele
    },
    // 光标是否在富文本编辑器中
    isInEditor(range){
        if(!range){
            return false
        }
        let ele = range.commonAncestorContainer.nodeType === 1
                  ?range.commonAncestorContainer
                  :range.commonAncestorContainer.parentNode

        var resultOne = $(ele).attr("contenteditable")
        var resultTwo = $(ele).parents('.simple-editor-body').length > 0
                        ?$(ele).parents('.simple-editor-body').attr("contenteditable")
                        :false;

        if(resultOne || resultTwo){
            return true
        }else{
            return false
        }

    }     



})




export default Range