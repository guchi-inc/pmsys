<script setup>
import { reactive } from 'vue'
import { getFlawList as getList, NodeFlawEdit } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import { getDate } from '@/utils'
import { useRoute } from 'vue-router'
const route = useRoute()
console.log('route:=====> ', route.query.batch_id)
const searchForm = reactive({
    order_number: '',
    link_batch_id: route.query.batch_id,
    flaw_name: '',
    flaw_types: '',
    staff_id: '',
    creator:'',
    date: getDate(700),
})
const editForm = reactive({
    id: 0,
    flaw_name: '', 
    flaw_number: '',
    flaw_level: '',
    flaw_score: '2',
    flaw_types: '1',
})
const editRules = {
    flaw_name: [
        { required: true, message: '请输入标记名', trigger: 'blur' }
    ],
    flaw_types: [
        { required: true, message: '请输入标记类型', trigger: 'blur' }
    ],
    flaw_score: [
        { required: true, message: '请输入标记扣分数', trigger: 'blur' }
    ], 
}
const reset = () => {
    searchForm.order_number = ''
    searchForm.link_batch_id = route.query.batch_id
    searchForm.flaw_types = ''
    searchForm.flaw_name = ''
    searchForm.staff_id = ''
    searchForm.creator = ''
    searchForm.date = getDate(700)
}
const data = {
    api: getList,
    param: searchForm,
    update: NodeFlawEdit,
}
const columns = []
const dateChange = (val) => {
    console.log('dateChange: ', val)
    searchForm.date = val
}
</script>
<template>
    <ListPage :tableData="data" :tableColumns="columns" dialogTitle="标记" dialogWidth="40%" :editForm="editForm"
        :editRules="editRules" :hideAddOnly="true" @reset="reset" statusType="gc_order_assign">
        <template #searchForm>
            <el-form-item label="订单号">
                <el-input v-model="searchForm.order_number" placeholder="请输入订单号"></el-input>
            </el-form-item>
            <el-form-item label="批次号">
                <el-input v-model="searchForm.link_batch_id" placeholder="请输入批次号"></el-input>
            </el-form-item>
            <el-form-item label="标记类型">
                <el-input v-model="searchForm.flaw_types" placeholder="请输入标记类型"></el-input>
            </el-form-item>
            <el-form-item label="标记名">
                <el-input v-model="searchForm.flaw_name" placeholder="请输入标记名"></el-input>
            </el-form-item>
            <el-form-item label="检验姓名">
                <el-input v-model="searchForm.creator" placeholder="请输入检验姓名"></el-input>
            </el-form-item>
            <el-form-item label="车工姓名">
                <el-input v-model="searchForm.staff_id" placeholder="请输入生产工"></el-input>
            </el-form-item>
            <date-picker :value="searchForm.date" @change="dateChange" />
        </template>
        <template #dialogBody>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="标记名">
                        <el-input v-model="editForm.flaw_name" placeholder="请输入标记名"></el-input>
                    </el-form-item> 
                    <el-form-item label="标记类型">
                        <el-input v-model="editForm.flaw_types" placeholder="请输入标记类型"></el-input>
                    </el-form-item>
                    <el-form-item label="标记扣分">
                        <el-input v-model="editForm.flaw_score" placeholder="请输入标记扣分"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">

                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                </el-col>
            </el-row>
        </template>
    </ListPage>
</template>