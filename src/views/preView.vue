<template>
  <div class="pre-code">
    <div class="error-detail">
      <pre class="err-code" v-html="preLine()"></pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreView',
  props: {
    origin: Object,
  },
  methods: {
    /**
     * 生成并返回包含指定行前后几行代码的HTML字符串。
     * 该方法主要用于在代码编辑器中展示错误或高亮行时，提供上下文信息。
     *
     * @returns {string} 包含错误行及其前后几行（最多6行）的HTML字符串，每行被包装在<div>元素中，
     * 如果当前行是错误行，则对应的<div>会添加一个'heightlight'类。
     */
    preLine() {
      // 错误的行数
      const line=this.origin.line
      // 先获取源码有多少行
      const originCodeLine=this.origin.source.split('\n')
      const len=originCodeLine.length-1
      const start=line-3>=0? line-3:0
      const end=start+5>=len? len:start+5 // 最多展示6行
      let newLines=[]
      for(var i=start;i<=end;i++) {
        const content=i+1+'.    '+this.encodeHTML(originCodeLine[i])
        newLines.push(
          `<div class='code-line ${i+1==line? 'heightlight':''}'>${content}</div>`
        )
      }
      return newLines.join('')
    },
    preLine() {
      // 错误的行数
      const line=this.origin.line
      // 先获取源码有多少行
      const originCodeLine=this.origin.source.split('\n')
      const len=originCodeLine.length-1
      const start=line-3>=0? line-3:0
      const end=start+5>=len? len:start+5 // 最多展示6行
      let newLines=[]
      for(var i=start;i<=end;i++) {
        const content=i+1+'.    '+this.encodeHTML(originCodeLine[i])
        newLines.push(
          `<div class='code-line ${i+1==line? 'heightlight':''}'>${content}</div>`
        )
      }
      return newLines.join('')
    },
    encodeHTML(str) {
      if(!str||str.length==0) return ''
      return str
        .replace(/&/g,'&#38;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/'/g,'&#39;')
    }
  }
}
</script>
<style>
.error-code {
  padding: 10px;
  overflow: hidden;
  font-family: consolas, monospace;
  word-wrap: normal;
}
.code-line {
  padding: 4px;
}
.heightlight {
  color: #fff;
  background: #f12926;
}
</style>