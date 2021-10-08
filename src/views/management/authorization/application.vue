<template>
  <div class="home">
    <div class="the_tile">应用程序授权</div>
    <el-form :inline="true" :model="filterForm" class="demo-form-inline">
      <el-form-item>
        <el-input
          v-model="filterForm.queryKey"
          placeholder="查找名称"
          clearable
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
        :table_data="data.tableData"
        :table_title="data.table_title"
        :table_data2="data.table_list"
        :table_list="data.tableData3"
        style="width: 100%"
        @every_page="every_page"
        @the_page="the_page"
        @actions="d_action"
        @authorizaOpen="authorizaOpen"
      />
    </div>
    <!-- 授权弹窗 -->
    <el-dialog :visible.sync="dialogFormVisible" title="应用程序授权">
      <div class="block">
        <span class="demonstration">应用程序</span>
        <el-select
          v-model="dialogForm.appPkId"
          placeholder="请选择"
          clearable
          @change="selectChange"
        >
          <el-option
            v-for="item in appSelectList"
            :key="item.id"
            :label="item.appName"
            :value="item.id"
          ></el-option>
        </el-select>
        <span>应用描述</span>
        <el-input
          style="display: inline; width: 200px"
          disabled
          v-model="dialogForm.desc"
        ></el-input>

        <el-button type="primary" @click="handleAppSearch">查询</el-button>
      </div>

      <!-- 列表 -->
      <Pages
        ref="Pages"
        :logs="data"
        :authoriza="true"
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
  GrantList,
  AddApp,
  Deletefn,
  updateApp,
  permission,
  getAppSelectList,
} from "@/api/appliacation";
export default {
  name: "Home",
  components: {
    Pages,
  },
  data() {
    return {
      // 查询条件
      filterForm: {
        companyId: "",
        queryKey: "",
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
          { title: "name", label: "应用名称", type: "input" },
          { title: "descriptions", label: "应用描述", type: "text" },
        ],
        newdata: {
          // name:'',
          // descriptions:''
          // ajax:''
        },
        table_list: [
          { prop: "appId", label: "应用id" },
          { prop: "appName", label: "应用名称" },
          { prop: "appDesc", label: "应用描述" },
          { prop: "createTime", label: "时间" },
        ],
        authorizationData: [
          { app_id: "test", name: "张三疯", send: true, receive: false },
          { app_id: "test2", name: "李四民", send: false, receive: false },
          { app_id: "test3", name: "憨批", send: true, receive: false },
        ],
        authorizationList: [
          { prop: "tenants", label: "租户" },
          { prop: "namespace", label: "命名空间" },
          { prop: "topic", label: "主题" },
          // checkbox:true,status:false
          // { prop: 'send', label: '发送', },
          // { prop: 'description', label: '接收',checkbox:true }
        ],

        tableData3: [],
      },

      appSelectList: [],
      dialogForm: {
        appPkId: "",
        desc: "",
      },
    };
  },
  created() {
    this.Tabular();
  },
  methods: {
    // 新增授权
    async handleAddBtn() {
      this.authorizaOpen({
        appPkId: "",
      });
    },
    authorizaAdd() {
      this.$refs.Pages.authorizaSubmit();
      this.dialogFormVisible = false;
      this.dialogForm = {
        appPkId: "",
        desc: "",
      };
    },
    // 打开授权弹窗
    async authorizaOpen(data) {
      try {
        await this.getAppSelectList();
        const thedata = await GrantList({ appPkId: data.appPkId });
        // if(thedata.thedata){
        this.data.authorizationData = thedata.data.data;
        sessionStorage.setItem("theId", data.id);
        // }
      } catch (err) {
        console.log("err", err);
      }
      this.dialogFormVisible = true;
    },
    // 新增/删除/修改
    async d_action(type, newdata, index) {
      if (type == "dictionary_add") {
        const datas = await Create(newdata);
        if (datas) {
          this.$refs.Pages.the_actions("add");
          this.Tabular();
        }
      }
      if (type == "dictionary_del") {
        const thisData = newdata[index].id;
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
            it.appPkId = sessionStorage.getItem("theId");
          }
        });
        console.log(newdata)
        // return
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
    async Tabular() {
      try {
        const data = Object.assign({}, this.filterForm, {
          pageNum: 1,
        });
        const ListData = await getList(data);
        if (ListData.data) {
          this.data.tableData3 = ListData.data.data.list;
          this.data.total = ListData.data.data.total;
        }
      } catch (err) {
        console.log(err);
      }
      return;
      const data = {
        // typeId:'',
        // name:'',
        // parentId:'',
        // statusId:'',
        page: 0,
        size: 10,
      };
      try {
        const thisData = await processTransactionPage(data);
        // console.log(thisData)
        thisData.data.content.forEach((v, index) => {
          v["xh_id"] = index + 1;
        });

        this.data.total = thisData.data.totalPages;
        this.data.every_page = thisData.data.size;
        this.data.the_page = thisData.data.number + 1;
        console.log(this.data.the_page);
      } catch (err) {
        console.log(err);
      }
    },
    // 获取应用下拉数据
    async getAppSelectList() {
      const res = await getAppSelectList();
      const { code, data } = res.data;
      if (code === 0) {
        this.appSelectList = [...data];
      }
    },
    // 下拉改变
    selectChange(res) {
      if (!res) {
        this.dialogForm.desc = "";
        return;
      }
      this.dialogForm.desc = this.appSelectList.find(
        (v) => v.id === res
      ).appDesc;
    },
    async handleAppSearch() {
      sessionStorage.setItem("theId", this.dialogForm.appPkId);
      const thedata = await GrantList({
        appPkId: this.dialogForm.appPkId,
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
.block {
  display: flex;
  align-items: center;
}
</style>
