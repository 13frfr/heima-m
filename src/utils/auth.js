import storage from './storage'
const TOKEN_KEY = 'HEIMA_TOUTIAO_TOKEN'
export const setToken = (token) => storage.set(TOKEN_KEY, token)
export const getTkoen = () => storage.get(TOKEN_KEY) || {}
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)
