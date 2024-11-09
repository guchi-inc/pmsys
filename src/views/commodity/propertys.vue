<script setup>
import { reactive, ref } from 'vue'
import { getFlawTypeList as getList, PostFlawUpdate, PostFlawNew } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import { getDate } from '@/utils'
const searchForm = reactive({
    flaw_score: '',
    flaw_types: '', 
    flaw_name: '',
    status: '1', 
})
const editForm = reactive({ 
    flaw_score: '',
    flaw_types: '',
    flaw_name: '',
    status: '1' 
})
const editRules = {
    flaw_score: [
        { required: true, message: '请输入扣分数', trigger: 'blur' }
    ],
    flaw_types: [
        { required: true, message: '请输入标记类型', trigger: 'blur' }
    ],
    flaw_name: [
        { required: true, message: '请输入标记名', trigger: 'blur' }
    ],
}
const reset = () => {
    searchForm.flaw_score = ''
    searchForm.flaw_types = '' 
    searchForm.flaw_name = ''
    searchForm.status = '' 
}
const data = {
    api: getList,
    param: searchForm,
    create: PostFlawNew,
    update: PostFlawUpdate,
}

const columns = [] 
  
</script>

<template>
    <ListPage :tableData="data" :tableColumns="columns" dialogTitle="订单" dialogWidth="40%" :editForm="editForm"
        :editRules="editRules" :hasOperation="true" @reset="reset">
        <template #searchForm>
            <el-form-item label="减分数">
                <el-input v-model="searchForm.flaw_score" placeholder="请输入分数"></el-input>
            </el-form-item>
            <el-form-item label="标记类型">
                <el-input v-model="searchForm.flaw_types" placeholder="请输入标记类型"></el-input>
            </el-form-item>
            <el-form-item label="标记名">
                <el-input v-model="searchForm.flaw_name" placeholder="请输入标记名"></el-input>
            </el-form-item> 
        </template>
        <template #dialogBody>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="减分数">
                        <el-input v-model="editForm.flaw_score" placeholder="请输入减分数"></el-input>
                    </el-form-item>
                    <el-form-item label="标记类型" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.flaw_types" placeholder="请输入标记类型"></el-input>
                    </el-form-item>
                    <el-form-item label="标记名" prop="other_unit_three">
                        <el-input v-model="editForm.flaw_name" placeholder="输入标记名"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="type">
                        <el-select v-model="editForm['status']" placeholder="状态"> 
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="取消" value="2"></el-option>
                            <el-option label="禁用" value="3"></el-option>
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