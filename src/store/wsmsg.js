import { defineStore } from 'pinia'
let websocket = null

const heartCheck = {
    timeout: 60000, //60秒
    timeoutObj: null,
    serverTimeoutObj: null,
    reset() {
        clearTimeout(this.timeoutObj)
        clearTimeout(this.serverTimeoutObj)
        return this
    },
    start() {
        let self = this
        this.timeoutObj = setTimeout(() => {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            websocket.send('ping')
            console.log('ping!')
            self.serverTimeoutObj = setTimeout(() => {//如果超过一定时间还没重置，说明后端主动断开了
                websocket.close()//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    }
}

const options = {
    state: () => ({
        lockReconnect: false, // 避免重复连接
        wsmsg: [],
    }),
    actions: {
        addWsmsg(msg) {
            this.wsmsg.push(msg)
            if (this.wsmsg.length > 10) this.wsmsg.shift()
        },
        delWsmsg(msg) {
            let index = array.indexOf(msg);
            if (index !== -1) {
                this.readWsmsg(msg)
                array.splice(index, 1);
            }
        },
        readWsmsg(msg) {
            if (msg.data.id) {
                let msgobj = { "action": "read", "topic": "booked", "message": msg.data.id }
                // 通知服务器已读
                this.send(JSON.stringify(msgobj))
            }
        },
        clearWsmsg() {
            // 遍历删除消息
            for (let i = 0; i < this.wsmsg.length; i++) {
                let msg = this.wsmsg[i]
                this.readWsmsg(msg)
            }

            this.wsmsg = []
        },
        createWebSocket(url) {
            try {
                websocket = new WebSocket(url)
                console.log("websocket 111= ", websocket)
                this.initEventHandle()
            } catch (e) {
                this.reconnect(url)
            }
        },
        initEventHandle() {
            websocket.onclose = () => {
                this.reconnect()
            }
            websocket.onerror = () => {
                this.reconnect()
            }
            websocket.onopen = () => {
                //心跳检测重置
                heartCheck.reset().start()
            }
            websocket.onmessage = (event) => {
                //如果获取到消息，心跳检测重置
                console.log("ws收到消息：", event.data)
                //拿到任何消息都说明当前连接是正常的
                heartCheck.reset().start()
                if (typeof event.data == 'Object')
                    this.addWsmsg(JSON.parse(event.data))
            }
        },
        connect(url) {
            this.createWebSocket(url)
            return websocket
        },
        reconnect(url) {
            if (this.lockReconnect) return
            this.lockReconnect = true
            setTimeout(() => {
                this.createWebSocket(url)
                this.lockReconnect = false
            }, 4000)
        },
        send(msg) {
            console.log("websocket = ", websocket)
            websocket.send(msg)
        },
        close() {
            websocket.close()
        },

    },
}
export const wsmsgStore = defineStore('wsmsg', options);