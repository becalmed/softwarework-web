<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">

          <el-form-item label="用户分类">
            <el-input v-model="form.classify" style="width: 370px;"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="activityId" label="活动" >
          <template slot-scope="scope">
            <div>{{ scope.row.activity.activityName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="报名用户">
          <template slot-scope="scope">
            <div>{{ scope.row.user.username }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="报名时间"/>
        <el-table-column prop="classify" label="分类"/>
        <el-table-column v-if="this.checkUserType==='活动创建者'" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">
            <udOperation
                :data="scope.row"
                :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
import crudActivityUser from '@/api/system/activityUser'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {id: null, activityId: null, userId: null, status: null, createTime: null, classify: null}
export default {
  name: 'ActivityUser',
  components: {pagination, crudOperation, rrOperation, udOperation},
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '活动用户',
      url: 'api/activityUser',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: {...crudActivityUser}
    })
  },
  props: ['aid', 'checkUserType'],
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
    }
  },
  data() {
    return {
      permission: {

      },
      rules: {}
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      this.crud.params = {activityId: this.aid}
      return true
    },
    [CRUD.HOOK.beforeToAdd]() {
      this.form.activityId = this.aid
    },
  }
}
</script>

<style scoped>

</style>
