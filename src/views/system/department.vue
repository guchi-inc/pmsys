<script setup>
import { reactive } from 'vue'
import { getUserDepList as getList, postNewUserDep, postUpdateDep } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue' 
const searchForm = reactive({
    dep_type: '',
    manager_name: '', 
    dep_name: '', 
})
const editForm = reactive({
    dep_type: '',
    manager_name: '', 
    dep_name: '', 
})
const editRules = {
    dep_type: [
        { required: true, message: '请输入类型', trigger: 'blur' }
    ],
    manager_name: [
        { required: true, message: '输入负责人登录名', trigger: 'blur' }
    ],
    dep_name: [
        { required: true, message: '请输入部门名', trigger: 'blur' }
    ],
}
const reset = () => {
    searchForm.dep_type = ''
    searchForm.manager_name = '' 
    searchForm.dep_name = '' 
}
const data = {
    api: getList,
    param: searchForm,
    create: postNewUserDep,
    update: postUpdateDep,
}
const columns = []
const dateChange = (val) => {
    console.log('dateChange: ', val)
    searchForm.date = val
}
</script>

<template>
    <ListPage :tableData="data" :tableColumns="columns" dialogTitle="部门" dialogWidth="40%" :editForm="editForm"
        :editRules="editRules" :hasOperation="true" @reset="reset">
         <template #searchForm>
            <el-form-item label="部门类型">
                <el-input v-model="searchForm.dep_type" placeholder="请输入部门类型"></el-input>
            </el-form-item>
            <el-form-item label="负责人登陆名">
                <el-input v-model="searchForm.manager_name" placeholder="请输入负责人登陆名"></el-input>
            </el-form-item>  
            <el-form-item label="部门名">
                <el-input v-model="searchForm.dep_name" placeholder="请输入部门名"></el-input>
            </el-form-item> 
            <date-picker :value="searchForm.date" @change="dateChange" />
        </template>
         <template #dialogBody>
            <el-row>
                <el-col :span="11">
                     <el-form-item label="部门名">
                    <el-input v-model="editForm.dep_name" placeholder="请输入部门名"></el-input>
                    </el-form-item> 
                   <el-form-item label="负责人" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.manager_name"
                            placeholder="请输入负责人登陆名"></el-input>
                    </el-form-item> 
                    <el-form-item label="部门类型" prop="type">
                        <el-select v-model="editForm['dep_type']" placeholder="产品类">
                            <el-option label="产品类" value="P"></el-option>
                            <el-option label="管理类" value="M"></el-option> 
                        </el-select>
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