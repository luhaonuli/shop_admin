
// 导入
import ElementTreeGrid from 'element-tree-grid'
// console.log(ElementTreeGrid.name)

export default {
  name: 'Categories',

  data () {
    return {
      // 分类列表数据
      cateList: [],
      // 记录总条数
      total: 0,

      // 表格数据加载中提示
      loading: true,

      // 控制添加分类对话框的展示和因此
      cateAddDialog: false,
      // 添加分类表单数据
      cateAddForm: {
        // 分类名称
        cat_name: '',
        // 分类的父级id
        // cat_id 会存储一级和二级分类的id，但是，添加的时候，只需要提供 数组最后一项值即可
        //  比如：[1, 3] 就提供 3
        //        [1] 就提供 1
        cat_pid: [],
        // 分类的级别
        //  cat_id 数组的长度 就是当前要添加菜单的级别
        cat_level: -1
      },

      // 父级分类数据
      cateAddList: []

      /* options: [{
        value: 'zhinan',
        label: '指南',
        // 2级
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          // 3级
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }]
      }] */
    }
  },

  created () {
    // 获取分类列表数据
    this.getCateList()
  },

  methods: {
    // 获取分类列表数据
    async getCateList (pagenum = 1) {
      const res = await this.$http.get(`/categories`, {
        params: {
          type: 3,
          // 添加这两个参数后，就能分页获取数据
          pagenum,
          pagesize: 10
        }
      })

      // console.log('商品分类：', res)
      const { meta, data } = res.data
      if (meta.status === 200) {
        // 分类列表数据
        this.cateList = data.result
        // 总条数
        this.total = data.total
        // 关闭加载中提示
        this.loading = false
      }
    },

    // 点击分页组件，获取当前页数据
    changePage (curPage) {
      // 每次加载某一页的数据，都需要将 loading 设置为true
      this.loading = true

      // 根据参数 curPage 来获取当前页的数据
      this.getCateList(curPage)
    },

    // 打开添加分类对话框
    showCateAddDialog () {
      this.cateAddDialog = true

      // 获取到父级分类
      this.getCateAddList()
    },

    // 获取一级和二级分类菜单
    async getCateAddList () {
      const res = await this.$http.get(`/categories`, {
        params: {
          type: 2
        }
      })

      const { meta, data } = res.data
      if (meta.status === 200) {
        // 分类列表数据
        this.cateAddList = data
      }
    },

    // 添加分类
    async addCate () {
      // 解构的同时给属性名起别名:
      let { cat_name: catName, cat_pid: catPid } = this.cateAddForm

      const res = await this.$http.post(`/categories`, {
        cat_name: catName,
        cat_pid: catPid[catPid.length - 1],
        cat_level: catPid.length
      })

      // console.log(res)
      const { meta } = res.data
      if (meta.status === 201) {
        // 关闭对话框
        this.cateAddDialog = false
        // 获取列表数据
        this.getCateList()
        // 重置表单
        this.cateAddForm.cat_name = ''
        this.cateAddForm.cat_pid = []
      }
    }
  },

  // 用于注册当前组件的局部组件
  components: {
    // 'el-table-tree-column': ElementTreeGrid

    // 使用ES6中的属性名表达式
    [ElementTreeGrid.name]: ElementTreeGrid
  }
}
