<script lang="tsx" setup>
import { ref, reactive } from 'vue'
import { getUserList as getList, getUserDepList, newUser, updateUser } from '@/api'
import ListPage from '@/components/ListPage.vue'
const searchForm = reactive({
    username: '',
    login_name: '',
    email: '',
    phonenum: '',
})
const initForm = {
    password: '123123',
    position: '职工',
    leader_flag: '2',
    ismanager: 2,
    isystem: 2,
    status: 1,
}
const editForm = ref({
    id: 0,
    ...searchForm,
    ...initForm,
    department: '',
    remark: '',
    description: '',

})
const editRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    login_name: [
        { required: true, message: '请输入登录名', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
    ],
    phonenum: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
    ],
})
const reset = () => {
    searchForm.username = ''
    searchForm.login_name = ''
    searchForm.email = ''
    searchForm.phonenum = ''
}

const data = {
    api: getList,
    param: searchForm,
    create: newUser,
    update: updateUser
}
const columns = [
    {
        label: '用户名',
        prop: 'username',
        width: '',
        align: 'center',
    },
    {
        label: '登录名',
        prop: 'login_name',
        width: '',
        align: 'center',
    },
    {
        label: '邮箱',
        prop: 'email',
        width: '',
        align: 'center',
    },
    {
        label: '联系电话',
        prop: 'phonenum',
        width: '',
        align: 'center',
        // style: { minWidth: '15%' },
    },
    {
        label: '职位',
        prop: 'position',
        width: '',
        align: 'center',
        // style: { minWidth: '15%' },
    },
    {
        label: '部门',
        prop: 'department',
        width: '',
        align: 'center',
        // style: { minWidth: '15%' },
    },

]
const userList = reactive({})
//获取用户列表
const getUser = async (query, field) => {
    console.log('revceive paramm', param)
    Object.keys(userList).forEach(key => {
        delete userList[key]
    })
    var param = { page: 1, page_size: 5 }
    if (query && query.length > 0) {
        param[field] = query
    }
    const res = await getList(param)
    if (res['code'] === 100000) {
        res.data.forEach(item => {
            userList[item.login_name] = item.username
        })
    }
}
const getUser1 = (query) => {
    return getUser(query, 'username')
}
const getUser2 = (query) => {
    return getUser(query, 'login_name')
}
const userDept = reactive({})
const getDept = async (query) => {
    Object.keys(userDept).forEach(key => {
        delete userDept[key]
    })
    var param = { page: 1, page_size: 5 }
    if (query && query.length > 0) {
        param['dep_name'] = query
    }
    const res = await getUserDepList(param)
    if (res['code'] === 100000) {
        res.data.forEach(item => {
            userDept[item.dep_name] = item.dep_name
        })
    }
}
getUser1('')
getDept('')
</script>
<template>
    <ListPage :tableColumns="columns" :tableData="data" :initForm="initForm" :editForm="editForm" :editRules="editRules"
        statusField="status" :hasOperation="true" dialogTitle="用户" dialogWidth="45%" @reset="reset">
        <template #searchForm>
            <el-form-item label="用户名">
                <el-select v-model="searchForm.username" filterable allow-create remote remote-show-suffix
                    :remote-method="getUser1" placeholder="请选择用户名">
                    <el-option v-for="item in Object.keys(userList)" :key="item" :label="userList[item]"
                        :value="userList[item]"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="登录名">
                <el-select v-model="searchForm.login_name" filterable allow-create remote remote-show-suffix
                    :remote-method="getUser2" placeholder="请选择登录名">
                    <el-option v-for="item in Object.keys(userList)" :key="item" :label="item"
                        :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="searchForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="联系电话" class="ml-5">
                <el-input v-model="searchForm.phonenum" placeholder="请输入联系电话" />
            </el-form-item>
        </template>
        <template #dialogBody>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="editForm['username']" placeholder="请输入用户名" autocomplete="new-password" />
                    </el-form-item>
                    <el-form-item label="登录名" prop="login_name">
                        <el-input v-model="editForm['login_name']" placeholder="请输入登录名" />
                    </el-form-item>
                    <el-form-item v-if="editForm.id == 0" label="密码" prop="password">
                        <el-input v-model="editForm['password']" placeholder="请输入密码" autocomplete="new-password"
                            show-password />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm['email']" placeholder="请输入邮箱" />
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phonenum">
                        <el-input v-model="editForm['phonenum']" placeholder="请输入联系电话" />
                    </el-form-item>
                    <el-form-item label="职位" prop="position">
                        <el-input v-model="editForm['position']" placeholder="请输入职位" />
                    </el-form-item>
                    <el-form-item label="部门" prop="department">
                        <el-select v-model="editForm['department']" placeholder="请选择部门" filterable remote
                            remote-show-suffix :remote-method="getDept">
                            <el-option v-for="item in Object.keys(userDept)" :key="item" :label="userDept[item]"
                                :value="userDept[item]" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="editForm['remark']" placeholder="请输入备注" />
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" rows="3" v-model="editForm['description']" placeholder="请输入描述" />
                    </el-form-item>
                    <el-form-item label="经理" prop="leader_flag">
                        <el-radio-group v-model="editForm['leader_flag']">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="2">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="管理者" prop="ismanager">
                        <el-radio-group v-model="editForm['ismanager']">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="2">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="系统用户" prop="isystem">
                        <el-radio-group v-model="editForm['isystem']">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="2">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </template>
    </ListPage>
</template>