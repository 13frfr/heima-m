import request from '@/utils/request'

export const getArticleList = (channelId, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}
export const getArticleDetails = (articleId) => {
  return request({
    url: `/v1_0/articles/${articleId}`
  })
}
/**
 * 收藏文章
 * @param {*} target 收藏的目标文章id
 * @returns message data target
 */
export const getArticleCollected = (target) => {
  return request({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: {
      target
    }
  })
}

/**
 * 取消收藏文章
 * @returns
 */
export const cancelArticleCollected = (target) => {
  return request({
    url: `/v1_0/article/collections/${target}`,
    method: 'DELETE'
  })
}
