<script setup>
import { reactive } from 'vue'
import { getOrderList as getList } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import { getDate } from '@/utils'
const searchForm = reactive({
    order_number: '',
    pre_batch: '',
    machine_id: '', 
    login_name: '', 
    date: getDate(700),
})
const reset = () => {
    searchForm.order_number = ''
    searchForm.pre_batch = ''
    searchForm.machine_id = '' 
    searchForm.login_name = '' 
    searchForm.date = getDate(700)
}
const data = {
    api: getList,
    param: searchForm
}
const columns = []
const dateChange = (val) => {
    console.log('dateChange: ', val)
    searchForm.date = val
}
</script>
<template>
    <!-- 产量统计 -->
    <!-- http://124.71.180.92:28080/order/list -->
    <!-- {"order_number":"","pre_batch":"","machine_id":"","username":"","login_name":"","phonenum":"","position":"","start_at":"2023-11-01 00:00:00","end_at":"2023-12-30 23:59:59","page":1,"page_size":10} -->
    <ListPage :tableData="data" :tableColumns="columns" @reset="reset">
        <template #searchForm>
            <el-form-item label="订单号">
                <el-input v-model="searchForm.order_number" placeholder="请输入订单号"></el-input>
            </el-form-item>
            <el-form-item label="批次号">
                <el-input v-model="searchForm.pre_batch" placeholder="请输入批次号"></el-input>
            </el-form-item>
            <el-form-item label="机器ID">
                <el-input v-model="searchForm.machine_id" placeholder="请输入机器ID"></el-input>
            </el-form-item> 
            <el-form-item label="登录名">
                <el-input v-model="searchForm.login_name" placeholder="请输入登录名"></el-input>
            </el-form-item>  
            <date-picker :value="searchForm.date" @change="dateChange" />
        </template>
    </ListPage>
</template>