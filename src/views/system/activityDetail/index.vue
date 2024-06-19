<template>
  <div>
    <el-dialog :close-on-click-modal="false"  :visible.sync="emailVisible" title="分享活动" width="500px">
      <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="100px">
        <el-form-item label="邮件标题" prop="subject">
          <el-input v-model="form.subject"  placeholder="请输入邮件标题，标题不能为空" />
        </el-form-item>
        <el-form-item label="收件地址" prop="tos">
          <el-input v-model="form.tos"  placeholder="请输入收件地址，多个地址英文逗号,隔开" />
        </el-form-item>
        <el-form-item label="收件地址" prop="tos">
          <el-input type="textarea" v-model="form.content" autosize  placeholder="内容" />
        </el-form-item>
        <div></div>
        <div ref="editor" class="editor" />
        <el-button :loading="loading" style="margin-left:1.6%;margin-bottom: 30px" size="medium" type="info" @click="this.emailVisible=false">取消</el-button>
        <el-button :loading="loading" style="margin-left:1.6%;margin-bottom: 30px" size="medium" type="primary" @click="doSubmit">邮件分享</el-button>
      </el-form>
    </el-dialog>
    <el-card>
      <blockquote class="my-blockquote">活动名称：{{ activity.activityName }}</blockquote>
      <div style="padding-left:30px;">
        <el-form ref="form" size="small">
          <el-form-item label="活动地点 : " class="centered-label">
            {{ activity.resourceRequirements.name }}-{{ activity.resourceRequirements.name }}
          </el-form-item>
          <el-form-item label="活动发布人 : " class="centered-label">
            {{ activity.user.username }}
          </el-form-item>
          <el-form-item label="活动经费 : " class="centered-label">
            {{ activity.cost }}元
          </el-form-item>
          <el-form-item label="创建发布时间 : " class="centered-label">
            {{ activity.createTime }}
          </el-form-item>
          <el-form-item label="活动开始时间 : " class="centered-label">
            {{ activity.startTime }}
          </el-form-item>
          <el-form-item label="活动结束时间 : " class="centered-label">
            {{ activity.endTime }}
          </el-form-item>
          <el-form-item label="活动状态 : " class="centered-label">
            {{ dict.label.activity_status[activity.activityProgress] }}
          </el-form-item>
        </el-form>

        <el-button type="primary" class="fixed-bottom-right" @click="baoming" v-if="activity.checkUserType==='可报名'">报名活动</el-button>
        <el-button type="warning" class="fixed-bottom-right" @click="fenxiang" >分享该活动</el-button>

      </div>
    </el-card>

    <el-row>
      <el-col :span="24">
        <el-card>
          <blockquote class="my-blockquote">活动人员分配</blockquote>
          <activity-user :aid="activity.activityId" :checkUserType="activity.checkUserType"></activity-user>
        </el-card>
      </el-col>

    </el-row>

    <el-row>
      <el-col :span="12">
        <el-card>
          <blockquote  class="my-blockquote">活动日程</blockquote>
          <activity-schedule :aid="activity.activityId" :checkUserType="activity.checkUserType"></activity-schedule>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <blockquote class="my-blockquote">活动经费-{{activity.cost}}元</blockquote>
          <Cose :aid="activity.activityId" :checkUserType="activity.checkUserType"></Cose>
        </el-card>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card>
          <blockquote class="my-blockquote" >活动讨论</blockquote>
          <Reply :aid="activity.activityId" :checkUserType="activity.checkUserType"></Reply>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <blockquote class="my-blockquote">活动反馈</blockquote>
          <activity-feedback :aid="activity.activityId" :checkUserType="activity.checkUserType"></activity-feedback>
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import {get} from '@/api/system/sysActivity'
import {add} from '@/api/system/activityUser'

import eForm from "../../mnt/database/execute";
import Cose from '../activityCost/index'
import ActivitySchedule from '../activitySchedule/index'
import ActivityFeedback from '../activityFeedback/index'
import Reply from '../reply/index'
import ActivityUser from '../activityUser/index'
import { send } from '@/api/tools/email'
import { upload } from '@/utils/upload'
import { mapGetters } from 'vuex'
import E from 'wangeditor'

export default {
  name: "courseDetail",
  components: {ActivityFeedback,ActivitySchedule, Cose,ActivityUser,Reply},
  dicts: ['activity_status'],
  computed: {
    ...mapGetters([
      'imagesUploadApi',
      'baseApi'
    ])
  },
  mounted() {


  },
  data() {
    return {
      loading: false, form: { subject: '', tos: '', content: '' },
      rules: {
        subject: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        tos: [
          { required: true, message: '收件人不能为空', trigger: 'blur' }
        ]
      },
      emailVisible :false,
      activity: {},
    }
  },
  created() {
    this.init();
  },
  methods: {
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          send(this.form).then(res => {
            this.$notify({
              title: '分享成功',
              type: 'success',
              duration: 2500
            })
            this.emailVisible = false
            this.loading = false
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    },
    init() {

      get(this.$route.query.id).then(res => {
        this.activity = res
      }).catch(() => {
      })

    },
    baoming(row){
      this.$confirm('你确定要报名吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "info"
      }).then(() => {
        add({activityId:this.activity.activityId}).then(res => {
          this.$message.success('恭喜你报名成功！')
          this.$router.go(0);
        }).catch(() => { })
      })
    },
    fenxiang(){
      this.emailVisible = true
      this.form.subject = '活动分享:'+this.activity.activityName;
      this.form.content = '活动地点'+this.dict.label.activity_status[this.activity.activityProgress]+"\n" +'活动时间：'+this.activity.startTime

    }


  },
};
</script>

<style scoped>
.product-image {
  width: 100%;
  height: auto;
}

.product-title {
  font-size: 24px;
  margin-top: 0;
}

.product-description {
  font-size: 16px;
  margin-top: 0;
}

.product-price {
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 20px;
}
</style>
