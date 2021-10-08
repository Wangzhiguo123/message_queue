<template>
  <div class="home">
      <div class="box">
          <!-- <div v-for="(item,index) in newdata" :key=index>
              <i class="icon max" :class="item.icon"></i>
              <div class="div_title_box">
            <p class="div_title">{{item.title}}<i class="el-icon-info icon"></i></p>
            <p>{{item.count}}</p>
              </div>
          </div> -->
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            newdata:[
                {
                title:'租户',
                count:'12',
                icon:'el-icon-s-custom'
                },
                {
                title:'命名空间',
                count:'100',
                icon:'el-icon-s-custom'
                },
                {
                title:'主题',
                count:'12',
                icon:'el-icon-s-grid'
                },
                {
                title:'应用程序',
                count:'210',
                icon:'el-icon-s-help'
                },
                {
                title:'消息发送量',
                count:'38',
                icon:'el-icon-chat-dot-square'
                },
                {
                title:'消息接收量',
                count:'760',
                icon:'el-icon-chat-line-square'
                },
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.home{
    padding: 20px;
    .box{
        display: flex;
        flex-wrap: wrap;
        .icon{
            color: rgb(64, 158, 255);
        }
        .max{
            font-size: 30px;
            padding: 0 10px;
        }
        .div_title_box{
            width: 70%;
            .div_title{
            display: flex;
            justify-content: space-between;
            }
        }
    }
    .box>div{
        margin: 20px;
        width: 200px;
        height: 100px;
        display: flex;
        align-items: center;
        border:1px solid rgba(233, 233, 233, 1);
    }
}
</style>