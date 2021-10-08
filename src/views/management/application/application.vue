<template>
  <div class="home">
    <div class="the_tile">应用程序管理</div>
    <div class="the_box">
      <div class="treesBox">
        <el-tree ref="tree" :data="thedata" :props="defaultProps" class="trees" default-expand-all node-key="id">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span @click="getdatas(node,data)">{{ data.name }}</span>
            <!-- {{data}} -->
            <!-- <span>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)">
                删除
              </el-button>
            </span> -->
          </span>
        </el-tree>
      </div>
      <!-- 表格 -->
      <Pages
        :isFilter="true"
        ref="Pages"
        :logs="data"
        :table_data="data.tableData"
        :table_title="data.table_title"
        :table_data2="data.table_list"
        :table_list="list"
        style="width:100%"
        @every_page="every_page"
        @the_page="the_page"
        @actions="d_action"
        @search="Tabular"
      />
    </div>
  </div>
</template>

<script>
import Pages from '@/components/tables/paging.vue'
import { getList,AddApp,Deletefn,updateApp,SourceTrees } from '@/api/appliacation'
import { handleParam } from "../../../components/forms";
export default {
  name: 'Home',
  components: {
    Pages
  },
  data() {
    return {
      dialogFormVisible: false,
      list:[],
      thedata: [
      //   {
      //   label: '总公司',
      //   children: [{
      //     label: 'A油田',
      //     children: [{
      //       label: '类别1'
      //     },
      //     {
      //       label: '类别2'
      //     }]
      //   },
      //   {
      //     label: 'B油田',
      //     children: [{
      //       label: '类别1'
      //     },
      //     {
      //       label: '类别2'
      //     }]
      //   }
      //   ]
      // }

// {"tenantId":230719420257931264,"code":"A","name":"A","parentId":0,"unitId":"182827225081991168","companyInfo":null,
// "children":[
//   {"tenantId":230741279800168448,"code":"B22","name":"B22","parentId":230719420257931264,"unitId":"8665","companyInfo":null,"voList":[]},
//   {"tenantId":230721656287531008,"code":"B","name":"B","parentId":230719420257931264,"unitId":"8310","companyInfo":null,"voList":[]},
//   {"tenantId":230728316179582976,"code":"B6","name":"B6","parentId":230719420257931264,"unitId":"8924","companyInfo":null,"voList":[]}]}







      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      originator: '', // 发起人
      the_time: '',
      the_title: '',
      the_type: '',
      the_level: '',
      data: {
        tz:'/authorization/authorization',
        orderType: 'flight', // 字典类别
        total: null,
        every_page: 10,
        the_page: 1,
        search: true,
        submits: true,
        authorization: true,
        solve:true,
        deletes: true,
        originator_options: [{// 发起人
          value: '选项1',
          label: '普通'
        }, {
          value: '选项2',
          label: '管理员'
        }],
        type_options: [{// 类别
          value: '选项1',
          label: '普通'
        }, {
          value: '选项2',
          label: '其他'
        }],
        level_options: [{// 等级
          value: '选项1',
          label: '普通'
        }, {
          value: '选项2',
          label: '高级'
        }],
        title_options: [{// 标题
          value: '选项1',
          label: '标题1'
        }, {
          value: '选项2',
          label: '标题2'
        }],
        search: [
          { title: 'queryKey', type: 'input' }
        ],
        select: [
          { title: 'appName', label: '应用名称', type: 'input' },
          { title: 'appDesc', label: '应用描述', type: 'text' }
        ],
        newdata: {
          // appName:'',
          // appDescL:''
        },
        table_list: [
          { prop: 'appId', label: '应用id' },
          { prop: 'appName', label: '应用名称' },
          { prop: 'authCode', label: '授权码' },
          { prop: 'createBy', label: '应用描述' },
          { prop: 'updateTime', label: '时间' }
        ],
        tableData3: []
      }
    }
  },
  mounted() {
    // this.Tabular();
  },
  created() {
    this.Tabular()
  },
  methods: {
    async getdatas(node,data){
      console.log(data)
      // this.Tabular
      const newdata = {
        pageNum: 1,
        companyId:data.tenantId,
      }
      // return
      try {
        const ListData = await getList(newdata)
        if(ListData.data){
          this.list = ListData.data.data.list
          this.data.total = ListData.data.data.total
        }
        console.log(this.list)
      } catch (err) {
        console.log(err)
      }
    },
    // 删除节点
    remove(node, data) {
      console.log(node, data)
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      // console.log(index)
      // console.log(children)
      // children.splice(index, 1)
    },
    // 新增/删除/修改
    async d_action(type, newdata, index) {
      if (type == 'Add') {
        newdata.companyId=0
        console.log(newdata)
        const datas = await AddApp(newdata)
        console.log(datas)
        if (datas) {
          this.$refs.Pages.the_actions('add')
          this.Tabular()
        }
      } if (type == 'dictionary_del') {
        var thisData = {}
        thisData.id = newdata[index].id
        thisData.companyId = newdata[index].companyId
        // let forms = new FormData();
        // // console.log(thisData)
        // // return
        // //  forms.append('id', thisData.id)
        // //  forms.append('companyId', thisData.companyId)
        // handleParam(thisData,forms)
        //  console.log(forms)
        //  return
        try {
          await Deletefn(thisData)
          // this.Tabular()
          this.$refs.Pages.the_actions('del', newdata, index)
        } catch (err) {
          console.log('err', err)
        }
      } if (type == 'dictionary_edit') {
        var formData = new FormData();
        console.log(newdata)
         formData.append('appDesc', newdata.appDesc)
         formData.append('appName', newdata.appName)
         formData.append('id', sessionStorage.getItem("thisId"))
         formData.append('companyId', newdata.companyId)
        //  return
        try {
          await updateApp(formData)
          this.$refs.Pages.the_actions('add')
          this.Tabular()
          // this.$refs.Pages.the_actions('del',newdata,index)
        } catch (err) {
          console.log('err', err)
        }
      }
    },
    every_page(data) {
      console.log(data)
    },
    the_page(data, data2) {
      console.log('当前页：' + data)
      console.log('每页显示条数：' + data2)
    },
    async Tabular(newdata) {
      const data = {
        pageNum: 1,
        companyId:0
      }
      if(newdata){
      //   for (const key in newdata) {
      //   data[key]=newdata[key]
      // }
      data.queryKey=newdata.queryKey
      }
      // console.log(data)
      // return
      try {
        const ListData = await getList(data)
        // console.log(ListData.data.data)
        const thedatas = await SourceTrees({tenantId:'230719420257931264'})
        // console.log(123,thedatas.data)
        if(thedatas.data){
          this.thedata.push(thedatas.data)
        }
        // console.log(this.thedata)
        // this.thedata = thedata.data
        if(ListData.data){
          this.list = ListData.data.data.list
          this.data.total = ListData.data.data.total
          console.log(this.data.total)
        }
        // console.log(this.list)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style scoped>
.home{
    padding: 20px;
}
.the_box{
  display: flex;
}
.treesBox{
  padding: 20px;
  margin-right: 20px;
  border-right: 1px solid #333333;
  height: 100%;
}
.trees{
  width:160px;
  padding: 20px 0;
  box-shadow: 1px 0px 3px rgb(0 0 0 / 10%);
}
</style>
