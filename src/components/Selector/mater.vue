<script setup>
import { ref } from 'vue'
import { code, getMaterTypesList } from "@/api"
import { getDate, parseTime } from '@/utils'
const materTypeList = ref([])
const props = defineProps({
    date: {
        type: Object,
        default: () => getDate(700)
    }
})
const getMaterType = async (param) => {
    const query = { page: 1, page_size: 10, start_at: parseTime(props.date[0], '{y}-{m}-{d} 00:00:00'), end_at: parseTime(props.date[1], '{y}-{m}-{d} 23:59:59') }
    if (param === undefined || param === '') {
        param = { ...query }
    } else {
        param = { type_value: param, ...query }
    }
    getMaterTypesList(param).then((res) => {
        if (res.code === code.success) {
            materTypeList.value = res.data
        }
    })
}
getMaterType()
console.log(props.date)
</script>
<template>
    <el-select filterable remote remote-show-suffix :remote-method="getMaterType" placeholder="请选择产品类型"
        style="width:100%">
        <el-option v-for="item in materTypeList" :key="item.id" :label="item.type_value"
            :value="item.material_id"></el-option>
    </el-select>
</template>