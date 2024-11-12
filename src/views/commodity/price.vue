<script setup>
import { reactive } from 'vue'
import { getMaterList as getList, newMater, updateMater } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import MaterTypeSelector from '@/components/Selector/mater.vue'
import UnitSelector from '@/components/Selector/unit.vue'
import SupplierSelector from '@/components/Selector/supplier.vue'

import { getDate } from '@/utils'
const searchForm = reactive({
    name: '',
    material_type_id: '',
    tenant_id: '',
    date: getDate(700)
})
const editForm = reactive({
    id: 0,
    material_type_id: '',
    name: '',
    mfrs: '',
    model: '',
    standard: '',
    color: '',
    unit: '',
    remark: '',
    img_name: '',
    unit_id: '',
    expiry_num: '',
    weight: '',
    price_default: '',
    delivery: '',
    other_field1: '',
    other_field2: '',
    other_field3: '',
    enable_serial_number: '0',
    enable_batch_number: '0',
    tenant_id: '',
    enabled: true
})
const editRules = reactive({
    material_type_id: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
    name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
    mfrs: [{ required: true, message: '请输入生产厂家', trigger: 'blur' }],
    model: [{ required: false, message: '请输入产品型号', trigger: 'blur' }],
    standard: [{ required: false, message: '请输入产品规格', trigger: 'blur' }],
    color: [{ required: true, message: '请输入产品颜色', trigger: 'blur' }],
    unit: [{ required: true, message: '请输入产品单位', trigger: 'blur' }],
    remark: [{ required: false, message: '请输入备注', trigger: 'blur' }],
    img_name: [{ required: false, message: '请输入图片名称', trigger: 'blur' }],
    unit_id: [{ required: true, message: '请输入计量', trigger: 'change' }],
    expiry_num: [{ required: false, message: '请输入保质期', trigger: 'blur' }],
    weight: [{ required: false, message: '请输入重量', trigger: 'blur' }],
    price_default: [{ required: false, message: '请输入成本价格', trigger: 'blur' }],
    delivery: [{ required: false, message: '请输入零售价', trigger: 'blur' }],
    other_field1: [{ required: false, message: '请输入自定义字段1', trigger: 'blur' }],
    other_field2: [{ required: false, message: '请输入自定义字段2', trigger: 'blur' }],
    other_field3: [{ required: false, message: '请输入自定义字段3', trigger: 'blur' }],
    enable_serial_number: [{ required: false, message: '请输入是否启用序列号', trigger: 'blur' }],
    enable_batch_number: [{ required: false, message: '请输入是否启用批次号', trigger: 'blur' }],
    tenant_id: [{ required: true, message: '请选择供应商', trigger: 'change' }],
})
const reset = () => {
    searchForm.name = ''
    searchForm.material_type_id = ''
    searchForm.tenant_id = ''
    searchForm.date = getDate(700)
}
const data = {
    api: getList,
    param: searchForm,
    create: newMater,
    update: updateMater
}

const columns = [
]

