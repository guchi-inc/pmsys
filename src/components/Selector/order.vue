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
const emit = defineEmits(['orderList'])
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
            // 发送数据
            emit('orderList', orderList.value)
        }
    })
}
getOrder()
console.log(props.date)
</script>
<template>
    <el-select filterable remote remote-show-suffix :remote-method="getOrder" placeholder="请选择订单号">
        <el-option v-for="item in orderList" :key="item.id" :label="item.order_number" :value="item.order_number">
            <el-row>
                <el-col class="ellipsis" :span="8">{{ item.order_number }}</el-col>
                <el-col class="ellipsis" :span="10">{{ item.name }}</el-col>
                <el-col class="ellipsis" :span="3">{{ item.total }}</el-col>
                <el-col class="ellipsis" :span="3">{{ item.order_type }}</el-col>
            </el-row>
        </el-option>
    </el-select>
</template>