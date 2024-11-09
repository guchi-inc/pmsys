import { defineStore } from 'pinia'
import { signin, logout as apiLogout, getMenuList, monitor, power } from '@/api'
// import layout from '@/views/layout/index.vue'
import XXTEA from '@/utils/xxtea.js'
import { configStore } from './config'
const options = {
    state: () => ({
        token: '',
        name: 'huamain',
        menu: {},
        router: [],
        monitor: 0,
    }),
    actions: {
        setUser(res) {
            this.name = res.login_name
            this.token = res.data
        },
        removeUser() {
            // this.name = undefined
            // this.token = undefined
            // sessionStorage.clear()
            console.log('options.persist.key==', options.persist.key)
            options.persist.storage.removeItem(options.persist.key)
        },
        setRouter() {
            // console.log("menu = ", Object.keys(this.menu))

            for (let item in this.menu) {
                let parent = {}, children = []
                // console.log('item = ', this.menu[item])
                const main = this.menu[item].main
                // console.log('main = ', main)
                const isHome = main.menu_name == 'home'
                if (isHome) {
                    children.push({
                        path: '/' + main.menu_name,
                        name: 'Dashboard',
                        meta: { title: main.description, affix: true },
                        component: () => import(`@/views/${main.menu_name}/index.vue`)
                    })
                    //处理资源大屏
                    children.push({
                        path: '/resource',
                        name: 'Resource',
                        meta: { title: '系统结构', affix: false },
                        component: () => import(`@/views/${main.menu_name}/monitor.vue`)
                    })
                    parent = {
                        path: '/',
                        meta: { title: '' },
                        redirect: '/home',
                    }
                } else if (this.menu[item].sub) {
                    this.menu[item].sub.forEach(subItem => {
                        const menu_arr = subItem.menu_name.split('_')
                        children.push({
                            path: '/' + subItem.menu_name,
                            name: subItem.menu_number,
                            meta: { title: subItem.description },
                            component: () => import(`@/views/${menu_arr[0]}/${menu_arr[1]}.vue`)
                        })
                        // console.log("subItem = ", subItem)
                    })
                    parent = {
                        path: '/' + main.menu_name,
                        meta: { title: main.description },
                        redirect: 'noredirect',
                    }
                }
                console.log('children = ', children)
                // const redirect = isHome ? '/home' : '/' + this.menu[item].sub[0].menu_name

                parent.name = main.menu_number
                parent.component = () => import('@/views/layout/index.vue') //shallowRef(layout)
                parent.children = children

                // console.log('parent = ', parent)
                this.router.push(parent)
            }
            //处理资源大屏
            // this.router.push({
            //     path: '/resource',
            //     meta: { title: '资源大屏' },
            //     //redirect: 'noredirect',
            //     component: () => import('/src/views/home/monitor.vue')
            // });
            console.log("router = ", this.router, this.monitor)
        },
        setMonitor(val) {
            this.monitor = val
        },
        getMenu() {
            return new Promise((resolve, reject) => {
                getMenuList().then(res => {
                    if (res.data && res.data.length > 0) {
                        res.data.forEach(item => {
                            // console.log("item = ", item)
                            if (item.leader_id == '') {
                                this.menu[item.menu_number] = { main: item }
                            } else {
                                this.menu[item.leader_id].sub = this.menu[item.leader_id].sub || []
                                this.menu[item.leader_id].sub.push(item)
                            }
                        });
                        // this.setRouter()
                        resolve(res)
                    } else {
                        const err = { message: "menu数据为空，请联系管理员！" }
                        reject(err)
                        this.logout()
                    }
                }).catch(err => {
                    reject(err)
                    // $err-or(err)
                    this.logout()
                })
            })
        },
        getPower() {
            return new Promise((resolve, reject) => {
                power().then(res => {
                    this.monitor = res.data
                    resolve(res)
                }).catch(err => {
                    reject(err)
                    this.logout()
                })
            })
        },
        login(data) {
            const dataStr = JSON.stringify(data)
            console.log('加密前的 Login 数据', dataStr)
            return new Promise((resolve, reject) => {
                const confStore = configStore()
                // TODO Data加密
                const encrypt_data = XXTEA.encryptToBase64(dataStr, confStore.key) //abcdef
                console.log('加密后的 Login 数据', encrypt_data)
                // const encrypt_data =
                // 'sl/Q+ztn0x80BMB1R9Ky+mcPqmC16FyI7se8ltap9adlYD3dA0BqICbQ8vWJoOLzhs1fjQ==' // 加密后的数据
                signin(encrypt_data).then(res => {
                    console.log('加密后的 Login 返回', res)
                    // 记住密码
                    if (data.remember) {
                        confStore.remember = encrypt_data;
                    } else {
                        confStore.remember = '';
                    }
                    // 设置token
                    this.setUser(res)
                    this.getMenu().then(() => {
                        resolve(res);
                    }).catch(err => {
                        console.log('getMenu 错误', err)
                        reject(err);
                    })
                }).catch(err => {
                    console.log('加密后的 Login 错误', err)
                    reject(err);
                });
            });
        },
        clear() {
            // 清除缓存
            return new Promise((resolve, reject) => {
                configStore().clearConfig()
                resolve()
            })
        },
        logout() {
            return new Promise((resolve, reject) => {
                console.log("persist = ", options.persist)
                apiLogout().then(res => {
                    this.removeUser();
                    resolve(res)
                }).catch(err => {
                    reject(err)
                }).finally(() => {
                    this.removeUser();
                    // 关闭ws
                    // setUserInfo(emptyUser);
                    resolve()
                })
            })
        }
    },
    // 持久化设置
    persist: {
        enabled: true,	//开启
        storage: sessionStorage,	//修改存储位置
        key: 'user',	//设置存储的key,在这里是存在sessionStorage时的键
        paths: ['token', 'name', 'menu'],	//指定要持久化的字段
        // ['menuList', 'hasRouter', `roles`, 'roleIds', 'tabsList', 'tabsActive', 'menuCodes'],//指定要持久化的字段，menuRouter不需要缓存。因为每次路由跳转我们都可以重新获取
    },
}
export const userStore = defineStore('user', options);