import axios from "axios"
import sourceMap from "source-map-js"

const getSourcemap = async (url: string) => {
  const res = await axios.get(url)
  return res
}

/**
 * 根据SourceMap查找源代码位置
 *
 * @param stackFrame 堆栈帧对象
 * @returns 无返回值，该函数为异步函数，主要作用是根据堆栈帧信息查找源代码位置
 */
const findCodeBySourceMap = async (stackFrame: any) => {
  // 获取对应的map文件
  const sourceData: any = await getSourcemap(stackFrame.fileName + '.map')
  const fileContent = sourceData.data
  // 解析map文件
  const consumer = await new sourceMap.SourceMapConsumer(fileContent)
  // 通过报错的位置查找对应的源文件的名称以及报错行数
  const originalPosition = consumer.originalPositionFor({
    line: stackFrame.lineNumber,
    column: stackFrame.columnNumber || 0
  })
  const code = consumer.sourceContentFor(originalPosition.source)
  console.log('code : >>>>>>>>>>>>>>>>', code)
}

export {
  findCodeBySourceMap
}