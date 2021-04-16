<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisable =true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="slotProps">
            <el-row
              :class="['bdbottom',i1==0?'bdtop':'','vcenter']"
              v-for="(item1,i1) in slotProps.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(slotProps.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2==0?'':'bdtop']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 每一个row又可以分为24col -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(slotProps.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级循环每个循环只占一行 -->
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(slotProps.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(slotProps.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(slotProps.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisable" width="50%" @close="addDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisable" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisable"
      width="50%"
      
    >
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisable = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolelist: [],
      //控制添加角色对话框的显示与隐藏
      addDialogVisable: false,
      //控制修改角色对话框的显示与隐藏
      editDialogVisable: false,
      //控制权限对话框的显示与隐藏
      setRightDialogVisable: false,
      //添加用户的表单数据
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      //添加表单的验证规则
      addFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "角色名长度在3到10之间",
            trigger: "blur"
          }
        ]
      },
      //修改表单数据
      editForm: {
        roleName: "",
        roleDesc: ""
      },
      //修改表单的规则
      editFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "角色名长度在3到10之间",
            trigger: "blur"
          }
        ],
        roleDesc: [
          {
            min: 0
          }
        ]
      },
      //所有权限的数据
      rightsList: [],
      //树形控件的属性绑定对象
      treeProps:{
        label:'authName',
        children: 'children'
      },
      //默认选中的节点的数组
      defKeys:[]
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    //获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");

      if (res.meta.status != 200) {
        return this.$message.error("获取角色列表失败！");
      }

      this.rolelist = res.data;
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //添加角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", {
          roleName: this.addForm.roleName,
          roleDesc: this.addForm.roleDesc
        });

        if (res.meta.status != 201) {
          this.$message.error("添加角色失败！");
          return;
        }
        this.$message.success("添加角色成功！");
        this.addDialogVisable = false;
        this.getRoleList();
      });
    },
    //展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("查询角色信息失败！");
      }
      this.editForm = res.data;
      this.editDialogVisable = true;
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息并提交
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error(`更新角色失败！请检查格式`);
          return;
        }
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        );
        if (res.meta.status != 200) {
          this.$message.error("更新角色失败！");
          return;
        }
        this.$message.success("更新角色成功！");
        this.editDialogVisable = false;
        this.getRoleList();
      });
    },
    //根据id删除对应的用户信息
    async removeRoleById(id) {
      //弹框询问是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status != 200) {
        this.$message.error("删除用户失败");
      }
      this.$message.success("成功删除用户！");
      this.getRoleList();
    },

    //根据id删除对应的权限信息
    async removeRightById(role, rightId) {
      //弹框询问是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
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
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status != 200) {
        this.$message.error("删除权限失败");
      } else {
        this.$message.success("成功删除权限！");
        //防止整个列表刷新，直接将服务器返回的最新数据复制给双向绑定数据的role
        role.children = res.data;
      }
    },
    //展示分配权限对话框
    async showSetRightDialog() {
      //获取所有权限列表
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200) {
        return this.$message.error("获取权限列表失败！");
      }
      //获取的权限列表保存
      this.rightsList = res.data;
     
      this.setRightDialogVisable = true;
    },
    //通过递归获取角色下所有三级权限的id，并绑定到树形控件
    // getLeafKeys(node,arr){
    //     if
    // }
  }
};
</script>

<style lang="less" scope>
.el-table-column {
  transition: all 0.3s;
}
</style>