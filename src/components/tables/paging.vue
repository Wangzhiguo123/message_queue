<template>
  <div>
    <!-- 搜索输入框 -->
    <div v-if="isFilter" class="sel_btn2">
      <div v-for="(item,index) in logs.search" :key="index">
        <el-input
          v-model="logs.newdata[item.title]"
          :placeholder="item.palces"
          style="width:160px;margin-right:10px"
          clearable/>
      </div>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button v-if="!authoriza" type="primary" @click="openTC">新增</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="table_list"
      :border="the_border"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- sortable -->
      <el-table-column
        v-for="item in table_data2"
        v-if="item.prop!='users'"
        :key="item.id"
        :prop="item.prop"
        :label="item.label"
        show-overflow-tooltip
      />
      <div v-if="logs.select">
        <el-table-column v-if="logs.select[1].users" fixed="right" label="班组成员" prop="users" width="120">
          <template slot-scope="scopes">
            <div class="userbox">
              <span v-for="(item,index) in scopes.row.users" :key="index">{{ item.userName }}</span>
            </div>
          </template>
        </el-table-column>
      </div>
      <el-table-column v-if="authoriza" fixed="right" label="发送" prop="users" width="60">
        <template slot-scope="scopes">
          <!-- {{scopes.row}} -->
          <el-checkbox v-model="scopes.row.produce"/>
        </template>
      </el-table-column>
      <el-table-column v-if="authoriza" fixed="right" label="接收" prop="users" width="60">
        <template slot-scope="scopes">
          <el-checkbox v-model="scopes.row.consume"/>
        </template>
      </el-table-column>
      <el-table-column v-if="the_action && authoriza != true" fixed="right" label="操作" width="140" >
        <div slot-scope="adc">
          <el-button
            v-if="logs.edits && logs.orderType=='My'"
            type="text"
            size="small"
            @click="handleClick(adc.row, 3)"
          >审核</el-button
          >
          <el-button
            v-if="logs.solve"
            type="text"
            size="small"
            @click="handleClick(adc.row, 4)"
          >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            v-if="!logs.no_au"
            @click="handleClick(adc.row, 10)"
          >授权</el-button
          >
          <el-button
            v-if="logs.deletes"
            type="text"
            size="small"
            @click.native.prevent="deleteRow(adc.$index, table_list, 5)"
          >删除</el-button
          >
          <el-button
            v-if="logs.search && logs.orderType=='end'||logs.orderType=='dictionary'||logs.orderType=='workBench'"
            type="text"
            size="small"
            @click="handleClick(adc.row, 1)"
          >查看</el-button
          >
          <el-button
            v-if="logs.submits && logs.orderType=='end'"
            type="text"
            size="small"
            @click="handleClick(adc.row, 2)"
          >评价</el-button
          >
        </div>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        :current-page.sync="logs.the_page"
        :page-size="parseInt(logs.every_page)"
        :total="parseInt(logs.total)"
        background
        layout="prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 用于新增 -->
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      title="应用描述">
      <div v-if="logs.orderType=='flight'">
        <div v-for="(item,index) in logs.select" :key="index" class="drawer_input">
          <div style="width:50%">{{ item.label }}:</div>
          <el-input
            v-if="item.type=='input'"
            v-model="logs.newdata[item.title]"
            placeholder="请输入内容"
            clearable/>
          <el-select v-if="item.type=='select'" v-model="logs.newdata[item.title]" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in logs.nameSpaceSelectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-cascader
          style="width:100%"
            v-if="item.type=='select2'"
            v-model="logs.newdata[item.title]"
            :options="logs.nameSpaceSelectList"
            placeholder="请选择"
            clearable
          />
          <div v-if="item.type=='radio'" class="drawer_input">
            <el-radio v-model="logs.newdata[item.title]" label="1">持久化</el-radio>
          <el-radio v-model="logs.newdata[item.title]" label="0">非持久化</el-radio></div>
          <el-input
            v-if="item.type=='text'"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="logs.newdata[item.title]"
            type="textarea"
            placeholder="请输入内容"/>
          <div v-if="item.type=='box'" class="the_boxs">
            <!-- item.users -->
            <div v-for="(vega,index) in logs.newdata.users" v-if="item.type=='box'" :key="index" style="width:100%;display:flex;justify-content: space-between;align-items:center">
              <el-input
                v-model="logs.newdata.users[index].userName"
                style="margin:10px 0"
                placeholder="请输入名字"
                clearable/>
            </div>
          </div>
          <el-time-picker
            v-if="item.type=='time'"
            v-model="logs.newdata[item.title]"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            style="width:100%"
            value-format="HH:MM:ss"
            placeholder="请填写时间"/>
        </div>
      </div>
      <el-button type="primary" style="margin:30px" @click="add_submit">提交</el-button>
    </el-drawer>

  </div>
