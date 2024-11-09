<script lang="tsx" setup>
import { reactive, ref } from 'vue'
import { getRoleList as getList, newRole, updateRole } from '@/api'
import ListPage from '@/components/ListPage.vue' 

const searchForm = reactive({
    role_name: '',
    description: '',
})
const editForm = ref({
    id: '',
    type: '',
    perm_mask:'',
    enabled: '',
    ...searchForm
})
const editRules = reactive({
    role_name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
    ],
    description: [
        { required: true, message: '请输入角色描述', trigger: 'blur' },
    ],
    type: [
        { required: true, message: '请选择类型', trigger: 'blur' },
    ],
    perm_mask:[
        { required: true, message: '请选择权限', trigger: 'blur' },
    ],
    enabled: [
        { required: true, message: '请选择状态', trigger: 'blur' },
    ],
})
const reset = () => {
    searchForm.role_name = ''
    searchForm.description = ''
}
const data = {
    api: getList,
    param: searchForm,
    create: newRole,
    update: updateRole
}
const columns = [
    {
        label: '角色名称',
        prop: 'role_name',
        width: '',
        align: 'center',
    },
    {
        label: '角色描述',
        prop: 'description',
        width: '',
        align: 'center',
    },
    {
        label: '类型',
        prop: 'type',
        width: '',
        align: 'center',
    },
    {
         label: '权限',
         prop: 'perm_mask',
         width: '',
         align: 'center', 
     },
]

</script>
<template>
    <ListPage :tableColumns="columns" :tableData="data" :editForm="editForm" :editRules="editRules" statusField="enabled"
        :hasOperation="true" dialogTitle="角色" @reset="reset">
        <template #searchForm>
            <el-form-item label="角色名称" prop="role_name">
                <el-input v-model="searchForm.role_name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item class="ml-5" label="角色描述" prop="description">
                <el-input v-model="searchForm.description" placeholder="请输入角色描述"></el-input>
            </el-form-item>
        </template>
        <!-- <el-button type="primary" v-bind:icon="Add" size="small" onClick="handleAdd">新增</el-button> -->
        <template #dialogBody>
            <el-form-item label="角色名称" prop="role_name">
                <el-input v-model="editForm['role_name']" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
                <el-input v-model="editForm['description']" placeholder="请输入角色描述"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="editForm['type']" placeholder="请选择类型">
                    <el-option label="全部数据" value="全部数据"></el-option>
                    <el-option label="个人数据" value="个人数据"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="权限" prop="perm_mask">
                <el-radio-group v-model="editForm['perm_mask']">
                    <el-radio label="1">只读</el-radio>
                    <el-radio label="7">读写</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="状态" prop="enabled">
                <el-radio-group v-model="editForm['enabled']">
                    <el-radio label="0">禁用</el-radio>
                    <el-radio label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
        </template>
    </ListPage>
</template>