<script setup>
import { reactive, ref, computed } from 'vue'
import { getRoleUserList as getList, updateRoleUser, getRoleList, getUserList, newRoleUser } from '@/api'
import ListPage from '@/components/ListPage.vue'
const searchForm = reactive({
    login_name: '',
    role_name: '',
    type: '',
})
const editForm = reactive({
    id: '',
    ...searchForm
})
const editRules = reactive({
    login_name: [
        { required: true, message: '请输入登录名称', trigger: 'blur' },
    ],
    role_name: [
        { required: true, message: '请选择角色名称', trigger: 'blur' },
    ],
    type: [
        { required: true, message: '请输入类型', trigger: 'blur' },
    ],
})
const reset = () => {
    searchForm.login_name = ''
    searchForm.role_name = ''
}
const data = {
    api: getList,
    param: searchForm,
    create: newRoleUser,
    update: updateRoleUser
}
const columns = [

    {
        label: '登录名称',
        type: '',
        prop: 'login_name',
        align: 'center',
        width: ''
    },
    {
        label: '角色名称',
        type: '',
        prop: 'role_name',
        align: 'center',
        width: '',
        formatter: (row) => {
            return roleList[row.role_name]
        }
    },
    {
        label: '类型',
        type: '',
        prop: 'type',
        align: 'center',
        width: ''
    },
    {
        label: '创建人',
        type: '',
        prop: 'creator',
        align: 'center',
        width: ''
    },
    {
        label: '创建时间',
        type: '',
        prop: 'create_time',
        align: 'center',
        width: ''
    },
]

const roleList = reactive({})
const userList = reactive({})
// 获取角色列表
getRoleList().then(res => {
    if (res.code === 100000) {
        res.data.forEach(item => { 
            roleList[item.role_name] = item.description
        })
    }
})
const getUser = (param) => {
    // 先清空userList
    // Object.assign(userList, {})
    Object.keys(userList).forEach(key => {
        delete userList[key]
    })
    console.log('getUser: ', userList)
    if (param === undefined || param === '') {
        param = { page: 1, page_size: 10 }
        // return;
    } else {
        param = { login_name: param, page: 1, page_size: 10 }
    }
    // 获取用户列表
    getUserList(param).then(res => {
        if (res.code === 100000) {
            res.data.forEach(item => {
                userList[item.login_name] = item.login_name
            })
        }
    })
}
getUser()

console.log('roleList: ', roleList, 'userList: ', userList)
</script>
<template>
    <ListPage :tableData="data" :tableColumns="columns" :hasOperation="true" :editForm="editForm" :editRules="editRules"
        :editIsArray="false" dialogTitle="用户角色" @reset="reset">
        <template #searchForm>
            <el-form-item label="登录名">
                <el-select v-model="searchForm.login_name" filterable allow-create remote remote-show-suffix :remote-method="getUser"
                    placeholder="请选择登录名">
                    <el-option v-for="item in Object.keys(userList)" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="ml-5" label="角色名称">
                <el-select v-model="searchForm.role_name" filterable placeholder="请选择角色名称">
                    <el-option v-for="item in Object.keys(roleList)" :key="item" :label="roleList[item]"
                        :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型">
                <el-input v-model="searchForm.type" placeholder="请输入类型"></el-input>
            </el-form-item>
        </template>
        <template #dialogBody>
            <!-- <el-form label-width="100px" :model="editForm"> -->
            <el-form-item label="登录名称" prop="login_name">
                <el-select v-model="editForm.login_name" filterable placeholder="请选择登录名称" readonly>
                    <el-option v-for="item in Object.keys(userList)" :key="item" :label="userList[item]"
                        :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色名称" prop="role_name">
                <el-select v-model="editForm.role_name" filterable placeholder="请选择角色名称">
                    <el-option v-for="item in Object.keys(roleList)" :key="item" :label="roleList[item]" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-input v-model="editForm.type" placeholder="请输入类型"></el-input>
            </el-form-item>
            <!-- </el-form> -->
        </template>
    </ListPage>
</template>