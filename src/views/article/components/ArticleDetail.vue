<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" label-position="top">

      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">

          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">发布
          </el-button>

        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>

      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">

            <div class="postInfo-container">

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="'区域'" prop ="type" >
                    <el-select class="filter-item" v-model="postForm.area"  placeholder="请选择区域" @change="getCompany()">
                      <el-option v-for="item in postForm.areas" :key="item._id" :label="item.title" :value="item._id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="'职位'" prop ="type" >
                    <el-select class="filter-item" v-model="postForm.position"  placeholder="请选择经销商">
                      <el-option v-for="item in  postForm.positions" :key="item._id" :label="item.title" :value="item._id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="'发布时间(文章会按照发布时间排序)'" prop ="publish_date" >
                          <el-date-picker
                          v-model="postForm.publish_date"
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="'经销商'" prop ="type" >
                    <el-select class="filter-item" v-model="postForm.company" placeholder="请选择经销商" style="width: 600px;">
                      <el-option v-for="item in  postForm.companies" :key="item._id" :label="item.title" :value="item._id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item :label="'职位链接'" prop ="type" >
                      <el-input placeholder="请粘贴职位链接" style='min-width:150px;' v-model="postForm.url" >
                      </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleFile'
import UploadImage from '@/components/Upload/singleImage3'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'

import { fetchList as fetchCompany} from '@/api/company'
import { fetchList as fetchArea} from '@/api/area'
import { fetchList as fetchPosition} from '@/api/position'
import { addJob } from '@/api/job'


const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  url: "",
  company: "",
  area:"",
  position:"",
  areas:[],
  positions:[],
  companies:[],
  publish_date: new Date(), // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false
}

export default {
  name: 'articleDetail',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: '内容未填写完整',
          type: 'error'
        })
        //callback(null)
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          //callback(null)
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      userLIstOptions: [],
      platformsOptions: [
        { key: 'a-platform', name: 'a-platform' },
        { key: 'b-platform', name: 'b-platform' },
        { key: 'c-platform', name: 'c-platform' }
      ],
      typeOptions: {},
      rules: {
        title: [{ required: true, validator: validateRequire }],
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    }
  },
  created() {
      this.postForm = Object.assign({}, defaultForm)
      fetchArea({limit:100, page:0}).then(response => {
        this.postForm.areas = response.data.items
        this.postForm.area = this.postForm.areas[0]._id
        this.getCompany()
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
  },
  methods: {
      getCompany() {
        fetchCompany({area: this.postForm.area}).then(response => {
          if (response.data.error_code == 0) {
              this.postForm.companies = response.data.items
              if(this.postForm.companies.length>0){
                this.postForm.company = this.postForm.companies[0]._id
                this.getPosition()
              }else{
                this.company = ""
              }
          } else {
            alert('获取经销商失败!')
          }
        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    },

    getPosition() {
        fetchPosition({}).then(response => {
          if (response.data.error_code == 0) {
              this.postForm.positions = response.data.items
              if(this.postForm.positions.length>0){
                this.postForm.position = this.postForm.positions[0]._id
              }else{
                this.postForm.position = ""
              }
          } else {
            alert('获取职位失败!')
          }
        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    },

    submitForm() {
      console.log(this.postForm)
      var self = this
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true

            const submitData = {
              'url': self.postForm.url,
              'area' : self.postForm.area,
              'position': self.postForm.position,
              'company': self.postForm.company,
              'publish_date':self.postForm.publish_date,
            }

            // add new article
            addJob(submitData).then(response => {
              if (response.data.error_code === 0) {
                this.$notify({
                  title: '成功',
                  message: '添加职位信息成功',
                  type: 'success',
                  duration: 2000
                })
                // this.postForm.status = 'published'
                // this.$router.push({path: '/article/list'})
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                })
              }
              this.loading = false
            }).catch(err => {
              this.$message({
                message: '添加职位信息失败',
                type: 'warning'
              })
              this.loading = false
              console.log(err)
            })

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }

  label{
    text-align: left !important;
  }
</style>

