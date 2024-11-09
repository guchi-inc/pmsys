<script setup>
import { reactive } from 'vue'
import { getMaterTypesAll as getList,   } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import { getDate } from '@/utils'
const searchForm = reactive({ 
    type_name:'', 
    tenant_id: '', 
})

const data = {
    api: getList,
    param: searchForm,
    
}
const columns = []
const dateChange = (val) => {
    console.log('dateChange: ', val) 
}
</script>
<template>
    <ListPage :tableData="data" :tableColumns="columns" :editForm="editForm" :editRules="editRules" :hasOperation="false"
        :status-field="'enabled'" @reset="reset">
        <template #searchForm> 
            <el-form-item class="ml-4" label="类型名称" prop="type_name">
                <el-input v-model="searchForm.type_name" placeholder="请输入类型名称"></el-input>
            </el-form-item>
            <el-form-item class="ml-4" label="合作商id" prop="tenant_id">
                <el-input v-model="searchForm.tenant_id" placeholder="请输入合作商id"></el-input>
            </el-form-item>
            
        </template>
        <template #dialogBody>
            <el-row>
                
            </el-row>
        </template>
    </ListPage>
</template>