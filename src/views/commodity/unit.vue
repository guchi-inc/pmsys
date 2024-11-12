<script setup>
import { reactive } from 'vue'
import { getMaterUnitList as getList, newMaterUnit, updateMaterUnit } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import SupplierSelector from '@/components/Selector/supplier.vue'
import { getDate } from '@/utils'
const searchForm = reactive({
    name: '',
    serial: '',
    basic_unit: '',
    date: getDate(700)
})
const editForm = reactive({
    id: 0,
    name: '',
    basic_unit: '',
    tenant_id: '',
    serial: '',
    other_unit: '',
    ratio: '100.00',
    other_unit_two: '',
    ratio_two: '',
    other_unit_three: '',
    ratio_three: '',
    enabled: '1',
})
const editRules = {
    name: [
        { required: true, message: '请输入单位名称', trigger: 'blur' }
    ],
    basic_unit: [
        { required: true, message: '请输入基本单位', trigger: 'blur' }
    ],
    tenant_id: [
        { required: true, message: '请输入合作方ID', trigger: 'blur' }
    ],
}
const reset = () => {
    searchForm.name = ''
    searchForm.serial = ''
    searchForm.basic_unit = ''
    searchForm.date = getDate(700)
}
const data = {
    api: getList,
    param: searchForm,
    create: newMaterUnit,
    update: updateMaterUnit,
}
// const columns = [
//     { label: '单位名称', prop: 'name' },
//     { label: '基本单位', prop: 'basic_unit' },
//     { label: '合作方ID', prop: 'tenant_id' },
//     { label: '单位序号', prop: 'serial' },
//     { label: '单位1', prop: 'other_unit' },
//     { label: '规格1', prop: 'ratio' },
//     { label: '单位2', prop: 'other_unit_two' },
//     { label: '规格2', prop: 'ratio_two' },
//     { label: '单位3', prop: 'other_unit_three' },
//     { label: '规格3', prop: 'ratio_three' },
// ]
const columns = []
const dateChange = (val) => {
    console.log('dateChange: ', val)
    searchForm.date = val
}
</script>
<template>
    <ListPage :tableData="data" :tableColumns="columns" dialogTitle="单位" dialogWidth="40%" :editForm="editForm"
        :editRules="editRules" :hasOperation="true" status-field="enabled" @reset="reset">
        <template #searchForm>
            <el-form-item label="名称" prop="name">
                <el-input v-model="searchForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="basic_unit">
                <el-input v-model="searchForm.basic_unit" placeholder="请输入单位"></el-input>
            </el-form-item>
            <el-form-item label="序号" prop="serial">
                <el-input v-model="searchForm.serial" placeholder="请输入单位序号"></el-input>
            </el-form-item>
            <date-picker :value="searchForm.date" @change="dateChange" />
        </template>
        <template #dialogBody>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="editForm.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="基本单位" prop="basic_unit">
                        <el-input v-model="editForm.basic_unit" placeholder="请输入基本单位"></el-input>
                    </el-form-item>
                    <el-form-item label="合作商" prop="tenant_id">
                        <supplier-selector v-model="editForm.tenant_id" />
                    </el-form-item>
                    <el-form-item label="单位1" prop="other_unit">
                        <el-input v-model="editForm.other_unit" placeholder="请输入单位1"></el-input>
                    </el-form-item>
                    <el-form-item label="规格1" prop="ratio">
                        <el-input :controls="false" v-model="editForm.ratio" placeholder="请输入规格1"></el-input>
                    </el-form-item>
                    <el-form-item label="单位序号" prop="ratio">
                        <el-input :controls="false" v-model="editForm.serial" placeholder="单位序号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="单位2" prop="other_unit_two">
                        <el-input v-model="editForm.other_unit_two" placeholder="请输入单位2"></el-input>
                    </el-form-item>
                    <el-form-item label="规格2" prop="ratio_two">
                        <el-input :controls="false" v-model="editForm.ratio_two" placeholder="请输入规格2"></el-input>
                    </el-form-item>
                    <el-form-item label="单位3" prop="other_unit_three">
                        <el-input v-model="editForm.other_unit_three" placeholder="请输入单位3"></el-input>
                    </el-form-item>
                    <el-form-item label="规格3" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.ratio_three" placeholder="请输入规格3"></el-input>
                    </el-form-item>
                    <el-form-item v-if="editForm.id == 0" label="状态" prop="enabled">
                        <el-radio-group v-model="editForm.enabled">
                            <el-radio label="1">启用</el-radio>
                            <el-radio label="0">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </template>
    </ListPage>
</template>