/*

  富文本编辑器的使用:
  1 安装: npm install vue-quill-editor --save
  2 在当前组件中导入, 注册为局部组件并使用
*/

// 导入富文本编辑器的样式文件:
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入组件
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'GoodsAdd',

  data () {
    return {
      // 步骤条激活
      active: 0,

      // tab 激活
      activeName: 'basic',

      // 基本信息数据
      goodsAddForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        is_promote: '1',
        goods_cat: [],
        // 上传图片的路径数组
        pics: [],
        // 商品介绍
        goods_introduce: ''
      },

      // 添加商品时用到的商品分类
      goodsAddCate: [],

      // 图片上传接口
      uploadUrl: 'http://localhost:8888/api/private/v1/upload',
      // 设置上传文件的HTTP请求头
      uploadHeaders: {
        // 获取token
        Authorization: localStorage.getItem('token')
      }

      // radio: '1',
      // options: [{
      //   value: 'zhinan',
      //   label: '指南',
      //   // 2级
      //   children: [{
      //     value: 'shejiyuanze',
      //     label: '设计原则',
      //     // 3级
      //     children: [{
      //       value: 'yizhi',
      //       label: '一致'
      //     }, {
      //       value: 'fankui',
      //       label: '反馈'
      //     }, {
      //       value: 'xiaolv',
      //       label: '效率'
      //     }, {
      //       value: 'kekong',
      //       label: '可控'
      //     }]
      //   }]
      // }]
    }
  },

  created () {
    this.getGoodsAddCateList()
  },

  methods: {
    // 获取商品分类
    async getGoodsAddCateList () {
      const res = await this.$http.get('/categories', {
        params: {
          // 获取到3级分类
          type: 3
        }
      })

      const { meta, data } = res.data

      if (meta.status === 200) {
        this.goodsAddCate = data
      }
    },

    // 切换tab页
    changeTab (tab) {
      console.log('changeTab', tab.index)
      // 修改 步骤条 的激活值
      this.active = tab.index - 0
    },

    // 跳转到下一步：
    next (activeIndex, tabName) {
      this.active = activeIndex
      this.activeName = tabName
    },

    // 移除
    handleRemove (file, fileList) {
      // 移除 pics 中对应的图片
      console.log(file, fileList)
    },

    // 图片上传成功
    handleSuccess (response, file, fileList) {
      // 需要将上传后,服务器返回的图片地址获取到,暂存起来
      // 最终,在添加商品的时候,将商品的其他信息 与 图片地址, 一起提交给服务器
      // console.log(response, file, fileList)
      this.goodsAddForm.pics.push({
        pic: response.data.tmp_path
      })
    },

    // 添加商品
    async addGoods () {
      const res = await this.$http.post('/goods', {
        ...this.goodsAddForm,
        goods_cat: this.goodsAddForm.goods_cat.join(',')
      })

      // console.log(res)
      const { meta } = res.data
      if (meta.status === 201) {
        this.$message({
          type: 'success',
          message: meta.msg
        })

        // this.next(3)
        // 跳转到商品列表页面
        this.$router.push('/goods')
      }
    }
  },

  // 注册为局部组件
  components: {
    quillEditor
  }
}
