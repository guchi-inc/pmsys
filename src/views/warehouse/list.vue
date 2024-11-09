<script setup>
import { ref, reactive } from 'vue'
import { getDepotList as getList, updateDepot } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import { getDate } from '@/utils'

const searchForm = reactive({
    source: '',
    creator: '',
    type: '',
    date: getDate(1000),
})
const editForm = ref({
    id: '',
    ...searchForm
})
const editRules = reactive({
    source: [
        { required: true, message: '请输入来源渠道', trigger: 'blur' }
    ],
    creator: [
        { required: true, message: '请输入创建人', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请输入类型', trigger: 'blur' }
    ],
    // date: [
    //     { required: true, message: '请选择日期', trigger: 'blur' }
    // ],
})
const reset = () => {
    searchForm.source = ''
    searchForm.creator = ''
    searchForm.type = ''
    searchForm.date = getDate(7)
}
const data = {
    api: getList,
    param: searchForm,
    update: updateDepot
}
const source = ['PC', '手机']
const columns = [
    {
        label: '类型',
        type: '',
        prop: 'type',
        align: 'center',
        width: ''
        // propFilter: true
    },
    {
        label: '子类',
        type: '',
        prop: 'sub_type',
        align: 'center',
        width: ''
        // propFilter: true
    },
    {
        label: '商户ID',
        type: '',
        prop: 'tenant_id',
        align: 'center',
        width: ''
        // propFilter: true
    },
    {
        label: '创建人',
        type: '',
        prop: 'creator',
        align: 'center',
        width: ''
    },
    /*{
        label: 'default_number',
        type: '',
        prop: 'default_number',
        align: 'center',
        width: '180px'
    },

    {
        label: 'file_name',
        type: '',
        prop: 'file_name',
        align: 'center',
        width: '180px'
    },
    {
        label: 'link_number',
        type: '',
        prop: 'link_number',
        align: 'center',
        width: '180px'
    },*/
    {
        label: 'number',
        type: '',
        prop: 'number',
        align: 'center',
        width: '180px'
    },
    {
        label: 'other_money',
        type: '',
        prop: 'other_money',
        align: 'center',
        width: ''
    },
    {
        label: 'pay_type',
        type: '',
        prop: 'pay_type',
        align: 'center',
        width: ''
    },
    {
        label: 'purchase_status',
        type: '',
        prop: 'purchase_status',
        align: 'center',
        width: ''
    },
    /*{
        label: 'remark',
        type: '',
        prop: 'remark',
        align: 'center',
        width: ''
    },

    {
        label: 'sales_man',
        type: '',
        prop: 'sales_man',
        align: 'center',
        width: ''
    },*/
    {
        label: '来源渠道',
        type: '',
        prop: 'source',
        align: 'center',
        width: '',
        formatter: (row) => {
            return source[row.source]
        }
        // propFilter: true
    },
    {
        label: '状态',
        type: '',
        prop: 'status',
        align: 'center',
        width: ''
        // propFilter: true
    },
    {
        label: '总价',
        type: '',
        prop: 'total_price',
        align: 'center',
        width: ''
        // propFilter: true
    },
    {
        label: '创建时间',
        type: '',
        prop: 'create_time',
        align: 'center',
        width: ''
    },
    {
        label: 'oper_time',
        type: '',
        prop: 'oper_time',
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
    <ListPage :tableColumns="columns" :tableData="data" :editForm="editForm" :editRules="editRules" :hasOperation="true"
        @reset="reset">
        <template #searchForm>
            <el-form-item label="来源">
                <el-select v-model="searchForm.source" placeholder="请选择来源">
                    <el-option v-for="item, index in source" :key="item" :label="item" :value="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="ml-5" label="创建人">
                <el-input v-model="searchForm.creator" placeholder="请输入创建人"></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-input v-model="searchForm.type" placeholder="请输入类型"></el-input>
            </el-form-item>

            <date-picker :value="searchForm.date" @change="dateChange" />

        </template>
        <template #dialogBody>
            <el-form-item label="类型" prop="type">
                <el-input v-model="editForm.type" placeholder="请输入类型" />
            </el-form-item>
            <el-form-item label="创建人" prop="creator">
                <el-input v-model="editForm.creator" placeholder="请输入创建人" />
            </el-form-item>
            <el-form-item label="来源渠道" prop="source">
                <el-select v-model="editForm.source" placeholder="请选择来源渠道">
                    <el-option v-for="item, index in source" :key="item" :label="item" :value="index.toString()" />
                </el-select>
            </el-form-item>

            <!-- <el-form-item label="子类" prop="sub_type">
                <el-input v-model="form.sub_type" placeholder="请输入子类"></el-input>
            </el-form-item>
            <el-form-item label="商户ID" prop="tenant_id">
                <el-input v-model="form.tenant_id" placeholder="请输入商户ID"></el-input>
            </el-form-item>
            <el-form-item label="default_number" prop="default_number">
                <el-input v-model="form.default_number" placeholder="请输入default_number"></el-input>
            </el-form-item>
            <el-form-item label="file_name" prop="file_name">
                <el-input v-model="form.file_name" placeholder="请输入file_name"></el-input>
            </el-form-item>
            <el-form-item label="link_number" prop="link_number">
                <el-input v-model="form.link_number" placeholder="请输入link_number"></el-input>
            </el-form-item>
            <el-form-item label="number" prop="number">
                <el-input v-model="form.number" placeholder="请输入number"></el-input>
            </el-form-item>
            <el-form-item label="other_money" prop="other_money">
                <el-input v-model="form.other_money" placeholder="请输入other_money"></el-input>
            </el-form-item>
            <el-form-item label="pay_type" prop="pay_type">
                <el-input v-model="form.pay_type" placeholder="请输入pay_type"></el-input>
            </el-form-item>
            <el-form-item label="purchase_status" prop="purchase_status">
                <el-input v-model="form.purchase_status" placeholder="请输入purchase_status"></el-input>
            </el-form-item>
            <el-form-item label="remark" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入remark"></el-input>
            </el-form-item> -->
        </template>
    </ListPage>
</template>