/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return ''
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'undefined' || time === null || time === 'null') {
    return ''
  } else if (typeof time === 'object') {
    date = time
    if (date.$d) { date = date.$d }
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (time === null) return '----'

  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function formatTimeFromMillsecond(time) {
  if (time === null) return '无'
  // time = time * 1000
  const d = new Date(time)
  return (
    d.getFullYear() + '年' +
    (d.getMonth() + 1) +
    '月' +
    d.getDate() +
    '日' +
    d.getHours() +
    '时' +
    d.getMinutes() +
    '分'
  )
}
export function formatTimeFromSecond(time) {
  time = time * 1000
  const d = new Date(time)
  return (
    d.getFullYear() + '年' +
    (d.getMonth() + 1) +
    '月' +
    d.getDate() +
    '日' +
    d.getHours() +
    '时' +
    d.getMinutes() +
    '分'
  )
}

export function formatDuring(millisecond) {
  let ret = ''
  var days = parseInt(millisecond / (1000 * 60 * 60 * 24))
  if (days > 0) {
    ret += days + ' 天 '
  }
  var hours = parseInt((millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (hours > 0) {
    ret += hours + ' 小时 '
  }
  var minutes = parseInt((millisecond % (1000 * 60 * 60)) / (1000 * 60))
  if (minutes > 0) {
    ret += minutes + ' 分钟 '
  }
  var seconds = (millisecond % (1000 * 60)) / 1000
  if (seconds > 0) {
    ret += seconds + ' 秒 '
  }
  return ret
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url === null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function getDate(days) {
  const start = new Date()
  const end = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
  return [parseTime(start, '{y}-{m}-{d}'), parseTime(end, '{y}-{m}-{d}')]
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function jsonClone(data) {
  return JSON.parse(JSON.stringify(data))
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// 替换邮箱字符
export function regEmail(email) {
  if (String(email).indexOf('@') > 0) {
    const str = email.split('@')
    let _s = ''
    if (str[0].length > 3) {
      for (var i = 0; i < str[0].length - 3; i++) {
        _s += '*'
      }
    }
    var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
  }
  return new_email
}

// 替换手机字符
export function regMobile(mobile) {
  if (mobile.length > 7) {
    var new_mobile = mobile.substr(0, 3) + '****' + mobile.substr(7)
  }
  return new_mobile
}

// 下载文件
export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const fileName = parseTime(new Date()) + '-' + name + '.' + suffix
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function RandomNumber() {
  var min = 5; var max = 36
  var randomStr = ''
  var range = (max ? Math.round(Math.random() * (max - min)) + min : min)
  var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  for (var i = 0; i < range; i++) {
    var index = Math.round(Math.random() * (arr.length - 1))
    randomStr += arr[index]
  }
  return randomStr
}

export function ZeroMongoID() {
  return '000000000000000000000000'
}

export function Rand(under, over) {
  switch (arguments.length) {
    case 1: return parseInt(Math.random() * under + 1)
    case 2: return parseInt(Math.random() * (over - under + 1) + under)
    default: return 0
  }
}

export function Now() {
  return (new Date()).getTime()
}

export function Page(alldata, page, size, sort) {
  const begin = (page - 1) * size
  const end = begin + size
  alldata = SortData(alldata, sort)
  return alldata.slice(begin, end)
}

export function SortData(data, sort) {
  const datas = data instanceof Array ? data : (() => {
    const ret = []
    for (const i in data) {
      ret.push(data[i])
    }
    return ret
  })()
  datas.sort((a, b) => {
    const getCompare = (a1, a2) => {
      if (a1 === a2) {
        return 0
      }
      if (a1 > a2) {
        return 1
      } else {
        return -1
      }
    }

    for (var i in sort) {
      const arr = sort[i].split(',')
      if (arr.length === 2 && a[arr[0]] && b[arr[0]]) {
        let s = 0
        if (arr[1] === 'desc') {
          s = getCompare(a[arr[0]], b[arr[0]])
        } else {
          s = getCompare(b[arr[0]], a[arr[0]])
        }
        if (s !== 0) {
          return s
        }
      }
    }
    return 0
  })
  return datas
}

export function ToPercent(a, b) {
  return (parseFloat(a / b) * 100).toFixed(2)
}

export function GetKey(o, v) {
  return Object.keys(o)[Object.values(o).indexOf(v)]
}

export function GetKeysByBitdata(bit, map) {
  const ret = []
  for (var i in map) {
    if (bit & 1 << (map[i] - 1)) {
      ret.push(i)
    }
  }
  return ret
}

export function showDateTime(t) {
  return formatDateTime(new Date(t))
}

export function formatDateTime(t, fmt = 'yyyy-MM-dd hh:mm:ss') { // author: meizz
  t = new Date(t)
  var o = {
    'M+': t.getMonth() + 1, // 月份
    'd+': t.getDate(), // 日
    'h+': t.getHours(), // 小时
    'm+': t.getMinutes(), // 分
    's+': t.getSeconds(), // 秒
    'q+': Math.floor((t.getMonth() + 3) / 3), // 季度
    'S': t.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (t.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substring(('' + o[k]).length))) }
  return fmt
}

export const isNull = (value) => {
  const va = JSON.stringify(value)
  switch (typeof (value)) {
    case 'object':
      return va === '{}' || va === '[]' || va === 'null'
    default:
      return !value
  }
}

export const buildTree = (allData, propKeys) => {
  function level(pid) {
    const ret = [];
    (allData || []).forEach((data) => {
      const datapid = data[propKeys.pid]
      if ((pid === null && (datapid === null || datapid === ZeroMongoID())) || pid === datapid) {
        const subs = level(data[propKeys.id])
        if (subs.length > 0) {
          data[propKeys.children] = subs
        }
        ret.push(data)
      }
    })
    return ret
  }

  const ret = level(null)
  return ret
}

export const dayTime = (t) => {
  t = new Date(t)
  const h = parseInt(formatDateTime(t, 'hh'))
  if (h > 0 && h <= 6) {
    return '凌晨'
  } else if (h > 6 && h <= 8) {
    return '早上'
  } else if (h > 8 && h <= 11) {
    return '上午'
  } else if (h === 12) {
    return '中午'
  } else if (h > 12 && h <= 18) {
    return '下午'
  } else {
    return '晚上'
  }
}

export const isSameDay = (t, t1) => {
  return formatDateTime(t, 'yyyy-MM-dd') === formatDateTime(t1, 'yyyy-MM-dd')
}

export const isSameMonth = (t, t1) => {
  return formatDateTime(t, 'yyyy-MM') === formatDateTime(t1, 'yyyy-MM')
}

export const isSameYear = (t, t1) => {
  return formatDateTime(t, 'yyyy') === formatDateTime(t1, 'yyyy')
}

export const showTime = (t) => {
  if (isNull(t)) {
    return '-'
  }
  t = new Date(t)

  const time = t.getTime()
  if (time < 0 || isNaN(time)) {
    return '-'
  }

  const day = 1e3 * 60 * 60 * 24
  if (isSameDay(t, new Date())) {
    return formatDateTime(t, 'hh:mm')
  } else if (isSameDay(t, new Date(new Date().getTime() - day))) {
    return '昨天 ' + formatDateTime(t, 'hh:mm')
  } else if (isSameYear(t, new Date())) {
    return formatDateTime(t, 'MM月dd日') + ' ' + dayTime(t) + formatDateTime(t, 'hh:mm')
  } else {
    return formatDateTime(t, 'yyyy年MM月dd日 hh:mm')
  }
}

export function isZeroDate(d) {
  // console.log(formatDateTime(new Date(d), 'yyyy-MM-dd'));
  return formatDateTime(new Date(d), 'yyyy-MM-dd') === '1-01-01'
}

export const equal = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function isEqual(a, b, visited = new Set()) {
  if (a === b) {
    return true // 如果两个变量严格相等，返回 true
  }

  if (typeof a !== typeof b) {
    return false // 如果两个变量类型不同，返回 false
  }

  if (typeof a === 'object') {
    if (visited.has(a) || visited.has(b)) {
      return true // 避免无限递归的情况
    }

    visited.add(a)
    visited.add(b)

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        return false // 如果两个数组长度不同，返回 false
      }

      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i], visited)) {
          return false // 递归比较数组元素
        }
      }

      return true
    } else {
      const keysA = Object.keys(a)
      const keysB = Object.keys(b)

      if (keysA.length !== keysB.length) {
        return false // 如果两个对象属性数量不同，返回 false
      }

      for (const key of keysA) {
        if (!keysB.includes(key) || !isEqual(a[key], b[key], visited)) {
          return false // 递归比较对象属性值
        }
      }

      return true
    }
  }

  return false // 其它情况返回 false
}

// 获取对象或数组的长度
export function Count(obj) {
  let count = 0
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      count++
    }
  }
  return count
}