const dateChange = (val) => {
    console.log('dateChange: ', val)
    searchForm.date = val
}
const materTypeList = (val) => {
    // console.log('选中的id: ', editForm.material_type_id)
    if (editForm.material_type_id != '' && val.length > 0) {
        val.forEach(element => {
            if (element.material_id == editForm.material_type_id) {
                console.log('element: ', element)
                // 自动填充数据
                // 零售价
                editForm.delivery = element.delivery
                // 成本价
                editForm.price_default = element.price_default
                // 品质
                // editForm.quantity = element.quality
                // 颜色
                editForm.color = element.color
                // 质保期
                editForm.expiry_num = element.category
                // 区域
                // editForm.location = element.location
            }
        });
    }
}
</script>
<template>
    <ListPage :tableData="data" :tableColumns="columns" :editForm="editForm" :editRules="editRules"
        statusField="enabled" :hasOperation="true" dialogTitle="商品" dialogWidth="50%" @reset="reset">
        <template #searchForm>
            <el-form-item label="名称" prop="name">
                <el-input v-model="searchForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item class="ml-5" label="类型号" prop="material_type_id">
                <el-input v-model="searchForm.material_type_id" placeholder="请输入类型号"></el-input>
            </el-form-item>
            <el-form-item class="ml-5" label="供应商号" prop="tenant_id">
                <el-input v-model="searchForm.tenant_id" placeholder="请输入供应商号"></el-input>
            </el-form-item>
            <date-picker :value="searchForm.date" @change="dateChange" />
        </template>
        <template #dialogBody>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="产品类型" prop="material_type_id">
                        <mater-type-selector v-model="editForm.material_type_id" @materTypeList="materTypeList" />
                    </el-form-item>
                    <el-form-item label="产品名称" prop="name">
                        <el-input v-model="editForm.name" placeholder="请输入产品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="供应商" prop="tenant_id">
                        <supplier-selector v-model="editForm.tenant_id" />
                    </el-form-item>
                    <el-form-item label="制造商" prop="mfrs">
                        <el-input v-model="editForm.mfrs" placeholder="请输入生产厂家"></el-input>
                    </el-form-item>
                    <el-form-item label="型号" prop="model">
                        <el-input v-model="editForm.model" placeholder="请输入产品型号"></el-input>
                    </el-form-item>
                    <el-form-item label="规格" prop="standard">
                        <el-input v-model="editForm.standard" placeholder="请输入产品规格"></el-input>
                    </el-form-item>
                    <el-form-item label="颜色" prop="color">
                        <el-input v-model="editForm.color" placeholder="请输入产品颜色"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" prop="unit">
                        <unit-selector v-model="editForm.unit" />
                    </el-form-item>
                    <el-form-item label="计量" prop="unit_id">
                        <el-input v-model="editForm.unit_id" placeholder="请输入计量"></el-input>
                    </el-form-item>
                    <el-form-item label="保质期" prop="expiry_num">
                        <el-input v-model="editForm.expiry_num" placeholder="请输入保质期"></el-input>
                    </el-form-item>
                    <el-form-item label="重量" prop="weight">
                        <el-input v-model="editForm.weight" placeholder="请输入重量"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2" prop="price_default">
                    <el-form-item label="成本价">
                        <el-input v-model="editForm.price_default" placeholder="请输入成本价格"></el-input>
                    </el-form-item>
                    <el-form-item label="零售价" prop="delivery">
                        <el-input v-model="editForm.delivery" placeholder="请输入零售价"></el-input>
                    </el-form-item>
                    <el-form-item label="自定义字段1" prop="other_field1">
                        <el-input v-model="editForm.other_field1" placeholder="请输入自定义字段1"></el-input>
                    </el-form-item>
                    <el-form-item label="自定义字段2" prop="other_field2">
                        <el-input v-model="editForm.other_field2" placeholder="请输入自定义字段2"></el-input>
                    </el-form-item>
                    <el-form-item label="自定义字段3" prop="other_field3">
                        <el-input v-model="editForm.other_field3" placeholder="请输入自定义字段3"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="img_name">
                        <el-input v-model="editForm.img_name" placeholder="请输入图片名称"></el-input>
                        <img-upload v-model="editForm.img_name" />
                        <img :src="editForm.img_name" width="100px" />
                        <el-button type="text" @click="editForm.img_name = ''">清空</el-button>
                        <el-button type="text"
                            @click="editForm.img_name = 'https://www.baidu.com/favicon.ico'">测试</el-button>
                    </el-form-item>
                    <el-form-item label="序列号" prop="enable_serial_number">
                        <el-radio-group v-model="editForm.enable_serial_number">
                            <el-radio label="1">启用</el-radio>
                            <el-radio label="0">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="批次号" prop="enable_batch_number">
                        <el-radio-group v-model="editForm.enable_batch_number">
                            <el-radio label="1">启用</el-radio>
                            <el-radio label="0">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="状态" prop="enabled">
                        <el-radio-group v-model="editForm.enabled">
                            <el-radio label="1">启用</el-radio>
                            <el-radio label="0">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="editForm.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </template>
    </ListPage>
</template>