<script setup>
import { ref } from 'vue'
import { code, getMaterUnitList } from "@/api"
import { getDate, parseTime } from '@/utils'
const materUnitList = ref([])
const props = defineProps({
    date: {
        type: Object,
        default: () => getDate(700)
    }
})
const getMaterUnit = async (param) => {
    const query = { page: 1, page_size: 10, start_at: parseTime(props.date[0], '{y}-{m}-{d} 00:00:00'), end_at: parseTime(props.date[1], '{y}-{m}-{d} 23:59:59') }
    if (param === undefined || param === '') {
        param = { ...query }
    } else {
        param = { basic_unit: param, ...query }
    }
    getMaterUnitList(param).then((res) => {
        if (res.code === code.success) {
            materUnitList.value = res.data
        }
    })
}
getMaterUnit()
console.log(props.date)
</script>
<template>
    <el-select filterable remote remote-show-suffix :remote-method="getMaterUnit" placeholder="请选择产品单位"
        style="width:100%">
        <el-option v-for="item in materUnitList" :key="item.id" :label="item.name" :value="item.name">
            <el-row>
                <el-col class="ellipsis" :span="5">{{ item.basic_unit }}</el-col>
                <el-col class="ellipsis" :span="10">{{ item.name }}</el-col>
                <el-col class="ellipsis" :span="5">{{ item.other_unit }}</el-col>
                <el-col class="ellipsis" :span="4">{{ item.tenant_id }}</el-col>
            </el-row>
        </el-option>
    </el-select>
</template>