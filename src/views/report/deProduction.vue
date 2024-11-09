<script setup>
import { reactive } from 'vue'
import { getOrderListDepartment as getList } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import { getDate } from '@/utils'
const searchForm = reactive({ 
    dep_name: '', 
    date: getDate(700),
})
const reset = () => { 
    searchForm.dep_name = '' 
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
    <!-- 部门任务 -->
    <!-- http://124.71.180.92:19090/user/dep/list -->
    <!-- http://124.71.180.92:28080/order/list/department -->
    <!-- {"username":"","dep_name":"","phonenum":"","machine_id":"","start_at":"2022-12-01 00:00:00","end_at":"2024-01-05 23:59:59","page":1,"page_size":10} -->
    <ListPage :tableData="data" :tableColumns="columns" @reset="reset">
        <template #searchForm> 
            <el-form-item label="部门">
                <el-input v-model="searchForm.dep_name" placeholder="请输入部门"></el-input>
            </el-form-item> 
            <date-picker :value="searchForm.date" @change="dateChange" />
        </template>
    </ListPage>
</template>