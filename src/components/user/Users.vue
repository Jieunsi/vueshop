<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" > 首页 </el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisable =true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="No." type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="slotProps">
            <el-switch v-model="slotProps.row.mg_state" @change="userStateChanged(slotProps.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip
              effect="dark"
              content="修改用户"
              placement="top"
              open-delay:100
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除用户"
              placement="top"
              open-delay:100
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 设置用户权限 -->
            <el-tooltip
              effect="dark"
              content="设置用户权限"
              placement="top"
              open-delay:100
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
                
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisable" width="50%" @close="addDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisable" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="设置用户角色" :visible.sync="setRoleDialogVisable" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{this.userInfo.username}}</p>
        <p>当前的角色：{{this.userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="seletedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证手机号的规则
    var checkPhoneNumber = (rule, value, cb) => {
      const regMobile = /^(1[3|5-9]\d{9}$)/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("手机号格式错误"));
    };
    return {
      //获取用户列表的参数对象
      queryInfo: {
        //用户名
        query: "",
        //页码
        pagenum: 1,
        //每页显示数量
        pagesize: 5
      },
      userList: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisable: false,
      //控制修改用户对话框的显示与隐藏
      editDialogVisable: false,
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        mobile: "",
        email: ""
      },
      //添加表单的验证规则
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3到10之间",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "密码长度在6到15之间",
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            required: true,
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入正确的手机号",
            trigger: "blur"
          },
          {
            min: 11,
            max: 11,
            message: "手机号的长度为11位",
            trigger: "blur"
          },
          {
            validator: checkPhoneNumber,
            trigger: "blur"
          }
        ]
      },
      //修改表单数据
      editForm: {
        username: "",
        email: "",
        mobile: ""
      },
      //修改表单的规则
      editFormRules: {
        email: [
          {
            type: "email",
            required: true,
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入正确的手机号",
            trigger: "blur"
          },
          {
            min: 11,
            max: 11,
            message: "手机号的长度为11位",
            trigger: "blur"
          },
          {
            validator: checkPhoneNumber,
            trigger: "blur"
          }
        ]
      },
      //控制分配角色对话框的显示与隐藏
      setRoleDialogVisable: false,
      //需要被分配角色的用户信息
      userInfo: {},
      //修改角色时获取的角色列表
      roleList: [],
      //修改角色时已选择的角色id值
      seletedRoleId:''
    };
  },
  methods: {
    
    //get方法的参数用params表示
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      //console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("获取用户列表数据失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听switch开关状态的改变
    async userStateChanged(userinfo) {
      
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.closeAll();
      this.$message.success("更新用户状态成功");
    },
    //搜索框fixbug
    search() {
      this.queryInfo.pagenum = 1;
      this.getUserList();
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", {
          username: this.addForm.username,
          password: this.addForm.password,
          email: this.addForm.email,
          mobile: this.addForm.mobile
        });

        if (res.meta.status != 201) {
          this.$message.error("添加用户失败！");
          return;
        }
        this.$message.success("添加用户成功！");
        this.addDialogVisable = false;
        this.getUserList();
      });
    },
    //展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editForm = res.data;
      this.editDialogVisable = true;
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error(`更新用户失败！请检查格式`);
          return;
        }
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        );
        //console.log(res);
        if (res.meta.status != 200) {
          this.$message.error("更新用户失败！");
          return;
        }
        this.$message.success("更新用户成功！");
        this.editDialogVisable = false;
        this.getUserList();
      });
    },
    //根据id删除对应的用户信息
    async removeUserById(id) {
      //弹框询问是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status != 200) {
        this.$message.error("删除用户失败");
      }
      this.$message.success("成功删除用户！");
      this.getUserList();
    },
    //展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      //在展示对话框之前获取所有角色的列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.roleList = res.data;
      this.setRoleDialogVisable = true;
    },  
    //点击按钮分配角色
    async saveRoleInfo(){
      if(!this.seletedRoleId){
        return this.$message.error('请选择用户的角色')
      }
      if(this.userInfo.id == 500) return this.$message.error('admin的角色不可更改！')
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid: this.seletedRoleId})
      if(res.meta.status!=200){
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功');
      this.getUserList();
      this.setRoleDialogVisable = false;
    },
    //监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.seletedRoleId = '';
      this.userInfo = {};
    },
    removeNavState(){
      window.sessionStorage.removeItem('activePath');
    }
  },
  created() {
    this.getUserList();
  }
};
</script>

<style lang="less" scoped>
</style>