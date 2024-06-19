<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="createUser" label="发送用户" >
          <template slot-scope="scope">
            <div>{{scope.row.user.username}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="接收用户" />
        <el-table-column prop="type" label="类型" >
          <template slot-scope="scope">
            <div>{{scope.row.cuser.username}}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','message:edit','message:del'])" label="操作" width="150px" align="center">
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
import crudMessage from '@/api/system/message'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, title: null, content: null, createTime: null, createUser: null, uid: null, type: null }
export default {
  name: 'Message',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '消息', url: 'api/message', idField: 'id', sort: 'id,desc', crudMethod: { ...crudMessage }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'message:add'],
        edit: ['admin', 'message:edit'],
        del: ['admin', 'message:del']
      },
      rules: {
      }
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
