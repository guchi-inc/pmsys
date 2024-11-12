<script setup>
import { reactive } from 'vue'
import { getMaterTypesList as getList, newMaterTypes, updateMaterTypes } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
const searchForm = reactive({
    type_name: '',
    color: '',
    type_value: '',
    serial: '',
})
const editForm = reactive({
    type_name: '',
    color: '',
    type_value: '',
    size: '',
    material_id: '',
    commodity_unit: '',
    wholesale_decimal: '',
    purchase_decimal: '',
    low_decimal: '',
    commodity_decimal: '',
    serial: '',
    quantity: '',
    type_flag: '',
})
const editRules = {
    type_name: [
        { required: true, message: '请输入类型名', trigger: 'blur' }
    ],
    type_value: [
        { required: true, message: '输入中文值', trigger: 'blur' }
    ],
    color: [
        { required: true, message: '请输入颜色', trigger: 'blur' }
    ],
    size: [
        { required: true, message: '请输入尺寸', trigger: 'blur' }
    ],
    category: [
        { required: true, message: '请输入工艺特征值', trigger: 'blur' }
    ],
}
const reset = () => {
    searchForm.type_name = ''
    searchForm.color = ''
    searchForm.type_value = ''
    searchForm.size = ''
}
const data = {
    api: getList,
    param: searchForm,
    create: newMaterTypes,
    update: updateMaterTypes,
}
const columns = [] 
</script>
<template>
    <ListPage :tableData="data" :tableColumns="columns" dialogTitle="产品类型" dialogWidth="40%" :editForm="editForm"
        :editRules="editRules" :hasOperation="true" @reset="reset">
        <template #searchForm>
            <el-form-item label="类型">
                <el-input v-model="searchForm.type_name" placeholder="请输入类型"></el-input>
            </el-form-item>
            <el-form-item label="中文名">
                <el-input v-model="searchForm.type_value" placeholder="请输入中文名"></el-input>
            </el-form-item>
            <el-form-item label="颜色">
                <el-input v-model="searchForm.color" placeholder="请输入颜色"></el-input>
            </el-form-item>
        </template>

        <template #dialogBody>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="产品类型">
                        <el-input v-model="editForm.type_name" placeholder="请输入产品类型"></el-input>
                    </el-form-item>
                    <el-form-item label="中文名" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.type_value" placeholder="请输入类型中文名"></el-input>
                    </el-form-item>
                    <el-form-item label="颜色" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.color" placeholder="请输入颜色"></el-input>
                    </el-form-item>
                    <el-form-item label="尺寸" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.size" placeholder="请输入尺寸"></el-input>
                    </el-form-item>
                    <el-form-item label="特征值" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.category" placeholder="请输入特征值"></el-input>
                    </el-form-item>
                    <el-form-item label="款型" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.type_flag" placeholder="款型，1标准，2宽，3窄"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="产品ID" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.material_id"
                            placeholder="请输入产品ID可以内部指定"></el-input>
                    </el-form-item>

                    <el-form-item label="单位编号" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.serial" placeholder="对应的单位编号"></el-input>
                    </el-form-item>
                    <el-form-item label="品质" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.quantity" placeholder="请输入品质"></el-input>
                    </el-form-item>
                    <el-form-item label="销售地" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.location" placeholder="请输入销售地"></el-input>
                    </el-form-item>
                    <el-form-item label="大类" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.parent" placeholder="请输入大类"></el-input>
                    </el-form-item>
                    <el-form-item label="成本价" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.price_default" placeholder="请输入成本价"></el-input>
                    </el-form-item>
                    <el-form-item label="发售价" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.delivery" placeholder="请输入发售价"></el-input>
                    </el-form-item>

                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                </el-col>
            </el-row>
        </template>

    </ListPage>
</template>