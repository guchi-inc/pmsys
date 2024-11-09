<script setup>
import { reactive } from 'vue'
import { getDeviceList as getList, newDevice, updateDevice } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import { getDate } from '@/utils'
const searchForm = reactive({
    machine_id: '',
    owner: '',
    link_batch_id: '',
    order_number: '',
    type: '',
    date: getDate(700),
})
const editForm = reactive({
    machine_id: '',
    owner: '',
    link_batch_id: '',
    order_number: '',
    type: '',
})
const editRules = reactive({
    machine_id: [
        { required: true, message: '请输入机器ID', trigger: 'blur' },
    ],
    owner: [
        { required: true, message: '请输入所有者', trigger: 'blur' },
    ],
    link_batch_id: [
        { required: true, message: '请输入批次号', trigger: 'blur' },
    ],
    type: [
        { required: true, message: '请输入类型', trigger: 'blur' },
    ],
    creator: [
        { required: false, message: '请输入创建人', trigger: 'blur' },
    ],
    order_number: [
        { required: false, message: '请输入订单号', trigger: 'blur' },
    ],
})
const reset = () => {
    searchForm.machine_id = ''
    searchForm.owner = ''
    searchForm.link_batch_id = ''
    searchForm.order_number = ''
    searchForm.date = getDate(700)
}
const data = {
    api: getList,
    param: searchForm,
    create: newDevice,
    update: updateDevice
}
const columns = [
    {
        label: '机器ID',
        type: '',
        prop: 'machine_id',
        align: 'center',
        width: ''
    },
    {
        label: '所有者',
        type: '',
        prop: 'owner',
        align: 'center',
        width: ''
    },
    {
        label: '批次号',
        type: '',
        prop: 'link_batch_id',
        align: 'center',
        width: ''
    },
    {
        label: '订单号',
        type: '',
        prop: 'order_number',
        align: 'center',
        width: ''
    },
    {
        label: '类型',
        type: '',
        prop: 'type',
        align: 'center',
        width: ''
    },
    {
        label: '创建人',
        type: '',
        prop: 'creator',
        align: 'center',
        width: ''
    },
    {
        label: '创建时间',
        type: '',
        prop: 'create_time',
        align: 'center',
        width: ''
    },
]

const dateChange = (val) => {
    console.log('dateChange: ', val)
    searchForm.date = val
}
</script>

<template>
    <ListPage :tableData="data" :tableColumns="columns" :editForm="editForm" :editRules="editRules" :hasOperation="true"
        dialogTitle="设备" @reset="reset">
        <template #searchForm>
            <el-form-item label="机器ID" prop="machine_id">
                <el-input v-model="searchForm.machine_id" placeholder="请输入机器ID"></el-input>
            </el-form-item>
            <el-form-item class="ml-5" label="所有者" prop="owner">
                <el-input v-model="searchForm.owner" placeholder="请输入所有者"></el-input>
            </el-form-item>
            <el-form-item class="ml-5" label="批次号" prop="link_batch_id">
                <el-input v-model="searchForm.link_batch_id" placeholder="请输入批次号"></el-input>
            </el-form-item>
            <el-form-item class="ml-5" label="订单号" prop="order_number">
                <el-input v-model="searchForm.order_number" placeholder="请输入订单号"></el-input>
            </el-form-item>
            <el-form-item class="ml-5" label="类型" prop="type">
                <el-input v-model="searchForm.type" placeholder="请输入类型"></el-input>
            </el-form-item>
            <date-picker :value="searchForm.date" @change="dateChange" />
        </template>
        <template #dialogBody>
            <el-form-item label="机器ID" prop="machine_id">
                <el-input v-model="editForm.machine_id" placeholder="请输入机器ID"></el-input>
            </el-form-item>
            <el-form-item label="所有者" prop="owner">
                <el-input v-model="editForm.owner" placeholder="请输入所有者"></el-input>
            </el-form-item>
            <el-form-item label="批次号" prop="link_batch_id">
                <el-input v-model="editForm.link_batch_id" placeholder="请输入批次号"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-input v-model="editForm.type" placeholder="请输入类型"></el-input>
            </el-form-item>
            <!-- <el-form-item label="创建人" prop="creator">
                <el-input v-model="editForm.creator" placeholder="请输入创建人"></el-input>
            </el-form-item> -->

            <el-form-item class="ml-5" label="订单号" prop="order_number">
                <el-input v-model="editForm.order_number" placeholder="请输入订单号"></el-input>
            </el-form-item>
        </template>
    </ListPage>
</template>