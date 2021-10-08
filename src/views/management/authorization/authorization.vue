<template>
  <div class="home">
    <div class="the_tile">主题授权</div>
    <el-form :inline="true" :model="filterForm" class="demo-form-inline">
      <el-form-item>
        <el-input
          v-model="filterForm.topicName"
          placeholder="查找主题"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="filterForm.tenants"
          clearable
          placeholder="查找租户"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="filterForm.namespace"
          clearable
          placeholder="查找命名空间"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Tabular">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAddBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="the_box">
      <!-- 表格 -->
      <Pages
        ref="Pages"
        :logs="data"
        :isFilter="false"
        :table_data="data.tableData"
        :table_title="data.table_title"
        :table_data2="data.table_list"
        :table_list="list"
        style="width: 100%"
        @every_page="every_page"
        @the_page="the_page"
        @actions="d_action"
        @authorizaOpen="authorizaOpen"
      />
    </div>
    <!-- 授权弹窗 -->
    <el-dialog :visible.sync="dialogFormVisible" title="主题授权">
      <div class="block">
        <span class="demonstration">命名空间-主题</span>
        <el-cascader
          v-model="nameSpaceSelected"
          placeholder="请选择"
          clearable
          :options="nameSpaceSelectList"
        ></el-cascader>
        <el-button type="primary" @click="handleNamespaceSearch"
          >查询</el-button
        >
      </div>
      <!-- 列表 -->
      <Pages
        ref="Pages"
        :logs="data"
        :authoriza="true"
        :isFilter="false"
        :table_data2="data.authorizationList"
        :table_list="data.authorizationData"
        style="width: 100%"
        @every_page="every_page"
        @the_page="the_page"
        @actions="d_action"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="authorizaAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pages from "@/components/tables/paging.vue";
