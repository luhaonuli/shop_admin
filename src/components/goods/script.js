
export default {
  name: 'Goods',

  data () {
    return {
      // 商品列表数据
      goodsList: [],
      // 总条数
      total: 0,
      // 当前页
      curPage: 1
    }
  },

  created () {
    // console.log('页码为：', this.$route.params.page)
    this.getGoodsList(this.$route.params.page)
  },

  // 监视路由参数的变化
  // 当路由参数改变的时候，要根据当前页码，来获取对应页的数据
  watch: {
    $route (to, from) {
      // console.log('to:', to)
      this.getGoodsList(to.params.page)
    }
  },

  methods: {
    // 获取表格数据
    async getGoodsList (pagenum = 1) {
      const res = await this.$http.get(`/goods`, {
        params: {
          pagenum,
          pagesize: 5
        }
      })

      const { meta, data } = res.data

      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total

        // console.log(typeof pagenum)
        // 设置当前页，注意：分页组件中需要的是 number 类型，所以， pagenum - 0 将字符串转化为number
        this.curPage = pagenum - 0
      }
    },

    // 索引号
    indexMethod (index) {
      return index + 1
    },

    // 切换页码
    changePage (page) {
      // 思路：直接修改哈希值中的页码为当前页码即可
      //      因为只要改变了哈希值，watch 就监视到哈希值发生改变，就会根据当前页来加载数据

      // 路由的编程式导航
      this.$router.push(`/goods/${page}`)
    }
  }
}
