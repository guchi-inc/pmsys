<script setup>
import { reactive, ref } from 'vue'
import { getOrderBatchs as getList, NewOrderBatch, UpdateOrderBatch } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import OrderSelector from '@/components/Selector/order.vue'
import MaterSelector from '@/components/Selector/mater.vue'
import StageSelector from '@/components/Selector/stage.vue'
import UserSelector from '@/components/Selector/user.vue'
import { getDate } from '@/utils'
import { useRouter } from 'vue-router'
const router = useRouter()
const searchForm = reactive({
    order_number: '',
    batch_id: '',
    type_name: '',
    name: '',
    date: getDate(700),
})
const editForm = reactive({
    id: 0,
    link_order_number: '',
    order_type: '',
    name: '',
    total: '',
    order_type: '',
    express_name: '',
    stage: '0'
})
const editRules = {
    link_order_number: [
        { required: true, message: '请选择订单号', trigger: 'blur' }
    ],
    order_type: [
        { required: true, message: '请输入订单类型', trigger: 'blur' }
    ],
    tenant_id: [
        { required: true, message: '请输入商户', trigger: 'blur' }
    ],
    length: [
        { required: true, message: '请输入总数', trigger: 'blur' }
    ],
}
const reset = () => {
    searchForm.order_number = ''
    searchForm.batch_id = ''
    searchForm.type_name = ''
    searchForm.name = ''
    searchForm.date = getDate(700)
}
const data = {
    api: getList,
    param: searchForm,
    create: NewOrderBatch,
    update: UpdateOrderBatch,
}
const columns = []
const dateChange = (val) => {
    console.log('dateChange: ', val)
    searchForm.date = val
}

const orderList = (val) => {
    if (editForm.link_order_number !== '' && val.length > 0) {
        val.forEach(item => {
            if (item.order_number === editForm.link_order_number) {
                editForm.name = item.name
                editForm.total = item.total
                editForm.order_type = item.order_type
            }
        })
    }
}
const openForm = () => {
    if (editForm.id == 0) {
        editForm.stage = '0'
    }
}
</script>

<template>
    <ListPage :tableData="data" :tableColumns="columns" dialogTitle="物流" dialogWidth="40%" :editForm="editForm"
        :editRules="editRules" :hasOperation="true" @reset="reset" @open-form="openForm">
        <template #searchForm>
            <el-form-item label="订单号">
                <order-selector v-model="searchForm.order_number" />
            </el-form-item>
            <el-form-item label="物流号">
                <el-input v-model="searchForm.batch_id" placeholder="请输入物流号"></el-input>
            </el-form-item>
            <el-form-item label="商品类型" class="ml-2">
                <mater-selector v-model="searchForm.type_name" />
            </el-form-item>
            <el-form-item label="商品名称" class="ml-2">
                <el-input v-model="searchForm.name" placeholder="请输入商品名称" />
            </el-form-item>
            <date-picker :value="searchForm.date" @change="dateChange" />
        </template>
        <template #dialogBody>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="订单号" prop="link_order_number">
                        <order-selector v-model="editForm.link_order_number" @orderList="orderList" />
                    </el-form-item>
                    <el-form-item label="订单类型" prop="order_type">
                        <el-input v-model="editForm.order_type" placeholder="请输入订单类型"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名" prop="name">
                        <el-input v-model="editForm.name" placeholder="请输入商品名"></el-input>
                    </el-form-item>
                    <el-form-item label="总数" prop="total">
                        <el-input v-model="editForm.total" placeholder="请输入总数"></el-input>
                    </el-form-item>

                    <el-form-item label="负责人" prop="express_name">
                        <user-selector v-model="editForm.express_name" />
                    </el-form-item>
                    <el-form-item label="阶段" prop="stage">
                        <stage-selector v-model="editForm.stage" />
                    </el-form-item>
                </el-col>
            </el-row>
        </template>
        <template #action="scope">
            <el-button type="success" plain size="small"
                @click="router.push('/purchase_order?order_number=' + scope.row.link_order_number)">M</el-button>
        </template>
    </ListPage>
</template>