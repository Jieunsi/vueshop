<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @keydown.enter.native="search"
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisable =true">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border stripe style="font-size: 15px">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
        <el-table-column label="价格" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="180px"></el-table-column>
        <el-table-column label="操作" >
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="medium"
              @click="showEditDialog(slotProps.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="medium"
              @click="removeRoleById(slotProps.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="goodsList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return {
      //商品列表
      goodsList:[],
      //获取商品列表的参数对象
      queryInfo: {
        //商品
        query: "",
        //页码
        pagenum: 1,
        //每页显示数量
        pagesize: 5
      },
      //商品总数
      total:0
    }
  },
  created(){
    this.getGoodsList();
  },
  methods:{
    //获取商品列表
    async getGoodsList(){
      const {data:res} = await this.$http.get("goods",{params:this.queryInfo})
      if(res.meta.status!=200) {
        this.$message.error('获取商品列表失败！');
        return;
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    }
    
  }

};
</script>

<style lang="less" scoped>
</style>