<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        style="margin-top:15px"
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i class="el-icon-success" v-if="!scope.cat_deleted" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag size="mid" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" size="mid" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" size="mid" v-else-if="scope.row.cat_level==2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCatById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加对话的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisable"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ 
              expandTrigger: 'hover', 
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly:'true'
            }"
            @change="parentCateChanged"
            style="width: 100%"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisable =false ">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisable" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
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
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类的数据列表，默认为空
      cateList: [],
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          //表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "isok"
        },
        {
          label: "排序",
          //表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "order"
        },
        {
          label: "操作",
          //表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "opt"
        }
      ],
      //控制添加对话框的显示与否
      addCateDialogVisable: false,
      //添加分类的表单数据对象
      addCateForm: {
        //将要添加的分类的名称
        cat_name: "",
        //父级分类的id
        cat_pid: 0,
        //分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      //添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类的名称",
            trigger: "blur"
          }
        ]
      },
      //父级分类的列表
      parentCateList: [],
      //选择的父级分类的id数组
      selectedKeys: [],
      //修改表单数据
      editForm: {
        cat_id: 0,
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      //控制修改用户对话框的显示与隐藏
      editDialogVisable: false,
      //修改表单的规则
      editFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入正确的分类名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取商品列表失败！");
      }
      //把数据列表赋值给catelist
      this.cateList = res.data.result;
      //为总数据条数赋值
      this.total = res.data.total;
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    //点击按钮显示添加分类对话框
    showAddCateDialog() {
      //先获取父级分类数据列表
      this.getParentCateList();
      this.addCateDialogVisable = true;
    },
    //获取父级商品分类数据
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取父级分类数据失败！");
      }
      //console.log(res.data);
      //把数据列表赋值给catelist
      this.parentCateList = res.data;
    },
    //选择项发生变化触发
    parentCateChanged() {
      //如果selectedKeys数组的length大于0，证明选中的是父级分类
      //否则说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        //父级分类的id
        this.addCateForm.cat_pid = 0;
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    //点击确定按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status != 201) return this.$message.error("添加分类失败");
        else {
          this.$message.success("添加分类成功");
          this.addCateDialogVisable = false;
          this.getCateList();
        }
      });
    },
    //监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    //展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("categories/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("查询分类信息失败！");
      }

      this.editForm = res.data;
      this.editDialogVisable = true;
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改分类名称并提交
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) {
          this.$message.error("更新分类名称失败");
          return;
        }
         const { data : res } = await this.$http.put('categories/'+this.editForm.cat_id, { cat_name: this.editForm.cat_name } );
        if(res.meta.status!=200) {
          this.$message.error('更新分类名称失败')
          return;
        }
        else{
          this.$message.success('更新分类名称成功')
          this.editDialogVisable = false;
          this.getCateList();
        }
      });
    },
    //根据id删除对应的用户信息
    async removeCatById(id) {
      //弹框询问是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
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
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status != 200) {
        this.$message.error("删除分类失败");
      }
      this.$message.success("成功删除分类！");
      this.getCateList();
    },
  }
};
</script>

<style lang="less" scoped>
</style>