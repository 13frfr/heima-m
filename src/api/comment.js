import request from '@/utils/request'
export const getArticleComment = (params) => {
  return request({
    url: '/v1_0/comments',
    method: 'GET',
    params
  })
}
/**
 * 对文章或者评论进行评论
 * @param {*} target 评论的目标id（
 * @param {*} content 评论内容
 * @param {*} id 文章id
 * @returns
 */
export const articlesOrComments = (data) => {
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data
  })
}

/**
 * 点赞
 */
export const addLike = (articleId) => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: articleId
    }
  })
}

/**
 * 取消点赞
 */
export const deleteLike = (articleId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${articleId}`
  })
}
