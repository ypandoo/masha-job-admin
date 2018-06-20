<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.title">
      </el-input>
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" :placeholder="$t('table.importance')">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select> -->
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.area" :placeholder="'请选择区域'">
        <el-option v-for="item in  areas" :key="item._id" :label="item.title" :value="item._id">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.position" :placeholder="'请选择职位名称'">
        <el-option v-for="item in  positions" :key="item._id" :label="item.title" :value="item._id">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 300px" v-model="listQuery.company" :placeholder="'请选择经销商'">
        <el-option v-for="item in  companies" :key="item._id" :label="item.title" :value="item._id">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <!-- <el-table-column align="center" :label="$t('table.id')" width="240">
        <template slot-scope="scope">
          <span>{{scope.row._id}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="center" :label="$t('table.image')" width="160">
        <template slot-scope="scope">
          <img :src="scope.row.url" style="width:80px; height:60px"/>
        </template>
      </el-table-column> -->


      <el-table-column  :label="'职位名称'">
        <template slot-scope="scope">
          <span>{{scope.row.position.title}}</span>
        </template>
      </el-table-column>

      <el-table-column  :label="'区域'" >
        <template slot-scope="scope">
         <span>{{scope.row.area.title}}</span>
        </template>
      </el-table-column>

      <el-table-column  :label="'经销商'" width="300">
        <template slot-scope="scope">
         <span>{{scope.row.company.title}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200"  :label="'发布时间'">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.publish_date) | parseTime }}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" :label="$t('table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <router-link :to="'edit-article/'+scope.row._id" class="link-type" style="margin-right:20px" >编辑</router-link> -->
          <el-button type="danger" size="mini" @click="handleConfirmDelete(scope.row)">{{$t('table.delete')}}</el-button>
          <!-- <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{$t('table.publish')}}
          </el-button> -->
          <!-- <el-button v-if="scope.row.show" size="mini" @click="handleModifyStatus(scope.row, true)">显示
          </el-button>
          <el-button v-if="!scope.row.show" size="mini" type="danger" @click="handleModifyStatus(scope.row, false)">不显示
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <el-dialog title="删除" :visible.sync="dialogDelete">

      <span >请确认是否删除您的文章?</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="handleDelete">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList as fetchCompany} from '@/api/company'
import { fetchList as fetchArea} from '@/api/area'
import { fetchList as fetchPosition} from '@/api/position'
import { fetchList, deleteJob } from '@/api/job'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      currentRow: {},
      listQuery: {
        page: 1,
        limit: 20,
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },
      areas: [],
      positions: [],
      companies: [],
      importanceOptions: [1, 2, 3],
      typeOptions: {},
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        updatedAt: new Date(),
        title: '',
        type: '',
        author: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogDelete: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        updatedAt: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    formatTime(time){
      return new Date(time).toISOString().slice(0, 10);
    }
  },
  created() {
    this.getArea()
    this.getPosition()
    this.getList()
  },
  methods: {
    getList() {
      var self = this
      self.listLoading = true
      fetchList(self.listQuery).then(response => {
        self.list = response.data.items
        self.total = response.data.total
        self.listLoading = false
      })
    },

    getArea(){
        fetchArea({limit:100, page:0}).then(response => {
          this.areas = response.data.items
          this.getCompany()
        }).catch(err => {
          console.log(err)
        })
    },

    getCompany() {
        fetchCompany({area: this.listQuery.area}).then(response => {
          if (response.data.error_code == 0) {
              this.companies = response.data.items
              if(this.companies.length>0){
                //this.postForm.company = this.postForm.companies[0]._id
                this.getPosition()
              }else{
                this.company = ""
              }
          } else {
            alert('获取经销商失败!')
          }
        }).catch(err => {
          console.log(err)
        })
    },

    getPosition() {
        fetchPosition({}).then(response => {
          if (response.data.error_code == 0) {
              this.positions = response.data.items
              if(this.positions.length>0){
                //this.postForm.position = this.postForm.positions[0]._id
              }else{
                this.postForm.position = ""
              }
          } else {
            alert('获取职位失败!')
          }
        }).catch(err => {
          console.log(err)
        })
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },

    handleModifyStatus(row, show) {
      showCategory({show:show}).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.show = show
      }).catch(err => {
        this.$message({
          message: '操作失败',
          type: 'warning'
        })
        console.log(err)
      })


    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(id) {

      deleteJob({ id: this.currentRow._id }).then(response => {
        this.$notify({
          title: '成功',
          message: '职位已关闭',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(this.currentRow)
        this.list.splice(index, 1)
      }).catch(err => {
        this.$notify({
          title: '失败',
          message: '职位关闭失败',
          type: 'warning',
          duration: 2000
        })
        console.log(err)
      })

      this.dialogDelete = false
    },
    handleConfirmDelete(row){
      this.currentRow = row
      this.dialogDelete = true
    },
    // handleFetchPv(pv) {
    //   // fetchPv(pv).then(response => {
    //   //   this.pvData = response.data.pvData
    //   //   this.dialogDelete = true
    //   // })
    // },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel(tHeader, data, 'table-list')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
