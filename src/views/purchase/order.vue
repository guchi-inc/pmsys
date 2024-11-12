<script setup>
import { reactive, ref } from 'vue'
import { getOrderAll as getList, OrderPre, NewOrder, UpdateOrder, getSupplierList, getMaterTypesList, getOrderTypes } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import OrderTypesSelector from '@/components/Selector/ordertypes.vue'
import { getDate } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const searchForm = reactive({
    order_number: route.query.order_number || '',
    pre_batch: '',
    username: '',
    type_name: '',
    order_type: '',
    tenant_id: '',
    date: getDate(700),
})
const editForm = reactive({
    id: 0,
    order_number: '',
    pre_batch: '',
    type_name: '',
    name: '',
    order_type: '采购',
    type_level: '',
    category: '',
    length: '',
    creator: '',
    machine_id: '',
    tenant_id: '',
    days: '',
    stage: '0'
})
const editRules = {
    order_number: [
        { required: true, message: '请输入订单号', trigger: 'blur' }
    ],
    type_name: [
        { required: true, message: '请输入商品类型', trigger: 'blur' }
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
    searchForm.pre_batch = ''
    searchForm.username = ''
    searchForm.name = ''

    searchForm.type_name = ''
    searchForm.order_type = '采购'
    searchForm.tenant_id = ''
    searchForm.date = getDate(700)
}
const data = {
    api: getList,
    param: searchForm,
    create: NewOrder,
    update: UpdateOrder,
}
const columns = []
const dateChange = (val) => {
    console.log('dateChange: ', val)
    searchForm.date = val
}

//获取订单类型
const orderTypesList = ref([])
const getOrderTypeList = (param) => {
    if (param === undefined || param === '') {
        param = { page: 1, page_size: 10 }
    } else {
        param = { page: 1, page_size: 10 }
    }
    getOrderTypes(param).then(res => {
        if (res.code === 100000) {
            orderTypesList.value = res.data
        }
    })
}
const handleOrderTypeChange = (val) => {
    console.log('handleOrderTypeChange: ', typeof val)
    getOrderTypeList(val)
}

// 获取供应商
const supplierList = ref([])
const getSupplier = (param) => {
    if (param === undefined || param === '') {
        param = { page: 1, page_size: 20 }
    } else {
        param = { supplier: param, page: 1, page_size: 20 }
    }
    getSupplierList(param).then(res => {
        if (res.code === 100000) {
            supplierList.value = res.data
        }
    })
}
const materTypesList = ref([])
const getMaterTypes = (param) => {
    if (param === undefined || param === '') {
        param = { page: 1, page_size: 20 }
    } else {
        param = { tenant_id: param, page: 1, page_size: 20 }
    }
    getMaterTypesList(param).then(res => {
        if (res.code === 100000) {
            materTypesList.value = res.data
        }
    })
}
const handleSupplierChange = (val) => {
    console.log('handleSupplierChange: ', typeof val)
    getMaterTypes(val)
}
const handleMaterTypeChange = (val) => {
    console.log('handleMaterTypeChange: ', val)
    const param = {
        tenant_id: editForm.tenant_id,
        type_name: val,
    }
    OrderPre(param).then(res => {
        if (res.code === 100000) {
            // 填充 editForm
            console.log('OrderPre: ', res)
            Object.keys(res.data).forEach(item => {
                console.log('item: ', editForm[item])
                if (editForm[item] == '') {
                    editForm[item] = res.data[item]
                }
            })
        }
    })
}
const openForm = () => {
    if (editForm.id == 0)
        editForm.order_type = '采购'
}
getSupplier()
</script>

<template>
    <ListPage :tableData="data" :tableColumns="columns" dialogTitle="订单" dialogWidth="40%" :editForm="editForm"
        :editRules="editRules" :hasOperation="true" @reset="reset" @openForm="openForm">
        <template #searchForm>
            <el-form-item label="订单号">
                <el-input v-model="searchForm.order_number" placeholder="请输入订单号"></el-input>
            </el-form-item>
            <el-form-item label="预批次">
                <el-input v-model="searchForm.pre_batch" placeholder="请输入预批次"></el-input>
            </el-form-item>
            <el-form-item label="商品类型">
                <el-input v-model="searchForm.type_name" placeholder="请输入商品类型"></el-input>
            </el-form-item>

            <el-form-item label="订单类型">
                <el-input v-model="searchForm.order_type" placeholder="请输入订单类型"></el-input>
            </el-form-item>
            <el-form-item label="合作商">
                <el-input v-model="searchForm.tenant_id" placeholder="请输入合作商id"></el-input>
            </el-form-item>
            <date-picker :value="searchForm.date" @change="dateChange" />
        </template>
        <template #dialogBody>
            <el-row>
                <el-col :span="11">

                    <el-form-item label="合作商" prop="ratio_three">
                        <el-select v-model="editForm.tenant_id" placeholder="请选择合作商" filterable default-first-option
                            remote remote-show-suffix :remote-method="getSupplier" @change="handleSupplierChange">
                            <el-option v-for="item, key in supplierList" :key="key" :label="item.supplier"
                                :value="item.tenant_id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商品类型">
                        <!-- <el-input v-model="editForm.type_name" placeholder="商品类型"></el-input> -->
                        <el-select v-model="editForm.type_name" placeholder="请选择商品类型" filterable default-first-option
                            @change="handleMaterTypeChange">
                            <el-option v-for="item, key in materTypesList" :key="key" :label="item.type_name"
                                :value="item.type_name">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商品名称">
                        <el-input v-model="editForm.name" placeholder="请输入商品名"></el-input>
                    </el-form-item>

                    <el-form-item label="订单总数">
                        <el-input v-model="editForm.total" placeholder="请输入订单总数"></el-input>
                    </el-form-item>

                    <el-form-item label="订单负责人" prop="other_unit_three">
                        <el-input v-model="editForm.creator" placeholder="输入订单负责人"></el-input>
                    </el-form-item>

                    <el-form-item label="生产周期" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.days" placeholder="请输入生产周期"></el-input>
                    </el-form-item>

                </el-col>
                <el-col :span="11" :offset="2">

                    <el-form-item label="订单号">
                        <el-input v-model="editForm.order_number" placeholder="请输入订单号"></el-input>
                    </el-form-item>

                    <el-form-item label="订单类型">
                        <order-types-selector v-model="editForm.order_type" />
                    </el-form-item>

                    <el-form-item label="商品等级">
                        <el-input v-model="editForm.type_level" placeholder="请输入商品等级"></el-input>
                    </el-form-item>
                    <el-form-item label="工艺">
                        <el-input v-model="editForm.category" placeholder="请输入工艺"></el-input>
                    </el-form-item>

                    <el-form-item label="阶段" prop="type">
                        <el-select v-model="editForm['stage']" placeholder="初始">
                            <el-option label="初始" value="0"></el-option>
                            <el-option label="生产" value="1"></el-option>
                            <el-option label="检验" value="2"></el-option>
                            <el-option label="完成" value="3"></el-option>
                        </el-select>
                    </el-form-item>


                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">


                </el-col>
            </el-row>
        </template>
        <template #action="scope">
            <el-button type="success" plain size="small"
                @click="router.push('/purchase_assess?order_number=' + scope.row.order_number)">M</el-button>
        </template>
    </ListPage>
</template>