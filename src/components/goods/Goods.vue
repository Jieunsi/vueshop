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
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border stripe style="font-size: 15px">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="价格" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="180px">
          <template v-slot="slotProps">
            <!-- '|'调用过滤器 -->
            {{slotProps.row.add_time*1000 | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230px">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="medium"
              @click="showEditDialog(slotProps.row.goods_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="medium"
              @click="removeById(slotProps.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="goodsList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 修改商品的对话框 -->
    <el-dialog title="修改商品" :visible.sync="editDialogVisable" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品列表
      goodsList: [],
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
      total: 0,
      //修改表单数据
      editForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_id: 0,
        goods_cat:[]
      },
      //编辑商品对话框显示与否
      editDialogVisable: false,
      //修改表单的规则
      editFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur"
          }
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) {
        this.$message.error("获取商品列表失败！");
        return;
      }
      
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    //搜索框fixbug
    search() {
      this.queryInfo.pagenum = 1;
      this.getGoodsList();
    },
    //展示编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("goods/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("查询商品信息失败！");
      }
      this.editForm.goods_name = res.data.goods_name;
      this.editForm.goods_price = res.data.goods_price;
      this.editForm.goods_number = res.data.goods_number;
      this.editForm.goods_weight = res.data.goods_weight;
      this.editForm.goods_id = res.data.goods_id;
      this.editForm.goods_cat = res.data.goods_cat;

      this.editDialogVisable = true;
    },
    //移除商品
    async removeById(id) {
      //弹框询问是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err); //通过catch捕获错误

      //如果用户取消删除，返回的是字符串cancel，需要通过catch捕获
      //如果用户确认删除，返回的是字符串confirm
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("goods/" + id);
      if (res.meta.status != 200) {
        this.$message.error("删除商品失败");
      }
      this.$message.success("成功删除商品！");
      this.getGoodsList();
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //提交修改后的商品信息
    editUserInfo() {
  
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error("更新商品失败");
          return;
        }
        const { data: res } = await this.$http.put(
          "goods/" + this.editForm.goods_id,
          {
            goods_name: this.editForm.goods_name,
            goods_price: this.editForm.goods_price,
            goods_number: this.editForm.goods_number,
            goods_weight: this.editForm.goods_weight,
            goods_cat:  this.editForm.goods_cat
          }
        );
        
        if (res.meta.status != 200) {
          this.$message.error("更新商品信息失败！");
          return;
        }
        this.$message.success("更新商品信息成功");
        this.editDialogVisable = false;
        this.getGoodsList();
      });
    },
    //
    goAddPage(){
      this.$router.push('/goods/add')
    }
  }
};
</script>

<style lang="less" scoped>
</style>