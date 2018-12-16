const PostModel = require('../models/post')
const CategoryModel = require('../models/category')

module.exports = {
  async index (ctx, next) {
    const posts = await PostModel.find({})
    const categories = await CategoryModel.find({}).limit(5)
    await ctx.render('index', {
      title: 'koa2-blog',
      desc: '将进一步修改',
      posts,
      categories
    })
  }
}
