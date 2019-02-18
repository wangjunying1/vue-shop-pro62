<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card区域 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-button type="primary">添加角色</el-button>
      <!-- 表格数据列表 -->
      <el-table :data="roleList" border scripe>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    created(){
        this.getRoleList()
    },
    data() {
        return {
            roleList:''
        }
    },
    methods:{
async  getRoleList(){
    const {data:res} = await this.$http.get('roles')
    if(res.meta.status !== 200) {return this.$message({
        message:'获取列表失败',
        type:'error',
        duration:1000
    })}
    this.roleList = res.data
}
    }
}
</script>

<style lang="less" scoped>
</style>
