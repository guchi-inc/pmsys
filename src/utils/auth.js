// import Cookies from 'js-cookie'

const tokenKey = 'user'
export function getToken() {
    const userStr = sessionStorage.getItem(tokenKey)
    if (userStr) {
        const user = JSON.parse(userStr)
        return user.token
    }
    return undefined
}

// export function setToken(token) {
//     return Cookies.set(tokenKey, token)
// }

export function removeToken() {
    return sessionStorage.removeItem(tokenKey)
}