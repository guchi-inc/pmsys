<script setup>
import { reactive } from 'vue'
import { AssignList as getList, AssignOrder, EditAssign } from '@/api'
import DatePicker from '@/components/DatePicker.vue'
import ListPage from '@/components/ListPage.vue'
import OrderSelector from '@/components/Selector/order.vue'
import { getDate } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const searchForm = reactive({
    order_number: route.query.order_number,
    pre_batch: '',
    username: '',
    login_name: '',
    date: getDate(700),
})
const editForm = reactive({
    id: 0,
    order_number: '',
    login_name: '',
    assign_number: '',
    days: '',
    stage: '2',
    status: '1',
})
const editRules = {
    order_number: [
        { required: true, message: '请输入订单号', trigger: 'blur' }
    ],
    login_name: [
        { required: true, message: '请输入负责人登录名', trigger: 'blur' }
    ],
}
const reset = () => {
    searchForm.order_number = route.query.order_number 
    searchForm.pre_batch = ''
    searchForm.username = ''
    searchForm.login_name = ''
    searchForm.date = getDate(700)
}
const data = {
    api: getList,
    param: searchForm,
    create: AssignOrder,
    update: EditAssign,
}
const columns = []
const dateChange = (val) => {
    console.log('dateChange: ', val)
    searchForm.date = val
}
</script>
<template>
    <ListPage :tableData="data" :tableColumns="columns" dialogTitle="任务" dialogWidth="40%" :editForm="editForm"
        :editRules="editRules" :hasOperation="true" @reset="reset" statusField="status" statusType="gc_order_assign">
        <template #searchForm>
            <el-form-item label="订单号">
                <el-input v-model="searchForm.order_number" placeholder="请输入订单号"></el-input>
            </el-form-item>
            <el-form-item label="预批次">
                <el-input v-model="searchForm.pre_batch" placeholder="请输入预批次"></el-input>
            </el-form-item>
            <el-form-item label="负责人">
                <el-input v-model="searchForm.login_name" placeholder="请输入负责人登录名"></el-input>
            </el-form-item>
            <date-picker :value="searchForm.date" @change="dateChange" />
        </template>
        <template #dialogBody>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="订单号">
                        <order-selector v-model="editForm.order_number" :date="searchForm.date" />
                    </el-form-item>
                    <el-form-item label="负责人">
                        <el-input v-model="editForm.login_name" placeholder="请输入负责人"></el-input>
                    </el-form-item>
                    <el-form-item label="任务数">
                        <el-input v-model="editForm.assign_number" placeholder="请输入分派数"></el-input>
                    </el-form-item>
                    <el-form-item label="阶段" prop="type">
                        <el-select v-model="editForm['stage']" placeholder="检验">
                            <el-option label="初始" value="0"></el-option>
                            <el-option label="生产" value="1"></el-option>
                            <el-option label="检验" value="2"></el-option>
                            <el-option label="完成" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="天数" prop="ratio_three">
                        <el-input :controls="false" v-model="editForm.days" placeholder="任务执行天数"></el-input>
                    </el-form-item>

                    <el-form-item label="状态" prop="type">
                        <el-select v-model="editForm['status']" placeholder="正常">
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
        <template #action="scope">
            <el-button type="success" plain size="small"
                @click="router.push('/production_flaws?batch_id=' + scope.row.batch_id)">M</el-button>
        </template>
    </ListPage>
</template>