# 基于Vue框架的电商后台管理系统   


[:checkered_flag:在线体验地址](http://39.98.114.76:9000/) 账号与密码已经默认输入好，直接点击登录就可以了！

### :bell:本地项目使用指南：
1. 点击绿色按钮`Code`，DownLoad Zip并解压。
2. 在该项目下执行`npm install`安装依赖
3. 执行`npm run serve`打开本地服务

### :microphone:基础介绍
- 项目介绍：本系统为电商管理系统，电商后台管理系统用于管理用户账号、商品分类、商品信息、订单、数据统计等业务功能。
- 主要负责：独立完成项目前端部分开发，依照API文档的说明调用接口获取数据，完成项目的各个功能模块。
- 开发模式：电商后台管理系统整体采用前后端分离的开发模式，其中前端项目是基于 Vue 技术栈的 SPA 项目。
- 项目技术：Vue、Vue-router、Element-UI、Axios。
- 详细内容：
  -  登录成功客户端将token保存到sessionStorage中，后续的请求都将此token发送给服务器，服务器会验证token以保证用户身份，从而保持登录状态。  
  -  通过 Externals 加载外部 CDN 资源，优化 ElementUI 按需导入代码，减小打包后项目体积。
  -  使用Vue异步组件实现懒加载，按需加载，分担页面加载压力，提高首屏加载性能。
  -  使用$refs获取多个相同组件节点对象，减少获取DOM节点的消耗。
  -  优化 ElementUI 按需导入代码，并使用global.css对重复CSS样式包装，减小项目体积。
  -  属性 :rule 绑定表单验证规则对象，结合 $refs 和 validate 方法实现表单预校验，使用 async、await 配合 Axios 实现异步请求。

### :trophy:项目效果
![image](https://user-images.githubusercontent.com/61936126/116988230-ae417f80-ad02-11eb-8fe7-3ee4645e0116.png)
![image](https://user-images.githubusercontent.com/61936126/116988288-c0232280-ad02-11eb-978f-4a5ebecd2127.png)
![image](https://user-images.githubusercontent.com/61936126/116988385-de891e00-ad02-11eb-8f60-b6b26031774b.png)
