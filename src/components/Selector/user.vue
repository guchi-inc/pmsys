<script setup>
import { ref } from 'vue'
import { code, getUserList } from "@/api"
import { getDate, parseTime } from '@/utils'
const userList = ref([])
const props = defineProps({
    date: {
        type: Object,
        default: () => getDate(700)
    }
})
const getUser = async (param) => {
    const query = { page: 1, page_size: 10, start_at: parseTime(props.date[0], '{y}-{m}-{d} 00:00:00'), end_at: parseTime(props.date[1], '{y}-{m}-{d} 23:59:59') }
    if (param === undefined || param === '') {
        param = { ...query }
    } else {
        param = { username: param, ...query }
    }
    getUserList(param).then((res) => {
        if (res.code === code.success) {
            userList.value = res.data
        }
    })
}
getUser()
console.log(props.date)
</script>
<template>
    <el-select filterable remote remote-show-suffix :remote-method="getUser" placeholder="请选择用户">
        <el-option v-for="item in userList" :key="item.id" :label="item.username" :value="item.tenant_id">
            <el-row>
                <el-col class="ellipsis" :span="10">{{ item.username }}</el-col>
                <el-col class="ellipsis" :span="7">{{ item.department }}</el-col>
                <el-col class="ellipsis" :span="7">{{ item.position }}</el-col>
            </el-row>
        </el-option>
    </el-select>
</template>