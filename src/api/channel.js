import request from '@/utils/request'
import storage from '@/utils/storage'
/**
 * 获取用户频道列表
 * @returns Promise
 */
export const getMyChannels = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}
/**
 * 获取所有用户频道列表
 * @returns Promise
 */
export const getAllChannels = () => {
  return request({
    url: '/v1_0/channels'
  })
}

export const delMyChannel = (target) => {
  return request({
    url: `/v1_0/user/channels/${target}`,
    method: 'DELETE'
  })
}

export const addMyChannel = (id, seq) => {
  return request({
    url: '/v1_0/user/channels',
    method: ' PATCH',
    data: {
      channels: [{ id, seq }]
    }
  })
}

// 本地存储 存取 我的频道数据
const HEIMA_TOUTIAO_CHANNELS = 'HEIMA_TOUTIAO_CHANNELS'
export const getMyChannelsByLocal = () => storage.get(HEIMA_TOUTIAO_CHANNELS)
export const setMyChannelsToLocal = (channel) =>
  storage.set(HEIMA_TOUTIAO_CHANNELS, channel)
