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
        this.currentRange = range
        console.log(range)
        console.log(range.endOffset)

    },

    // 恢复选取
    recoverRange(){
        let selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(this.currentRange)
    }





})




export default Range