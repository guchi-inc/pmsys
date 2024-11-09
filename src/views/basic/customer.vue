<script lang="tsx" setup>
import { reactive } from 'vue'
import { getSupplierList as getList, newSupplier, updateSupplier } from '@/api'
import ListPage from '@/components/ListPage.vue'
const searchForm = reactive({
    phone_num: '',
    supplier: '',
    email: '',
    contacts: '',
})
const editForm = reactive({
    id: '',
    type: '',
    tenant_id: '',
    supplier: '',
    contacts: '',
    phone_num: '',
    telephone: '',
    fax: '',
    email: '',
    address: '',
    bank_name: '',
    account_number: '',
    advance_in: 0,
    begin_need_get: 0,
    begin_need_pay: 0,
    all_need_get: 0,
    all_need_pay: 0,
    tax_num: '',
    tax_rate: '',
    sort: '',
    description: '',
    isystem: '0',
    enabled: '1',
})
const rule_decimal = { pattern: /^\d+\.?\d{0,6}$/, message: "请输入数字，最多6位小数" }
const editRules = reactive({
    // type: [
    //     { required: true, message: '请输入类型', trigger: 'blur' },
    // ],
    tenant_id: [
         { required: true, message: '请输入客户号', trigger: 'blur' },
     ],
    supplier: [
        { required: true, message: '请输入供应商名称', trigger: 'blur' },
    ],
    contacts: [
        { required: true, message: '请输入联系人', trigger: 'blur' },
    ],
    phone_num: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
    ], 
    advance_in: [
        rule_decimal
    ],
    begin_need_get: [ 
        rule_decimal
    ],
    begin_need_pay: [   
        rule_decimal
    ],
    all_need_get: [ 
        rule_decimal
    ],
    all_need_pay: [ 
        rule_decimal
    ], 
})
const reset = () => {
    searchForm.phone_num = ''
    searchForm.supplier = ''
    searchForm.email = ''
    searchForm.contacts = ''
}
const data = {
    api: getList,
    param: searchForm,
    create: newSupplier,
    update: updateSupplier
}
const columns = [
    {
        label: '类型',
        prop: 'type',
        width: '',
        align: 'center',
    },
    {
        label: '供应商名称',
        prop: 'supplier',
        width: '',
        align: 'center',
        formatter: (row, column, cellValue) => {
            if (row.delete_flag == '0') {
                return cellValue
            } else {
                return <div class="text-red-600">{cellValue}</div>
            }
        }
    },
    {
        label: '电话',
        prop: 'phone_num',
        width: '',
        align: 'center',
    },
    {
        label: '联系人',
        prop: 'contacts',
        width: '',
        align: 'center',
    },
    {
        label: '地址',
        prop: 'address',
        width: '',
        align: 'center',
    },
    {
        label: '客户号',
        prop: 'tenant_id',
        width: '',
        align: 'center',
    },
    {
        label: '传真',
        prop: 'telephone',
        width: '',
        align: 'center',
    },
    {
        label: '手机号',
        prop: 'phone_num',
        width: '',
        align: 'center', 
    },
    {
        label: '电邮',
        prop: 'email',
        width: '',
        align: 'center',
    },

]

</script>
<template>
    <ListPage :tableColumns="columns" :tableData="data" :editForm="editForm" :editRules="editRules" statusField="enabled"
        :hasOperation="true" :dialogTitle="'客户信息'" dialogWidth="50%" @reset="reset">
        <template #searchForm>
            <el-form-item label="联系电话" prop="phone_num">
                <el-input v-model="searchForm.phone_num" placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="供应商" prop="supplier">
                <el-input v-model="searchForm.supplier" placeholder="请输入供应商名称"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件" prop="email">
                <el-input v-model="searchForm.email" placeholder="请输入电子邮件"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contacts" class="ml-5">
                <el-input v-model="searchForm.contacts" placeholder="请输入联系人"></el-input>
            </el-form-item>
        </template>
        <template #dialogBody>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="类型" prop="type">
                        <el-input v-model="editForm.type" placeholder="请输入类型"></el-input>
                    </el-form-item>
                    <el-form-item label="租商ID" prop="tenant_id">
                        <el-input v-model="editForm.tenant_id" placeholder="请输入租商ID"></el-input>
                    </el-form-item>
                    <el-form-item label="供应商名称" prop="supplier">
                        <el-input v-model="editForm.supplier" placeholder="请输入供应商名称"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone_num">
                        <el-input v-model="editForm.phone_num" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="contacts">
                        <el-input v-model="editForm.contacts" placeholder="请输入联系人"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="telephone">
                        <el-input v-model="editForm.telephone" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="传真" prop="fax">
                        <el-input v-model="editForm.fax" placeholder="请输入传真"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="editForm.address" placeholder="请输入地址"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮件" prop="email">
                        <el-input v-model="editForm.email" placeholder="请输入电子邮件"></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行" prop="bank_name">
                        <el-input v-model="editForm.bank_name" placeholder="请输入开户银行"></el-input>
                    </el-form-item>
                    <el-form-item label="银行账号" prop="account_number">
                        <el-input v-model="editForm.account_number" placeholder="请输入银行账号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="预收款" prop="advance_in">
                        <el-input-number :controls="false" v-model="editForm.advance_in" placeholder="请输入预收款" />
                    </el-form-item>
                    <el-form-item label="期初应收" prop="begin_need_get">
                        <el-input-number :controls="false" v-model="editForm.begin_need_get" placeholder="请输入期初应付" />
                    </el-form-item>
                    <el-form-item label="期初应付" prop="begin_need_pay">
                        <el-input-number :controls="false" v-model="editForm.begin_need_pay" placeholder="请输入期初应付" />
                    </el-form-item>
                    <el-form-item label="累计应收" prop="all_need_get">
                        <el-input-number :controls="false" v-model="editForm.all_need_get" placeholder="请输入累计应收" />
                    </el-form-item>
                    <el-form-item label="累计应付" prop="all_need_pay">
                        <el-input-number :controls="false" v-model="editForm.all_need_pay" placeholder="请输入累计应付" />
                    </el-form-item>
                    <el-form-item label="税号" prop="tax_num">
                        <el-input v-model="editForm.tax_num" placeholder="请输入税号"></el-input>
                    </el-form-item>
                    <el-form-item label="税率" prop="tax_rate">
                        <el-input-number :controls="false" v-model="editForm.tax_rate" placeholder="请输入税率" />
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model="editForm.sort" placeholder="请输入排序"></el-input>
                    </el-form-item>
                    <el-form-item label="系统自带" prop="isystem">
                        <el-radio-group v-model="editForm.isystem">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="状态" prop="enabled">
                        <el-radio-group v-model="editForm.enabled">
                            <el-radio label="1">启用</el-radio>
                            <el-radio label="0">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注" prop="description">
                        <el-input v-model="editForm.description" rows="1" type="textarea" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </template>
    </ListPage>
</template>