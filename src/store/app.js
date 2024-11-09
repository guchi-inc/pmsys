import { defineStore } from 'pinia'

export const sidebarStore = defineStore('sidebar', {
    state: () => ({
        status: true,
        animation: false,
        device: 'desktop',
        size: 'small' //medium, small, mini
    }),
    actions: {
        toggleSideBar() {
            this.status = !this.status
            this.animation = false
        },
        closeSideBar(animation) {
            this.status = false
            this.animation = animation
        },
        toggleDevice(device) {
            this.device = device
        },
        setSize(size) {
            this.size = size
        }
    },
    // 持久化设置
    persist: {
        enabled: true,	//开启
        storage: sessionStorage,	//修改存储位置
        key: 'sidebar',	//修改存储key值
        paths: ['status', 'size'],	//指定要持久化的字段
    },
})