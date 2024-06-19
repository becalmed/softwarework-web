<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">活动名称</label>
        <el-input v-model="query.activityName" clearable placeholder="活动名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px"><!---->
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="活动名称" prop="activityName">
            <el-input v-model="form.activityName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="活动类型" prop="activityProgress">
            <el-select v-model="form.activityProgress" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.activity_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="活动预算" prop="cost">
            <el-input v-model="form.cost" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="开始日期" prop="startTime">
            <div class="block" style="width: 370px;">
              <span class="demonstration" />
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="选择日期时间"
              />
            </div>
          </el-form-item>
          <el-form-item label="结束日期" prop="endTime">
            <div class="block" style="width: 370px;">
              <span class="demonstration" />
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="选择日期时间"
              />
            </div>
            <!--<el-input v-model="form.endTime" style="width: 370px;" /-->
          </el-form-item>

          <el-form-item label="资源需求列表">
            <el-select v-model="form.rtypeTemp" style="width: 370px;"  class="edit-input"  size="mini" placeholder="资源类型">
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
        <el-table-column prop="activityName" label="活动名称" />
        <el-table-column prop="activityProgress" label="活动类型">
          <template slot-scope="scope">
            {{ dict.label.activity_status[scope.row.activityProgress] }}
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" >
        <template slot-scope="scope">
          <div>{{scope.row.user.username}}</div>
        </template>
        </el-table-column>
        <el-table-column prop="cost" label="活动预算" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="startTime" label="开始日期" />
        <el-table-column prop="endTime" label="结束日期" />
        <el-table-column prop="rid" label="资源分配情况" >
          <template slot-scope="scope">
            <div v-if="scope.row.resourceRequirements">{{scope.row.resourceRequirements.type}}-{{scope.row.resourceRequirements.name}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
            <br>
            <el-button v-if="scope.row.resourceRequirements" type="primary" size="mini" @click="goDetail(scope.row)">活动详情</el-button>
            <br>
            <el-button v-if="scope.row.resourceRequirements" type="warning" size="mini" @click="baobiao(scope.row)">报表</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudSysActivity from '@/api/system/sysActivity'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { activityId: null, activityName: null, activityProgress: null, cost: null, updateBy: null, createTime: null, updateTime: null, startTime: null, startHour: null, endTime: null, endHour: null, participants: null, resourceRequirements: null }
export default {
  name: 'SysActivity',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['activity_status'],
  cruds() {
    return CRUD({ title: 'api.activity', url: 'api/activity/create', idField: 'activityId', sort: 'activityId,desc', crudMethod: { ...crudSysActivity }})
  },
  data() {
    return {
      permission: {
        add: [],
        edit: [],
        del: []
      },
      rules: {
        activityName: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' }
        ],
        activityProgress: [
          { required: true, message: '活动类型不能为空', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '活动预算不能为空', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '开始日期不能为空', trigger: 'blur' }
        ],

        endTime: [
          { required: true, message: '结束日期不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'activityName', display_name: '活动名称' },
        { key: 'activityProgress', display_name: '活动类型' }

      ],
      options: [{
        value: '1',
        label: '教室'
      }, {
        value: '2',
        label: '操场'
      }, {
        value: '3',
        label: '机房'
      }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    goDetail(row){
      this.$router.push({
        path: "/activity/activityDetail",
        query: { id: row.activityId }
      });
    },
    baobiao(row){
      this.$router.push({
        path: "/chart/chart",
        query: { id: row.activityId }
      });
    }
  }

}
</script>

<style scoped>

</style>
