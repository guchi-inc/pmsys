import * as XLSX from 'xlsx'
import fileSaver from 'file-saver'

const s2ab = s => {
    var buf;
    if (typeof ArrayBuffer !== 'undefined') {
        buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
    } else {
        buf = new Array(s.length);
        for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}

const xlsx = (data, fields, fileName) => {
    const fields_en = fields.map(item => item.prop)
    const fields_cn = fields.map(item => item.label)
    console.log('fields-->', fields_en)

    const json = [];
    data.forEach(item => {
        let obj = {}
        fields_en.forEach((item2, index2) => {
            obj[fields_cn[index2]] = item[item2]
        })
        json.push(obj)
    })
    let sheetName = fileName //excel的文件名称
    let wb = XLSX.utils.book_new() //工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。

    let ws = XLSX.utils.json_to_sheet(json, { header: Object.values(fields_cn) }) //将JS对象数组转换为工作表。
    wb.SheetNames.push(sheetName)
    wb.Sheets[sheetName] = ws
    const defaultCellStyle = { font: { name: 'Verdana', sz: 13, color: 'FF00FF88' }, fill: { fgColor: { rgb: 'FFFFAA00' } } };//设置表格的样式
    let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false } //写入的样式
    let wbout = XLSX.write(wb, wopts)
    let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    fileSaver.saveAs(blob, fileName + '.xlsx')
}

export default xlsx
