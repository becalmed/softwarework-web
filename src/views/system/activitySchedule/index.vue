<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">

          <el-form-item label="活动日程名称">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="开始时间">
            <div class="block" style="width: 370px;">
              <span class="demonstration" />
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="选择日期时间"
              />
            </div>
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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="title" label="活动日程名称" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column label="操作" v-if="checkUserType==='活动创建者'"  width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
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
import crudActivitySchedule from '@/api/system/activitySchedule'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, aid: null, title: null, createTime: null, startTime: null }
export default {
  name: 'ActivitySchedule',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '活动日程', url: 'api/activitySchedule', idField: 'id', sort: 'id,desc', crudMethod: { ...crudActivitySchedule }})
  },
  props: ['aid','checkUserType'],
  data() {
    return {
      aid :'',
      permission: {
        add: ['admin', 'activitySchedule:add'],
        edit: ['admin', 'activitySchedule:edit'],
        del: ['admin', 'activitySchedule:del']
      },
      rules: {
        id: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
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
      this.form.aid = this.aid
    },


  }
}
</script>

<style scoped>

</style>
