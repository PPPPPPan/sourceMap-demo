<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import sourceMap from 'source-map-js'
import PreView from './preView.vue'

let js_error = ref<any>('')
let isError = ref(false)
let activeName = ref<string[]>(['1'])
let tabActiveName = ref<string>('local')

let dialogVisible = ref(false)

let sourceMapLink = ref<any>(
  'https://ppppppan.github.io/sourceMap-demo/assets/ErrorView-BGCnhUf-.js.map'
)

let stackFrameObj = {
  line: 0,
  column: 0,
  index: 0
}

const openDialog = (item: any, index: number) => {
  stackFrameObj = {
    line: item.lineNumber,
    column: item.columnNumber,
    index: index
  }
  dialogVisible.value = true
}

const sourceMapUpload = async (file: any) => {
  if (file.name.substring(file.name.lastIndexOf('.') + 1) !== 'map') {
    ElMessage.error('请上传正确的sourceMap文件')
    return
  }
  const reader = new FileReader()
  reader.readAsText(file, 'utf-8')
  reader.onload = async (evt: any) => {
    const code = await getSource(evt.target?.result, stackFrameObj.line, stackFrameObj.column)
    js_error.value.stack_frames[stackFrameObj.index].origin = code
    dialogVisible.value = false
  }
  return false
}

const loadSourceMap = async () => {
  let link = sourceMapLink.value
  if (!link) return
  fetch(link)
    .then((response) => response.text())
    .then(async (text) => {
      const code = await getSource(text, stackFrameObj.line, stackFrameObj.column)
      js_error.value.stack_frames[stackFrameObj.index].origin = code
      dialogVisible.value = false
    })
    .catch((error) => {
      console.error('Error fetching script:', error)
    })
}

const getSource = async (sourcemap: any, line: number, column: number = 0) => {
  try {
    // 解析map文件
    const consumer = await new sourceMap.SourceMapConsumer(JSON.parse(sourcemap))
    // 通过报错的位置查找对应的源文件的名称以及报错行数
    const originalPosition = consumer.originalPositionFor({
      line,
      column
    })
    const source = consumer.sourceContentFor(originalPosition.source)
    return {
      source,
      column: originalPosition.column,
      line: originalPosition.line
    }
  } catch (e) {
    ElMessage.error('sourceMap解析失败')
  }
}

onMounted(() => {
  try {
    let jsErrorList = localStorage.getItem('jsErrorList')
    if (jsErrorList) {
      isError.value = true
      js_error.value = JSON.parse(jsErrorList)
    }
  } catch (error) {
    console.log('error : >>>>>>>>>>>>>>>>', error)
  }
})
</script>

<template>
  <div v-if="isError">
    <pre>
      {{ js_error.stack }}
    </pre>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item v-for="(item,index) in js_error.stack_frames" :key="index" :name="index" :title="item.source">
        <el-row :gutter="20">
          <el-col :span="20">
            <div>
              {{ item.fileName }}
            </div>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="small" @click="openDialog(item,index)">
              映射源码
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <template v-if="item.origin">
            <PreView :origin="item.origin"></PreView>
            <!-- <pre>
              {{ item.origin.source }}
            </pre> -->
          </template>
          <template v-else>
            <div>
              {{ item.file }}
            </div>
          </template>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <el-dialog v-model="dialogVisible" title="sourceMap源码的映射" width="500">
      <el-tabs v-model="tabActiveName">
        <el-tab-pane label="本地上传" name="local">
          <el-upload drag :before-upload="sourceMapUpload">
            <i class="el-icon-upload"></i>
            <div>
              将文件拖到此处，或者<em>点击上传</em>
            </div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="远程加载" name="origin">
          <el-input v-model="sourceMapLink" placeholder=""></el-input>
          <el-button style="margin-top:10px" type="primary" @click="loadSourceMap">加载</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
