<script setup>
import { ref } from 'vue'
import { code, getSupplierList } from "@/api"
import { getDate, parseTime } from '@/utils'
const supplierList = ref([])
const props = defineProps({
    date: {
        type: Object,
        default: () => getDate(700)
    }
})
const getSupplier = async (param) => {
    const query = { page: 1, page_size: 10, start_at: parseTime(props.date[0], '{y}-{m}-{d} 00:00:00'), end_at: parseTime(props.date[1], '{y}-{m}-{d} 23:59:59') }
    if (param === undefined || param === '') {
        param = { ...query }
    } else {
        param = { supplier: param, ...query }
    }
    getSupplierList(param).then((res) => {
        if (res.code === code.success) {
            supplierList.value = res.data
        }
    })
}
getSupplier()
console.log(props.date)
</script>
<template>
    <el-select filterable remote remote-show-suffix :remote-method="getSupplier" placeholder="请选择供应商">
        <el-option v-for="item in supplierList" :key="item.id" :label="item.supplier" :value="item.tenant_id">
            <el-row>
                <el-col class="ellipsis" :span="8">{{ item.supplier }}</el-col>
                <el-col class="ellipsis" :span="4">{{ item.contacts }}</el-col>
                <el-col class="ellipsis" :span="6">{{ item.address }}</el-col>
                <el-col class="ellipsis" :span="4">{{ item.type }}</el-col>
                <el-col class="ellipsis" :span="2">{{ item.tenant_id }}</el-col>
            </el-row>
        </el-option>
    </el-select>
</template>