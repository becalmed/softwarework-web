<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="金额">
            <el-input v-model="form.price" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="费用说明">
            <el-input v-model="form.content" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="审核状态"  v-if="checkUserType==='活动创建者'">
            <el-select v-model="form.status" style="width: 370px;"  class="edit-input"  size="mini" placeholder="请选择">
              <el-option
                label="通过"
                value="通过"
              />
              <el-option
                label="不通过"
                value="不通过"
              />
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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="price" label="金额" />
        <el-table-column prop="content" label="费用说明" />
        <el-table-column prop="status" label="审核状态" />
        <el-table-column v-if="checkUserType==='活动创建者'" label="操作" width="150px" align="center">
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
import crudActivityCost from '@/api/system/activityCost'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, userId: null, activityId: null, price: null, content: null, status: null }
export default {
  name: 'ActivityCost',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '活动费用', url: 'api/activityCost', idField: 'id', sort: 'id,desc', crudMethod: { ...crudActivityCost }})
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
  created() {
    if(this.checkUserType==='活动创建者')
      this.crud.optShow = {
        add: true,
        edit: true,
        del: true,
      }
    if(this.checkUserType==='可报名')
      this.crud.optShow = {
        add: false,
        edit: false,
        del: false,
      }
    if(this.checkUserType==='已参与该活动')
      this.crud.optShow = {
        add: true,
        edit: false,
        del: false,
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
    },
  }
}
</script>

<style scoped>

</style>
