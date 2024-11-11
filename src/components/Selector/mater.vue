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
const emit = defineEmits(['materTypeList'])
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
            // 发送数据
            emit('materTypeList', materTypeList.value)
        }
    })
}
getMaterType()
console.log(props.date)
</script>
<template>
    <el-select filterable remote remote-show-suffix :remote-method="getMaterType" placeholder="请选择产品类型">
        <el-option v-for="item in materTypeList" :key="item.id" :label="item.type_name" :value="item.material_id">
            <el-row>
                <el-col class="ellipsis" :span="10">{{ item.type_name }}</el-col>
                <el-col class="ellipsis" :span="4">{{ item.delivery }}</el-col>
                <el-col class="ellipsis" :span="4">{{ item.location }}</el-col>
                <el-col class="ellipsis" :span="6">{{ item.material_id }}</el-col>
            </el-row>
        </el-option>
    </el-select>
</template>