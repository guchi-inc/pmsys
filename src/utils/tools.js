function deepClone(obj) {
    if (typeof obj !== 'object' || obj == null) {
        return obj
    }

    let result
    if (obj instanceof Array) {
        result = []
    } else {
        result = {}
    }

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = deepClone(obj[key])
        }
    }
    return result
}
function isOkArray(obj) {
    return obj && Array.isArray(obj) && obj.length !== 0
}
function isOkArray1(obj) {
    return obj && Array.isArray(obj) && obj.length === 1
}
function arrayLengthBetterThan1(obj) {
    return isOkArray(obj) && obj.length > 1
}

function eachOptionsFilter(value, options) {
    let temp = {}
    let result = ''
    if (options.length !== 0) {
        temp = options.find((item) => item.id === value)
    }
    result = temp ? temp.name : '--'
    return result
}

function repair(i) {
    if (i >= 0 && i <= 9) {
        return '0' + i
    } else {
        return i
    }
}

function getNowToBe() {
    // 【格式：2023-1-16 9:01:01】
    // const date = new Date()
    // const date_locale = date.toLocaleString().split(' ')
    // const day = date_locale[0].split('/').join('-')
    // let time
    // if (date_locale[1].indexOf('上午') > -1) {
    //   time = date_locale[1].replace('上午', '')
    // } else if (date_locale[1].indexOf('下午') > -1) {
    //   time = date_locale[1].replace('下午', '')
    //   let h = time.split(':')[0]
    //   h = Number(h) + 12
    //   time = h + ':' + time.split(':')[1] + ':' + time.split(':')[2]
    // }
    // let nowToBe = day + ' ' + time
    const date = new Date()
    const yyyy = date.getFullYear()
    const MM = repair(date.getMonth() + 1)
    const dd = repair(date.getDate()) // 日
    // const week = date.getDay() // 星期
    const HH = repair(date.getHours())
    const min = repair(date.getMinutes())
    const ss = repair(date.getSeconds())
    const nowToBe = yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + min + ':' + ss
    return nowToBe
}

function getPast7DaysStartAndEnd() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    const startDateArr = start.toLocaleDateString().split('/')
    startDateArr[1] =
        startDateArr[1] < 10 ? '0' + startDateArr[1] : startDateArr[1]
    const startDate = startDateArr.join('-') + ' 00:00:00'
    const endDateArr = end.toLocaleDateString().split('/')
    endDateArr[1] = endDateArr[1] < 10 ? '0' + endDateArr[1] : endDateArr[1]
    const endDate = endDateArr.join('-') + ' 23:59:59'
    return [startDate, endDate]
}

export {
    deepClone,
    isOkArray,
    isOkArray1,
    arrayLengthBetterThan1,
    eachOptionsFilter,
    getNowToBe,
    getPast7DaysStartAndEnd
}
