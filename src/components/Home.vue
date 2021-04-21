<template>
<el-container class = "home-container">
    <!-- 头部区域 -->
  <el-header>
      <div>
          <img src="../assets/mainlogo.png" alt = "" class = "logo">
          <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <!-- 页面主体区域 -->
  <el-container>
      <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px': '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409bff"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="$route.path"
      >
      <!-- 一级菜单 -->
      <!-- index只接受字符串，所以要把它转换成字符串 -->
      <el-submenu  :index="String(i)" v-for="(item,i) in menulist" :key="item.id">
          <!-- 一级菜单模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconList[i]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>

        <!-- 二级菜单 -->
        <el-menu-item :index = " '/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
            <template slot="title">
            <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
          
        </el-submenu>
      
    </el-menu>
    </el-aside>
    <!-- 右侧内容主体 -->
    <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
export default {
    data(){
        return{
            //左侧菜单数据
            menulist: [],
            iconList: ['el-icon-user-solid', 'el-icon-lock', 'el-icon-s-goods', 'el-icon-s-order', 'el-icon-s-data'],
            //是否折叠
            isCollapse: false,
        }
    },
    created(){
        this.getMenuList();
        
    },
    methods:{
        logout(){
            this.$message('退出成功');
            //清空token
            window.sessionStorage.removeItem('token');
            //跳转到登录页
            this.$router.push("/login");
        },
        //获取所有的侧边栏内容
        async getMenuList(){
            const {data: res} =  await this.$http.get('menus')
            if(res.meta.status != 200) return this.$message.error(res.meta.msg);
            this.menulist = res.data;
        },
        //点击按钮，切换菜单折叠与展开
        toggleCollapse(){
            this.isCollapse = !this.isCollapse;
        },
    }
}
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
    
}

.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
}

.el-aside{ 
    background-color: #333744;
    transition:all 0.3s;
    overflow-x: hidden;
}

.el-main{ 
    background-color: #eaedf1;
    
    width: 100%;
    scroll-behavior: unset;
}

.logo{
    width: 60px;
    height: 60px;
    border-radius: 50%;
}

.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

.el-menu{
    border-right: 0px;
}
</style>