</template>
<script>
// handleParam
// @/utils/index
import { handleParam } from '../forms'
export default {
  props: {
    logs: Object,
    isFilter: [Boolean],
    table_data: [Array, String, Number, Object],
    table_data2: [Array, String, Number, Object],
    table_list: [Array, String, Number, Object],
    table_title: [Array, Object],
    authoriza: [Boolean],
    authorizationData: [Array, Object]
  },
  data() {
    return {
      search_input: '',
      options: [
        {
          namespace: 'default',
          tenant: 'space1',
          data: []
        }, {
          namespace: 'sp2',
          tenant: 'space1',
          data: []
        }],
      value: '',
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false, // 上传图片
      add: {
        parentId: '',
        typeId: '',
        name: '',
        code: ''
      },
      detail: {
        value: '',
        code: '',
        typeId: this.$route.query.typeId
      },
      work: {
        iconPath: [],
        name: '',
        parentId: '',
        statusId: ''
      },
      addData: {
        file: [],
        samplingFileDetails: '',
        samplingId: ''

      },
      theKey: null, // 键值
      edits: false, // 编辑？
      drawer: false,
      originator: '', // 发起人
      the_time: '',
      the_title: '',
      the_type: '',
      the_level: '',
      select: true, // 多选
      the_action: true, // 操作
      datas: 5,
      currentPage: 1,
      total: 0,
      every_page: 0,
      pageData: [],
      tableData: [],
      the_border: false,
      loading: false,
      theTypeid: ''
    }
  },
  watch: {
    'table_list': function(news, old) {
      // console.log('发生改变',news)
      this.getData(news)
    },
    'logs': function(news, olds) {
      console.log('发生改变', news)
    },
    'authorizationData': function(news, olds) {
      console.log('发生改变', news)
    }
  },
  created() {
    this.tableData = this.table_data
    // console.log(this.tableData)
    this.total = this.logs.total ? this.logs.total : 0
  },
  methods: {
    authorizaSubmit() {
      // // console.log(this.logs.authorizationData)
      // console.log(this.logs.authorizationData)
      // // return
      // let index
      // for(index in this.logs.authorizationData){
      //   // this.logs.authorizationData[index].produce=[]
      //   // console.log(index)
      //   console.log(this.logs.authorizationData[index].produce)
      //   if(this.logs.authorizationData[index].receive || this.logs.authorizationData[index].send){
      //   if(this.logs.authorizationData[index].receive){
      //     this.logs.authorizationData[index].produce.push(0)
      //     delete this.logs.authorizationData[index].receive;
      //   }
      //   if(this.logs.authorizationData[index].send){
      //     this.logs.authorizationData[index].produce.push(1)
      //     delete this.logs.authorizationData[index].send;
      //   }
      //   }
      // }
      // 授权
      // console.log(this.logs.authorizationData)
      // console.log(this.logs.authorizationData)
      // // return
      this.$emit('actions', 'permission', this.logs.authorizationData)
    },
    search() {
      // console.log(this.logs.newdata)
      // return
      this.$emit('search', this.logs.newdata)
    },
    submitUpload() {
      console.log(this.fileList)
      // this.$refs.upload.submit();
    },
    handleRemove2(file, fileList) {
      console.log(file, fileList)
    },
    handleRemove(file) {
      console.log(file)
      // 区分文件对象和json数据
      let idx = -1
      if (this.fileList.length > 0) {
        idx = this.fileList.findIndex((it) => it.uid === file.uid)
      }
      console.log(idx)
      if (idx > -1) {
        this.fileList.splice(idx, 1)
      }
      console.log(this.fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    fileChange(file) {
      if (this.logs.orderType == 'workBench') {
        const formData = new FormData()
        const thedata = {
          file: []
        }
        thedata.file.push(file.raw)
        this.$emit('Uploads', formData)
      } else {
        this.addData.file.push(file.raw)
      }
    }, // 上传图片
    // 打开新增弹窗
    openTC() {
      this.edits = false
      this.add = {
        parentId: '',
        typeId: '',
        name: '',
        code: ''
      }
      this.workdetails = {
        // docId:'',
        name: '',
        statusId: '',
        iconPath: ''
      }
      for (const key in this.logs.newdata) {
        this.logs.newdata[key] = ''
        if (key == 'users') {
          this.logs.newdata[key] = [
            {
              userId: 8,
              userName: ''
            }
          ]
        }
      }
      this.drawer = true
      // this.add
    },
    // 添加用户
    addMore() {
      this.logs.select[1].users.push(
        {
          userId: '',
          userName: ''
        })
      this.logs.newdata.users.push({
        userId: '',
        userName: ''
      })
      console.log(this.logs.newdata.users)
    },
    // 新增/编辑
    add_submit() {
      // console.log(this.logs.newdata)
      // return
      if (!this.edits) {
        if (this.logs.orderType == 'year') {
          console.log(this.addData)
          // return
          this.$emit('actions', 'dictionary_add', this.addData)
        } else if (this.logs.orderType == 'flight') {
          console.log(this.logs.newdata)
          //  return
          this.$emit('actions', 'Add', this.logs.newdata)
        } else {
          this.$emit('actions', 'Add', this.detail)
        }
      }
      if (this.edits) {
        if (this.logs.orderType == 'flight') {
          // console.log(this.logs.newdata)
          // return
          this.$emit('actions', 'dictionary_edit', this.logs.newdata)
        } else {
          this.$emit('actions', 'dictionary_edit', this.detail)
        }
      }
    },
    the_actions(data, rows, index) {
      if (data == 'add') {
        this.drawer = false
      } else if (data == 'del') {
        console.log(rows)
        rows.splice(index, 1)
      }
      // console.log('ok',data)
    },
    getData(data) {
      this.table_list = data
      console.log(this.table_list)
      // console.log(this.table_data2)
      this.loading = false
    },
    // 删除
    deleteRow(index, rows, actions) {
      console.log(index, rows)
      // return
      this.$emit('actions', 'dictionary_del', rows, index)
    },
    //   查看/评价/提交/修改
    handleClick(row, actions) {
      this.theTypeid = row.typeId
      if (actions == 10) {
        console.log(row, actions)
        if (this.logs.authorize) {
          this.$emit('authorizaOpen', row)
        } else {
          this.$router.push({ path: this.logs.tz, query: { row: row }})
        }
      } else if (actions == 3) {
        // this.$router.push({path:'/authorization',query: {row:row}})
      } else if (actions == 4) {
        this.edits = true
        if (this.logs.orderType == 'year') {
          this.addData.samplingFile = row.samplingFile
          this.addData.samplingFileDetails = row.samplingFileDetails
          this.addData.samplingId = row.samplingId
          this.addData.samplingTitle = row.samplingTitle
          this.addData.samplingYear = row.samplingYear
        } else if (this.logs.orderType == 'flight') {
          console.log(row)
          sessionStorage.setItem("thisId", row.id);
          // this.logs.newdata.appDesc=row.appDesc
          // this.logs.newdata.appName=row.appName
          // this.logs.newdata. = row.
          // this.logs.newdata.companyId=row.companyId
          // this.logs.newdata.id=row.id
          this.drawer = true
          // console.log('只是logs的数据', this.logs.select)
          // return
          // Object.keys(this.logs.newdata).forEach(key => {
          //   // console.log(key)
          //   // if (key != 'users') {
          //   //   this.logs.newdata[key] = row[key]
          //   // }
          //   // if (row.users) {
          //   //   // console.log('row存在')
          //   //   if (row.users.length > 0) {
          //   //     this.logs.newdata[key] = row[key]
          //   //   } else {
          //   //     // this.logs.newdata[key]=row[key]
          //   //     // for(let key in this.logs.newdata.users){
          //   //     this.logs.newdata.users = []
          //   //     // }
          //   //   }
          //   // }
          // })
          // console.log(this.logs.newdata)
        }
      }
    },
    // 多选
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      // 每页xx条
      this.$emit('every_page', `${val}`)
      this.every_page = `${val}`
    },
    handleCurrentChange(val) {
      // 当前页
      this.$emit('the_page', `${val}`, this.every_page)
    }
  }
}
</script>
<style scoped>
.actionsBox{
  color: blue;
  width: 25%;
  cursor: pointer;
  text-align: right;
}
.the_boxs{
  width: 100%;
}
.userbox{
  display: flex;
}
.userbox>span{
  width: 32%;
  margin: 0 5px;
  text-align: center;
  color: blue;
}
.the_tile{
    font-size: 18px;
    font-weight: bold;
    margin: 10px;
}
.select_box{
  margin: 20px;
}
.sel_btn{
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.sel_btn2{
  display: flex;
    margin-top: 20px;
}
.times{
  width: 200px;
}
.selects{
  width: 120px;
  margin-right: 10px;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.block {
  margin-top: 10px;
}
.drawer_input{
  display: flex;
  margin: 20px 10px;
  align-items: center;
}
.drawer_input>div:nth-child(1){
  width: 80px
}
</style>
