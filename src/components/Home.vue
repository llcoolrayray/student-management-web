<template>
  <a-layout id="components-layout-demo-responsive">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="['1']"
        @click="onSelect"
      >
        <a-menu-item key="DepartmentComponent">
          <a-icon type="user" />
          <span class="nav-text">系部信息</span>
        </a-menu-item>
        <a-menu-item key="TeachingPlanComponent">
          <a-icon type="upload" />
          <span class="nav-text">教学计划信息</span>
        </a-menu-item>
        <a-menu-item key="StudentComponent">
          <a-icon type="upload" />
          <span class="nav-text">学生信息</span>
        </a-menu-item>
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="mail" /><span>成绩管理</span></span>
          <a-menu-item key="GradeComponent">
            成绩信息
          </a-menu-item>
          <a-menu-item key="6">
            成绩分析
          </a-menu-item>
          <a-menu-item key="7">
            成绩统计
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }" />
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="textAlign: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
  export default {
    methods: {
      onCollapse(collapsed, type) {
        console.log(collapsed, type);
      },
      onBreakpoint(broken) {
        console.log(broken);
      },
      onSelect(item) {
        this.$router.push({
          name: item.key,
        });
      }
    },
  };
</script>

<style>
  #components-layout-demo-responsive .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }

  #components-layout-demo-responsive {
    height: 100% !important;
  }
</style>
