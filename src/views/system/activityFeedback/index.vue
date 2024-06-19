<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">


          <el-form-item label="反馈内容">
            <el-select v-model="form.content" style="width: 370px;"  class="edit-input"  size="mini" placeholder="请选择">
              <el-option label="非常满意" value="非常满意"/>
              <el-option label="满意" value="满意"/>
              <el-option label="一般" value="一般"/>
              <el-option label="不满意" value="不满意"/>
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="user" label="用户" >
          <template slot-scope="scope">
            <div>{{ scope.row.user.username }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="反馈内容" />

        <el-table-column prop="createTime" label="反馈时间" />
        <el-table-column v-if="checkUserType!='可报名'" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudActivityFeedback from '@/api/system/activityFeedback'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, activityId: null, userId: null, content: null, createTime: null }
export default {
  name: 'ActivityFeedback',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '活动反馈', url: 'api/activityFeedback', idField: 'id', sort: 'id,desc', crudMethod: { ...crudActivityFeedback }})
  },
  created() {
    if(this.checkUserType==='已参与该活动'){
      this.crud.optShow = { add: true,edit:false, del: false, download: false }
    }
    if(this.checkUserType==='可报名'){
      this.crud.optShow = { add: false,edit:false, del: false, download: false }
    }
  },
  props: ['aid','checkUserType'],
  data() {
    return {
      permission: {

      },
      rules: {
      }
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      this.crud.params = { activityId:this.aid }
      return true
    },
    [CRUD.HOOK.beforeToAdd]() {
      this.form.activityId = this.aid
    }

  }
}
</script>

<style scoped>

</style>
