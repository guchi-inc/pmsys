import { configStore } from '@/store/config'
const config = configStore()
export const checkFormatter = (field) => {
    console.log('checkFormatter:', field)
    const cnameObj = config.pre_define.fields_cname[field]
    if (cnameObj === undefined) return null;
    return {
        stage: (row) => {
            // stage 现在就是  初始 0， 生产 1，检验 2， 完成 3 几个 
            console.log('stage--->:', row)
            return cnameObj[row.stage]
        }
    }
}
