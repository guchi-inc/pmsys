import { defineStore } from 'pinia';
import axios from 'axios'

export const configStore = defineStore('config', {
    state: () => ({
        login_server: '',
        main_server: '',
        msg_server: '',
        theme: 'light',
        size: 'default',
        remember: '',
        key: '',
        title: '',
        name: '',
        pre_define: {}
    }),
    actions: {
        isDark() {
            console.log('toggleDark', this.theme)
            return this.theme == 'dark'
        },
        toggleSize(size) {
            this.size = size
        },
        toggleDark() {
            if (this.theme == 'dark') {
                this.theme = 'light'
            } else {
                this.theme = 'dark'
            }
            console.log('theme = ', this.theme)
        },
        clearConfig() {
            this.login_server = ''
            this.main_server = ''
            this.msg_server = ''
            // this.key = ''
            this.getConfig()
        },
        getConfig() {
            return new Promise((resolve, reject) => {
                axios.get('/conf.json').then(res => {
                    console.log('config res = ', res.data)
                    const server_config = res.data.default_server_config
                    this.login_server = server_config.login_server.base_url
                    this.main_server = server_config.main_server.base_url
                    this.msg_server = server_config.msg_server.base_url
                    this.key = res.data.key
                    this.title = res.data.project.title
                    this.name = res.data.project.name
                    // this.theme = res.data.theme
                    this.pre_define = res.data.pre_define
                    resolve(res)
                }).catch(err => {
                    console.log('err = ', err)
                    reject(err)
                })
            })
        },
        loadConfig() {
            if (this.login_server == '') {
                this.getConfig()
            }
        }
    },
    persist: true,
})