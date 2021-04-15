<template>
  <div class="login-container">
    <div class="login_box">
        <!-- 头像区域 -->
        <div class="avater_box">
            <img src="../assets/logo.png" alt="">
        </div>
        <!-- 登陆表单区域 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
            <!-- 用户名 -->
            <el-form-item prop="username" >
            <!-- 通过属性prefix-icon在前面插入图标 -->
                <el-input v-model ="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
            <!-- 通过插槽slot在前面插入图标 -->
                <el-input v-model ="loginForm.password" type = "password">
                    <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                </el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            //这是登录表单的数据绑定对象
            loginForm:{
                username: 'admin',
                password: '123456'
            },
            //这是表单的验证规则
            loginFormRules:{
                //验证用户名是否合法
                username:[
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                //验证密码是否合法
                password:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        //点击重置按钮，重置登录表单
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
            this.$message.success('重置成功');
        },
        login(){
            this.$refs.loginFormRef.validate(async(valid) =>{
                if(!valid) return;
                const {data: result} =await this.$http.post('login',this.loginForm);
                if(result.meta.status != 200) return this.$message.error('登录失败！请输入正确的用户名或密码');
                this.$message.success('登录成功');
                //1、将登录成功之后的token保存到客户端的sessionStorage之中
                // 1.1 项目之中除了登录之外的其他API接口，必须在登录之后才能后访问
                // 1.2 token只应在当前网站打开期间生效，所以应该把token存放在sessionStorage而不是cookies或localStorage之中
                window.sessionStorage.setItem('token',result.data.token);//将token值保存到sessionStorage中
                // 2.通过编程式导航跳转到后台主页，对应的路由地址是 /home
                this.$router.push('/home');
            });
        }
    }
};
</script>

<style lang="less" scoped>
.login-container{
    background-color: #2b4b6b;
    height: 100%;
    //position: relative;
    //display: flex;
    // justify-items: center;
    // justify-content: center;
    
}

.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    //right: 0%;
    //bottom: 0%;
    //margin: auto;
    transform: translate(-50%,-50%);
    
    .avater_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform:translate(-50%,-50%) ;
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;//需要把默认的box-sizing为content
}

.btns{
    display: flex;
    justify-content: flex-end;//居右对齐
}

</style>