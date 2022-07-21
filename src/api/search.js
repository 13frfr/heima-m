import request from '@/utils/request'
import storage from '@/utils/storage'

export const SearchSuggestion = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}
export const SearchResult = (page, perpage, q) => {
  return request({
    url: '/v1_0/search',
    params: {
      page,
      per_page: perpage,
      q
    }
  })
}
// 本地存储
const HEIMA_SEARCH_RESULT = 'HEIMA_SEARCH_RESULT'
export const getMyResult = () => storage.get(HEIMA_SEARCH_RESULT)
export const setMyResult = (channel) =>
  storage.set(HEIMA_SEARCH_RESULT, channel)
export const delMyResult = () => storage.remove(HEIMA_SEARCH_RESULT)
