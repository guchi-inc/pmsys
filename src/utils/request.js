import axios from 'axios'
import { userStore } from '@/store/user'
import { $error } from '@/utils/message'
// import conf from '@/assets/conf.json'
// console.log("conf=", conf.default_server_config.login_server.base_url)
import { configStore } from '@/store/config'
// 创建axios实例
const service = axios.create({
    // baseURL: configStore().main_server, // api的base_url
    timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    // if (store.getters.token) {
    //     config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    // 去掉零宽空格 
    // config.url = config.url.replace(/%E2%80%8B/g, '')
    // 统一注入token
    const user = userStore()
    if (user.token) {
        config.headers['Authorization'] = 'token ' + user.token
    }
    // TODO 超时退出
    return config
}, error => {
    // Do something with request error
    // console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        const { code, message, data } = response.data
        // 根据返回的code值来做不同的处理（和后端约定）
        if (code === 100000 || data) {
            return response.data
        } else {
            // token超时
            const res = response.data
            if (res && res.code === 401) {
                // TODO 超时退出
                console.log("超时退出1")
                userStore().removeUser()
            }
            // 业务错误
            if (message) {
                const err = new Error(message)
                $error(err)
                return Promise.reject(err)
            }
            // 未知错误
            return Promise.reject(new Error('未知错误'))
        }
    },
    error => {
        // console.log('err' + error) // for debug
        // token超时
        if (error.response && error.response.data && error.response.data.code === 20105) { //401
            // TODO 超时退出
            console.log("超时退出2")
            userStore().removeUser()
            location.reload()
        }
        console.log("error=", error)
        const err = new Error(error.response.data.error || error.message)
        $error(err)
        return Promise.reject(error)
    }
)

// export default service

function get(url, params, baseURL) {
    return service.get(url, {
        baseURL: baseURL,
        params
    })
}

function post(url, data, baseURL) {
    return service.post(url, data, {
        baseURL: baseURL
    })
}

const login_server = {
    get: (url, params) => {
        return get(url, params, configStore().login_server)
    },
    post: (url, data) => {
        return post(url, data, configStore().login_server)
    }
}

const main_server = {
    get: (url, params) => {
        return get(url, params, configStore().main_server)
    },
    post: (url, data) => {
        return post(url, data, configStore().main_server)
    }
}

export {
    login_server,
    main_server
}