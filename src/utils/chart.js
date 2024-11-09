import { monitor } from '@/api'
import * as echarts from 'echarts'
import { computed, reactive, ref, watch } from 'vue'
import { userStore } from '@/store/user'
import { configStore } from '@/store/config'
import { parseTime } from '@/utils'
const user = userStore()
const conf = configStore()
export const target0 = ref();
export const target1 = ref();
export const target2 = ref();
export const target3 = ref();
export const indexNumberArr = reactive([]);
const itemColor = computed(() => {
    return conf.theme == 'light' ? '#eaeaea' : '#1d1e1f'
});
/**
 * 图表渲染方法 - 0
 */
function renderChart0(array_left) {
    // 生成echarts数据格式
    const graphData = [], linesData = []
    array_left.forEach(el => {
        console.log('el=', el)
        graphData.push(el)
        if (el.row) {
            // 取儿子节点
            const len = el.children.length
            const w = 1000 / len
            const x = (w - 100) / 2
            const y = 1500 - 400 * el.row
            for (let i = 0; i < len; i++) {
                const child1 = el.children[i]
                const xi = Math.round(w * i + x)
                child1.value = [xi, y]
                graphData.push(child1)
                if (xi != 450) {
                    linesData.push({ coords: [[450, 1500], [xi, 1500], child1.value] })
                } else {
                    // 直接连
                    linesData.push({ coords: [[450, 1500], child1.value] })
                }
                if (i != 0) {
                    // 画虚线
                    const value = el.children[i - 1].value
                    linesData.push({ coords: [[value[0], y], [xi, y]], lineStyle: { type: [3, 3] } })
                }
                // 取孙子节点
                const len1 = child1.children.length
                const w1 = w / len1
                const x1 = (w - (len1 == 1 ? 334 : 550)) / 2
                const y1 = y - 500
                for (let j = 0; j < len1; j++) {
                    const child2 = child1.children[j]
                    const xj = Math.round(w1 * j + x1 + xi)
                    child2.value = [xj, y1]
                    child2.symbolSize = [80, 150]
                    graphData.push(child2)
                    // 画实线
                    linesData.push({ coords: [child1.value, child2.value] })
                    if (j != 0) {
                        // 画虚线
                        const value = child1.children[j - 1].value
                        linesData.push({ coords: [[value[0], y1], [xj, y1]], lineStyle: { type: [3, 3] } })
                    }
                    // 取曾孙节点
                    const len2 = child2.children.length
                    const w2 = 100 //w1 / len2
                    const x2 = (w1 - (len2 == 1 ? 110 : 284)) / 2
                    const y2 = y1 - 400
                    for (let k = 0; k < len2; k++) {
                        const child3 = child2.children[k]
                        const xk = Math.round(w2 * k + x2 + xj)
                        child3.value = [xk, y2]
                        graphData.push(child3)
                        // 画实线
                        linesData.push({ coords: [[xj, y1 - 100], child3.value] })
                        if (k != 0) {
                            // 画虚线
                            const value = child2.children[k - 1].value
                            linesData.push({ coords: [[value[0], y2], [xk, y2]], lineStyle: { type: [3, 3] } })
                        }
                        // 取曾曾孙节点
                        /**
                        const len3 = child3.children.length
                        const w3 = w2 / len3
                        const x3 = (w2 - 100) / 2
                        for (let l = 0; l < len3; l++) {
                            const child4 = child3.children[l]
                            const xl = Math.round(w3 * l + x3 + xk)
                            child4.value = [xl, 100]
                            graphData.push(child4)
                            // 画实线
                            linesData.push({ coords: [child3.value, child4.value] })
                        }
                        **/
                    }
                }
            }
        }
    })
    console.log('图表0数据：', graphData)
    const option = {
        title: {
            text: '组织流程图' //'Basic Graph'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        // backgroundColor: '#363637', //"#0B1321",
        xAxis: {
            min: 0,
            max: 1000,
            show: false,
            type: 'value'
        },
        yAxis: {
            min: 0,
            max: 1500,
            show: false,
            type: 'value'
        },
        series: [
            {
                type: 'graph',
                // layout: 'none',
                z: 2000,
                top: 80,
                // roam: true,
                // label: {
                //     show: true
                // },
                // edgeSymbol: ['circle', 'arrow'],
                // edgeSymbolSize: [4, 10],
                // edgeLabel: {  fontSize: 20, },
                symbol: 'rectangle',
                symbolSize: [100, 50],
                // smooth: false,
                coordinateSystem: 'cartesian2d',
                itemStyle: {
                    color: itemColor.value,
                    borderColor: '#fff',
                    textStyle: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    formatter: function (params) {
                        return params.data.description;
                    }
                },
                label: {
                    show: true,
                    // position: 'inside',
                    fontSize: 15,
                    // color: 'black',
                    //fontWeight:  'bolder'
                    formatter: (params) => {
                        // console.log('params = ', params.data.row)
                        if (params.data.row != 3) { return params.data.name }
                        let newName = ''
                        let len = params.data.name.length
                        let strLen = 1 //一行显示几个字
                        let rowNum = Math.ceil(len / strLen)
                        if (len > strLen) {
                            for (let p = 0; p < rowNum; p++) {
                                let tempStr = ''
                                let start = p * strLen
                                let end = start + strLen
                                if (p == rowNum - 1) {
                                    tempStr = params.data.name.substring(start, len)
                                } else {
                                    tempStr = params.data.name.substring(start, end) + '\n'
                                }
                                newName += tempStr
                            }
                        } else {
                            newName = params.data.name
                        }
                        let n = newName
                        if (n.length > 16) {
                            n = n.slice(0, 16) + '...'
                        }
                        // let str = `{name|${n}}`
                        return n
                    },

                },
                data: graphData
            },
            {
                type: 'lines',
                polyline: true,
                coordinateSystem: 'cartesian2d',
                lineStyle: {
                    width: 1,
                    color: '#eaeaea',
                    curveness: 0.3
                },
                effect: {
                    show: true,
                    trailLength: 0.1,
                    symbol: 'arrow',
                    color: 'orange',
                    symbolSize: 8
                },
                tooltip: { show: false },
                data: linesData
            }
        ]
    };

    let wChart = echarts.init(target0.value)
    wChart.setOption(option)

    // 监控主题变化
    watch(() => conf.theme, (val) => {
        const itemStyle = option.series[0].itemStyle
        if (val == 'light') {
            console.log('切换了主题 light', option)
            itemStyle.color = '#eaeaea'
        } else {
            itemStyle.color = '#1d1e1f'
        }
        wChart.setOption(option)
    })
}
/**
 * 图表渲染方法 - 1
 */
function renderChart1(array_left) {
    const options = {
        type: 'category',
        dataset: {
            source: array_left // source是二维数组
        },
        xAxis: {
            type: 'category',
            splitLine: {
                //网格线
                show: false //隐藏或显示
            },
            axisLine: {
                //轴线
                show: false
            },
            boundaryGap: true,
            axisLabel: {
                //标签
                interval: 0, //类目轴标签显示不全
                // color: '#333'
            },
            axisTick: {
                //刻度
                interval: 0, //类目轴刻度显示不全
                alignWithLabel: true, //boundaryGap: true时,刻度线和标签对齐
                lineStyle: {
                    // color: '#999'
                }
            }
        },
        yAxis: {
            // show: false,
            splitLine: {
                //网格线
                lineStyle: {
                    type: 'dashed' //设置网格线类型 dotted：虚线   solid:实线
                },
                show: true //隐藏或显示
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                // color: '#333'
            }
        },
        tooltip: {
            trigger: 'axis'
        }, // 悬浮
        legend: {
            left: 'right',
            textStyle: {
                color: '#aaa' // 设置图例项的颜色
            }
        }, // 图例
        grid: {
            top: '15%',
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },
        series: [
            {
                name: '采购',
                type: 'line',
                dimensions: ['name', 't1_count'],
                smooth: true,
                // itemStyle: { color: '#a90000' }
            },
            {
                name: '销售',
                type: 'line',
                dimensions: ['name', 't2_count'],
                smooth: true,
                // itemStyle: { color: '#fac858' }
            },
            {
                name: '零售',
                type: 'line',
                dimensions: ['name', 't3_count'],
                smooth: true,
                // itemStyle: { color: '#91cc75' }
            }
        ]
    }
    // console.log('target1', target1.value)
    let mChart = echarts.init(target1.value)
    mChart.setOption(options)
}
/**
 * 图表渲染方法 - 2
 */
function renderChart2(array_left) {
    const options = {
        type: 'category',
        dataset: {
            source: array_left // source是二维数组
        },
        xAxis: {
            type: 'category',
            splitLine: {
                //网格线
                show: false //隐藏或显示
            },
            axisLine: {
                //轴线
                show: false
            },
            boundaryGap: true,
            axisLabel: {
                //标签
                interval: 0, //类目轴标签显示不全
                // color: '#333'
            },
            axisTick: {
                //刻度
                interval: 0, //类目轴刻度显示不全
                alignWithLabel: true, //boundaryGap: true时,刻度线和标签对齐
                lineStyle: {
                    // color: '#999'
                }
            }
        },
        yAxis: {
            // show: false,
            splitLine: {
                //网格线
                lineStyle: {
                    type: 'dashed' //设置网格线类型 dotted：虚线   solid:实线
                },
                show: true //隐藏或显示
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                // color: '#333'
            }
        },
        tooltip: {
            trigger: 'axis'
        }, // 悬浮
        legend: {
            left: 'right',
            textStyle: {
                color: '#999' // 设置图例项的颜色
            }
        }, // 图例
        grid: {
            top: '15%',
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },
        series: [
            {
                name: '昨日',
                type: 'bar',
                dimensions: ['name', 'yesterday']
            },
            {
                name: '今日',
                type: 'bar',
                dimensions: ['name', 'today']
            }
        ]
    }
    let mChart = echarts.init(target2.value)
    mChart.setOption(options)
}
/**
 * 图表渲染方法 - 3
 */
function renderChart3(datas) {
    const options = {
        type: 'category',
        tooltip: {}, // 悬浮
        legend: {
            left: 'right',
            textStyle: {
                color: '#999' // 设置图例项的颜色
            }
        }, // 图例
        grid: {
            top: '15%',
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },
        series: datas.map((data, idx) => {
            const left = ['-60%', '0%', '60%']
            return {
                name: data[0].seriesName,
                type: 'pie',
                radius: '80%',
                top: 'center',
                left: left[idx],
                data
            }
        })
    }
    let mChart = echarts.init(target3.value)
    mChart.setOption(options)
}
// 资源大屏回调
function resource(err, data1) {
    if (!err) {
        const {
            // code,
            data,
            message
        } = data1 || {
            data: [],
            message: ''
        }
        const rangeText = {
            0: '今日',
            1: '昨日',
            30: '本月累计',
            365: '今年累计'
        }
        const typeText = {
            1: '采购',
            2: '销售',
            3: '零售'
        }
        const description = '统计title的总金额'
        data.forEach((item) => {
            item.title = rangeText[item.range] + typeText[item.type] // 设置title
            item.description = description.replace('title', item.title) // 设置 description
            item.rangeText = rangeText[item.range]
            item.typeText = typeText[item.type]
            item.icon = 'el-icon-info'
        })

        indexNumberArr.splice(0, indexNumberArr.length);
        for (let i = 0; i < data.length; i += 6) {
            indexNumberArr.push(data.slice(i, i + 6))
        }
        // this.indexNumberArr = indexNumberArr // 第一行 第二行
        console.log('indexNumberArr', indexNumberArr)
        const filterDataByType = (ttype) => {
            return data.filter((i, ind) => {
                if (i.type === ttype) {
                    i.index_indexNumberArr = ind
                    return i
                }
            })
        } // 根据type筛选数据
        const dataType1 = filterDataByType(1) // 采购
        const dataType2 = filterDataByType(2) // 销售
        const dataType3 = filterDataByType(3) // 零售
        const chartLineData = [
            {
                name: '昨天',
                t1_count: dataType1[1].count,
                t2_count: dataType2[1].count,
                t3_count: dataType3[1].count
            },
            {
                name: '今天',
                t1_count: dataType1[0].count,
                t2_count: dataType2[0].count,
                t3_count: dataType3[0].count
            },
            {
                name: '最近一月',
                t1_count: dataType1[2].count,
                t2_count: dataType2[2].count,
                t3_count: dataType3[2].count
            }
            // {
            //   name: '最近一年',
            //   t1_count: dataType1[3].count,
            //   t2_count: dataType2[3].count,
            //   t3_count: dataType3[3].count
            // }
        ]
        renderChart1(chartLineData) // 采购统计
        const chartBarData = [
            {
                name: '采购',
                yesterday: dataType1[1].count,
                today: dataType1[0].count
            },
            {
                name: '销售',
                yesterday: dataType2[1].count,
                today: dataType2[0].count
            },
            {
                name: '零售',
                yesterday: dataType3[1].count,
                today: dataType3[0].count
            }
        ]
        renderChart2(chartBarData) // 销售统计
        const chartPieData = [
            [
                {
                    name: '近一月',
                    value: dataType1[2].count,
                    seriesName: '采购'
                },
                { name: '其他月', value: dataType1[3].count - dataType1[2].count }
            ],
            [
                {
                    name: '近一月',
                    value: dataType2[2].count,
                    seriesName: '销售'
                },
                { name: '其他月', value: dataType2[3].count - dataType2[2].count }
            ],
            [
                {
                    name: '近一月',
                    value: dataType3[2].count,
                    seriesName: '零售'
                },
                { name: '其他月', value: dataType3[3].count - dataType3[2].count }
            ]
        ]
        renderChart3(chartPieData) // 零售统计
    }
}
// 首页流程回调
function index(err, data1) {
    if (!err) {
        console.log('首页流程1：', data1)
        user.getPower().then(res => {
            console.log('首页流程2：', res)
            const { code, data } = res
            if (code == 100000) {
                console.log('res.data == ', data)
                // 对data进行处理
                let darr = []
                for (let i = 0; i < data.length; i++) {
                    const dtmp = {}
                    let item = data[i]
                    if (item.level == '0') {
                        dtmp.name = item.zh
                        dtmp.value = [450, 0]
                        dtmp.symbolSize = [200, 50]
                        dtmp.row = 0
                        dtmp.description = item.description
                        darr.push(dtmp)
                    } else if (item.level == '00') {
                        dtmp.name = item.zh
                        dtmp.value = [450, 1500]
                        dtmp.row = 1
                        dtmp.description = item.description
                        // 寻找子节点
                        data.forEach((item1) => {
                            if (item1.level !== '00' && item1.level.length == 2) {
                                const child1 = []
                                dtmp.children = dtmp.children || []
                                dtmp.children.push({
                                    name: item1.zh,
                                    row: 2,
                                    description: item1.description,
                                    children: child1
                                })
                                // 寻找孙子节点
                                data.forEach((item2) => {
                                    if (item2.level.substring(0, 2) == item1.level && item2.level.length == 3) {
                                        const child2 = []
                                        child1.push({
                                            name: item2.zh,
                                            row: 3,
                                            description: item2.description,
                                            children: child2
                                        })
                                        // 寻找曾孙节点
                                        data.forEach((item3) => {
                                            if (item3.level.substring(0, 3) == item2.level && item3.level.length == 4) {
                                                const child3 = []
                                                dtmp.children[dtmp.children.length - 1].children[dtmp.children[dtmp.children.length - 1].children.length - 1].children.push({
                                                    name: item3.zh,
                                                    row: 4,
                                                    description: item3.description,
                                                    children: child3
                                                })
                                                // 寻找曾曾孙节点
                                                data.forEach((item4) => {
                                                    if (item4.level.substring(0, 4) == item3.level && item4.level.length == 5) {
                                                        child3.push({
                                                            name: item4.zh,
                                                            row: 5,
                                                            description: item4.description,
                                                            // children: []
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                        darr.push(dtmp)
                        console.log('根节点， 退出。。。')
                        break
                    }
                }
                renderChart0(darr)
            }
        }).catch(err => {
            console.log('err', err)
        })
    }
}
export function chart_monitor(isMonitor) {
    const params = {
        page: 1,
        page_size: 10,
        date: parseTime(new Date(), '{y}-{m}-{d}')
    }
    const callback = (err, data) => {
        if (isMonitor) {
            resource(err, data)
        } else {
            index(err, data)
        }
    }
    monitor(params).then(res => {
        console.log('res', res)
        const { monitor } = res
        console.log('res.monitor == ', monitor)
        if (monitor && monitor == 1) {
            user.setMonitor(1)
            // return callback(null, monitor)
        }
        callback(null, res)
    }).catch(err => {
        console.log('err', err)
        return callback(err || 'No data by params')
    })
}