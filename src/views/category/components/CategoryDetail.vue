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
                <el-col :span="24">
                  <el-form-item :label="'区域'" prop ="type" >
                    <el-select class="filter-item" v-model="postForm.area"  placeholder="请选择区域">
                      <el-option v-for="item in postForm.areas" :key="item._id" :label="item.title" :value="item._id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="经销商录入:支持一个区域下多个经销商一次导入，只需使用 ； （中文分号）隔开。例如：经销商1；经销商2；经销商3" prop="company">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入经销商" v-model="postForm.company" >
          </el-input>
        </el-form-item>

        <!-- <el-form-item style="margin-bottom: 40px;" label-width="100px" label="排序等级:(最小1,最大100，数字越大排序显示越靠前)" prop="sort" >
            <el-slider v-model="postForm.sort" :min="1"></el-slider>
        </el-form-item> -->

      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchList as fetchCompany} from '@/api/company'
import { fetchList as fetchArea} from '@/api/area'
import { fetchList as fetchPosition} from '@/api/position'
import { addCompany } from '@/api/company'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  url: "",
  company: "",
  area:"",
  position:"",
  areas:[],
  positions:[],
  publish_date: new Date(), // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false
}

export default {
  name: 'categoryDetail',
  components: { Tinymce, MDinput, Upload, Multiselect, Sticky },
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
      rules: {
        company: [{ required: true, validator: validateRequire }],
        // title: [{ required: true, validator: validateRequire }],
        // content_short: [{ required: true, validator: validateRequire }]
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },

    companies() {
      var array = this.postForm.company.split("；");
      var nums = [];
      for(var i = 0 ;i < array.length ; i++){
        nums.push({"title":array[i]});
      }

      return nums
    }
  },
  created() {

      this.postForm = Object.assign({}, defaultForm)

      fetchArea({limit:100, page:0}).then(response => {
        this.postForm.areas = response.data.items
        this.postForm.area = this.postForm.areas[0]._id
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
  
  },
  methods: {

    submitForm() {
      console.log(this.postForm)
      var self = this
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true

            const submitData = {
              'id' : self.postForm.area,
              'companies': self.companies,
            }

            // add new article
            addCompany(submitData).then(response => {
              if (response.data.error_code === 0) {
                this.$notify({
                  title: '成功',
                  message: '添加经销商信息成功',
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
                message: '添加经销商信息失败',
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

