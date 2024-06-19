<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="资源名称">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>

          <el-form-item label="资源类型">
            <el-select v-model="form.type" style="width: 370px;"  class="edit-input"  size="mini" placeholder="资源类型">
              <el-option label="大教室（150人）" value="大教室（150人）"/>
              <el-option label="小教室（80人）" value="小教室（80人）"/>
              <el-option label="大机房（60人）" value="大机房（60人）"/>
              <el-option label="小机房（20人）" value="小机房（20人）"/>
              <el-option label="大会议室（200人）" value="大会议室（200人）"/>
              <el-option label="小会议室（50人）" value="小会议室（50人）"/>
              <el-option label="礼堂" value="礼堂"/>
              <el-option label="篮球场" value="篮球场"/>
              <el-option label="足球场" value="足球场"/>
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
        <el-table-column prop="name" label="资源名称" />
        <el-table-column prop="type" label="资源类型" />
        <el-table-column v-if="checkPer(['admin','resourceRequirements:edit','resourceRequirements:del'])" label="操作" width="150px" align="center">
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
import crudResourceRequirements from '@/api/system/resourceRequirements'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, type: null }
export default {
  name: 'ResourceRequirements',
  components: {pagination, crudOperation, rrOperation, udOperation},
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '资源',
      url: 'api/resourceRequirements',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: {...crudResourceRequirements}
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'resourceRequirements:add'],
        edit: ['admin', 'resourceRequirements:edit'],
        del: ['admin', 'resourceRequirements:del']
      },
      rules: {}
    }
    },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
