<script setup>
import { ref } from 'vue'
import { code, getOrderAll } from "@/api"
import { getDate, parseTime } from '@/utils'
const orderList = ref([])
const props = defineProps({
    date: {
        type: Object,
        default: () => getDate(700)
    }
})
const getOrder = async (param) => {
    const query = { page: 1, page_size: 10, start_at: parseTime(props.date[0], '{y}-{m}-{d} 00:00:00'), end_at: parseTime(props.date[1], '{y}-{m}-{d} 23:59:59') }
    if (param === undefined || param === '') {
        param = { ...query }
    } else {
        param = { order_number: param, ...query }
    }
    getOrderAll(param).then((res) => {
        if (res.code === code.success) {
            orderList.value = res.data
        }
    })
}
getOrder()
console.log(props.date)
</script>
<template>
    <el-select filterable allow-create remote remote-show-suffix :remote-method="getOrder" placeholder="请选择订单号">
        <el-option v-for="item in orderList" :key="item.id" :label="item.order_number"
            :value="item.order_number"></el-option>
    </el-select>
</template>