import {
  getList,
  AddApp,
  Deletefn,
  updateApp,
  TopicList,
  GrantList,
  permission,
  getNameSpaceSelectList,
} from "@/api/authorizationManagement";
export default {
  name: "Home",
  components: {
    Pages,
  },
  data() {
    return {
      // 查询条件
      filterForm: {
        namespace: "",
        tenants: "",
        topicName: "",
      },
      dialogFormVisible: false,
      thedata: [
        {
          label: "总公司",
          children: [
            {
              label: "A油田",
              children: [
                {
                  label: "类别1",
                },
                {
                  label: "类别2",
                },
              ],
            },
            {
              label: "B油田",
              children: [
                {
                  label: "类别1",
                },
                {
                  label: "类别2",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      originator: "", // 发起人
      the_time: "",
      the_title: "",
      the_type: "",
      the_level: "",
      data: {
        authorize: true,
        orderType: "flight", // 字典类别
        total: null,
        every_page: 10,
        the_page: 1,
        search: true,
        submits: true,
        authorization: true,
        deletes: true,
        originator_options: [
          {
            // 发起人
            value: "选项1",
            label: "普通",
          },
          {
            value: "选项2",
            label: "管理员",
          },
        ],
        type_options: [
          {
            // 类别
            value: "选项1",
            label: "普通",
          },
          {
            value: "选项2",
            label: "其他",
          },
        ],
        level_options: [
          {
            // 等级
            value: "选项1",
            label: "普通",
          },
          {
            value: "选项2",
            label: "高级",
          },
        ],
        title_options: [
          {
            // 标题
            value: "选项1",
            label: "标题1",
          },
          {
            value: "选项2",
            label: "标题2",
          },
        ],
        search: [{ title: "input", type: "input" }],
        select: [
          { title: "namespaceName", label: "命名空间", type: "input" },
          { title: "tenantsName", label: "租户名称", type: "input" },
          { title: "numPartitions ", label: "分区个数", type: "input" },
          { title: "url", label: "url", type: "input" },
        ],
        newdata: {
          // name:'',
          // descriptions:''
          // ajax:''
        },
        table_list: [
          { prop: "topicName", label: "主题" },
          { prop: "tenantsName", label: "租户" },
          { prop: "namespaceName", label: "命名空间" },
          { prop: "createTime", label: "时间" },
        ],
        authorizationData: [],
        authorizationList: [
          { prop: "appId", label: "应用id" },
          { prop: "appName", label: "应用名称" },
          // checkbox:true,status:false
          // { prop: 'send', label: '发送', },
          // { prop: 'description', label: '接收',checkbox:true }
        ],

        tableData3: [],
      },
      list: [],
      test: [],
      authorizationData1: [],

      // 命名空间级联下拉数据
      nameSpaceSelectList: [],
      // 命名选择的数据
      nameSpaceSelected: [],
    };
  },
  created() {
    this.Tabular();
    this.TopicList();
  },
  methods: {
    authorizaAdd() {
      this.$refs.Pages.authorizaSubmit();
      this.dialogFormVisible = false;
      this.nameSpaceSelected = [];
    },
    // 新增授权
    async handleAddBtn() {
      this.authorizaOpen({
        topicInfoId: "",
      });
    },
    // 打开授权弹窗
    async authorizaOpen(data) {
      try {
        await this.getNameSpaceSelectList();
        const thedata = await GrantList({ topicInfoId: data.topicInfoId });
        // if(thedata.thedata){
        this.data.authorizationData = thedata.data.data;
        sessionStorage.setItem("theId", data.topicInfoId);
        // }
      } catch (err) {
        console.log("err", err);
      }
      this.dialogFormVisible = true;
    },
    async author(data) {
      try {
        // const datas = await permission(data)
      } catch (err) {
        console.log("err,err");
      }
    },
    // 删除节点
    remove(node, data) {
      console.log(node, data);
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      console.log(index);
      console.log(children);
      // children.splice(index, 1)
    },
    // 新增/删除/修改
    async d_action(type, newdata, index) {
      if (type == "dictionary_add") {
        const datas = await Create(newdata);
        // console.log(datas)
        if (datas) {
          this.$refs.Pages.the_actions("add");
          this.Tabular();
        }
      }
      if (type == "dictionary_del") {
        const thisData = newdata[index].topicInfoId;
        this.$confirm("确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {
          try {
            await Deletefn({
              id: thisData,
            });
            this.Tabular();
          } catch (err) {
            console.log("err", err);
          }
        });
      }
      if (type == "dictionary_edit") {
        try {
          await Updates(newdata);
          this.$refs.Pages.the_actions("add");
          this.Tabular();
          // this.$refs.Pages.the_actions('del',newdata,index)
        } catch (err) {
          console.log("err", err);
        }
      }
      if (type == "permission") {
        newdata.forEach((it) => {
          if (sessionStorage.getItem("theId") != "undefined") {
            it.topicInfoId = sessionStorage.getItem("theId");
          }
        });
        try {
          await permission(newdata);
          this.Tabular();
        } catch (err) {
          console.log("err", err);
        }
      }
    },
    every_page(data) {
      console.log(data);
    },
    the_page(data, data2) {
      console.log("当前页：" + data);
      console.log("每页显示条数：" + data2);
    },
    // 获取表格列表数据
    async Tabular() {
      const data = Object.assign({}, this.filterForm, {
        pageNum: 1,
      });
      try {
        const ListData = await getList(data);
        if (ListData.data) {
          this.list = ListData.data.data.list;
          this.data.total = ListData.data.data.total;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async TopicList() {
      const data = {
        pageNum: 1,
        // companyId:0
      };
      try {
        const ListData = await TopicList(data);
        // console.log(ListData)
        console.log(ListData.data.data);
        this.test = ListData.data.data;
        // if(ListData.data){
        //   this.list = ListData.data.data.list
        //   this.data.total = ListData.data.data.total
        // }
      } catch (err) {
        console.log(err);
      }
    },

    // 获取命名空间主题下拉数据
    async getNameSpaceSelectList() {
      const res = await getNameSpaceSelectList();
      const { code, data } = res.data;
      if (code === 0) {
        this.nameSpaceSelectList = [...data];
      }
    },
    // 命名空间下拉 查询
    async handleNamespaceSearch() {
      sessionStorage.setItem("theId", this.nameSpaceSelected[2]);
      const thedata = await GrantList({
        topicInfoId: this.nameSpaceSelected[2],
      });
      this.data.authorizationData = thedata.data.data;
    },
  },
};
</script>
<style scoped>
.home {
  padding: 20px;
}
.the_tile {
  margin-bottom: 10px;
}
.the_box {
  display: flex;
}
</style>
