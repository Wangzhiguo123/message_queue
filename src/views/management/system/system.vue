<template>
  <div class="home">
    <div class="the_tile">主题管理</div>
    <div class="the_box">
      <!-- 表格 -->
      <Pages
        ref="Pages"
        :isFilter="true"
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
import { getList,AddApp,Deletefn2,updateApp,tenantList } from '@/api/theme'
export default {
  name: 'Home',
  components: {
    Pages
  },
  data() {
    return {
      dialogFormVisible: false,
      list:[],
      thedata: [{
        label: '总公司',
        children: [{
          label: 'A油田',
          children: [{
            label: '类别1'
          },
          {
            label: '类别2'
          }]
        },
        {
          label: 'B油田',
          children: [{
            label: '类别1'
          },
          {
            label: '类别2'
          }]
        }
        ]
      }],
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
        solve:false,
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
          {type: 'input',palces:'命名空间',title:"namespace" },
          {type: 'input',palces:'租户',title:"tenants" },
          {type: 'input',palces:'主题名称',title:"topicName" }
        ],
        select: [
          { title: 'namespaceName', label: '命名空间', type: 'select2' },
          { title: 'topicName', label: '主题名称', type: 'input' },
          // { title: 'tenantsName', label: '租户名称', type: 'input' },
          // { title: 'url', label: 'url', type: 'input' },
          { title: 'numPartitions', label: '分区个数', type: 'input' },
          { title: 'persistent', label: '是否持久化', type: 'radio' }
        ],
        newdata: {
          // appName:'',
          // appDescL:''
        },
        table_list: [
          { prop: 'topicName', label: '主题' },
          { prop: 'tenantsName', label: '租户' },
          { prop: 'namespaceName', label: '命名空间' },
          { prop: 'updateTime', label: '时间' }
        ],
        tableData3: [],
        options:[],
        // 新增弹窗下拉使用
        nameSpaceSelectList: [],
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
        // console.log(newdata)
         newdata.tenantsName = newdata.namespaceName[0]
         newdata.namespaceName = newdata.namespaceName[1]
        //  console.log(newdata)
        // return
        const datas = await AddApp(newdata)
        console.log(datas)
        if (datas) {
          this.$refs.Pages.the_actions('add')
          this.Tabular()
        }
      } if (type == 'dictionary_del') {
        const thisData = {}
        console.log(newdata[index])
        // return
        thisData.topicInfoId = newdata[index].topicInfoId
        thisData.url = newdata[index].companyId
        // console.log(thisData)
        // return
        let forms = new FormData();
         forms.append('id ', thisData.topicInfoId)
        //  forms.append('companyId', thisData.companyId)
        //  return
        try {
          await Deletefn2(forms)
          // this.Tabular()
          this.$refs.Pages.the_actions('del', newdata, index)
        } catch (err) {
          console.log('err', err)
        }
      } if (type == 'dictionary_edit') {
        var formData = new FormData();
         formData.append('appDesc', newdata.appDesc)
         formData.append('appName', newdata.appName)
         formData.append('id', newdata.id)
         formData.append('companyId', newdata.companyId)
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
        for (const key in newdata) {
        console.log(key)
        data[key]=newdata[key]
      }
      }
      try {
        const ListData = await getList(data)
        const tenant = await tenantList()
        console.log(tenant.data.data)
        this.data.nameSpaceSelectList = tenant.data.data;
        // console.log(ListData.data.data)
        if(ListData.data){
          this.list = ListData.data.data.list
          this.data.total = ListData.data.data.total
        }
        if(tenant.data){
          this.data.options=tenant.data.data
        }
        console.log(this.list)
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
