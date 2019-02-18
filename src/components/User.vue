<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索框和添加用户按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索的内容"
            v-model="querycdt.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格属于数据列表 -->
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="110"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="changeState(info.row.id,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button
              @click="showeditUser(info.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>

            <el-button
              @click="delUser(info.row.id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>

            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 数据分页展示 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3,5,10,20]"
        :page-size="querycdt.pagesize"
        layout="total,sizes,prev,pager,next,jumper"
        :total="querycdt.tot"
      ></el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialog" width="50%" @close="addDialogClose">
        <!-- 添加的表单 -->
        <el-form
          :model="addForm"
          ref="addFormRef"
          label-width="100px"
          :rules="addFormRules"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户弹出框 -->
      <el-dialog title="修改用户" :visible.sync="editDialog" width="50%" @close="editDialogClose">
        <!-- 修改用户的表单 -->
        <el-form
          :model="editForm"
          ref="editFormRef"
          label-width="100px"
          :rules="editFormRules"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserInfos()
  },
  methods: {
    //   修改用户状态的方法
    // uid:被修改的id，state：被修改后的状态信息true/false
    async changeState(uid, state) {
      const { data: res } = await this.$http.put(
        'users/' + uid + '/state/' + state
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    //   获取用户数据
    async getUserInfos() {
      const { data: res } = await this.$http.get('/users', {
        params: this.querycdt
      })
      // 判断获得数据是否失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得的用户数据赋予给userinfos成员
      this.userInfos = res.data.users
      //   记录总条数
      this.querycdt.tot = res.data.total
    },
    // 数据分页相关处理
    // 每条记录条数变化的回调函数
    handleSizeChange(arg) {
      this.querycdt.pagesize = arg
      this.getUserInfos()
    },
    // 当前页码变化的回调函数
    handleCurrentChange(arg) {
      this.querycdt.pagenum = arg
      this.getUserInfos()
    },

    // 添加用户弹框确定关闭
    addDialogClose(done) {
      // 清除校验结果
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户的方法
    addUser() {
      // 先校验表单，validate
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 表单验证成功
          const { data: res } = await this.$http.post('users', this.addForm)
          //  如果添加失败
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 添加成功：关闭对话框，弹出添加成功消息框，显示新添加用户
          this.addDialog = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },

    // 删除用户的方法
    delUser(id) {
      // 确认确定删除
      this.$confirm('确定要删除该用户吗？', '删除用户', {
        confimButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // 调用axios删除数据
          const { data: res } = await this.$http.delete('users/' + id)

          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功，弹出消息，更新数据
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        })
        .catch(() => {})
    },

    // 编辑用户信息方法
    // 编辑用户功能
    editUser() {
      // 校验
      this.$refs.editFormRef.validate(async valid => {
        // 成功后，清空form表单，
        if (!valid) {
          return null
        }
        // 实现数据修改
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          this.editForm
        )
        if (res.meta.status !== 200) {
          return this.$message({
            message: '修改数据失败',
            type: 'error',
            duration: 1000
          })
        }
        // 关闭弹窗，页面书信，清除表单数据
        this.editDialog = false
        this.getUserInfos()
        this.$refs.editFormRef.resetFields()
        this.$message({
          message: '用户修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    async showeditUser(id) {
      // 显示对话框
      this.editDialog = true
      // 数据修改失败
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //  把获得的数据赋予给editform
      this.editForm = res.data
    },
    // 编辑用户弹出框关闭
    // 编辑用户弹框确定关闭
    editDialogClose() {
      // 清除表单数据
      this.$refs.editFormRef.resetFields()
      this.editDialog = false
    }
  },

  data() {
    // 添加用户弹出框 手机号码正则验证规则
    var checkMobile = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('手机号码不能为空'))
      }
      if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error('手机号码有误，请重填！'))
      } else {
        callback()
      }
    }

    return {
      keywords: '',
      //  用户数据
      userInfos: [],
      // 给获取的数据设置查询条件
      querycdt: {
        // 查询关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页获取的记录条数
        pagesize: 3,
        // 总记录条数
        tot: 0
      },
      // 添加用户弹窗框数据
      addDialog: false,
      // 添加用户的表单数据对象
      addForm: {
        username: '',
        email: '',
        password: '',
        mobile: ''
      },
      // 验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      },

      // 修改用户弹出框数据
      editDialog: false,
      // 添加用户的表单数据对象
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 验证规则
      editFormRules: {
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
