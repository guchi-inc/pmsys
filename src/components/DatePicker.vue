<script setup>
import { ref, watch } from 'vue'
import { getDate, parseTime } from '@/utils'

const date = ref(getDate(7))

const shortcuts = [
    {
        text: '最近一周',
        value: () => {
            return getDate(7)
        },
    },
    {
        text: '最近一个月',
        value: () => {
            return getDate(30)
        },
    },
    {
        text: '最近三个月',
        value: () => {
            return getDate(90)
        },
    },
]
const disabledDate = (time) => {
    return time.getTime() > Date.now()
}
const props = defineProps({
    value: {
        type: Array,
        default: () => ['', ''],
    },
})
date.value = props.value
watch(
    () => props.value,
    (val) => {
        date.value = val
    }
)

const emit = defineEmits(['change'])
const handleDateChange = (val) => {
    console.log('handleDateChange: ', val[0])
    let start = val[0], end = val[1]
    if (val.length === 2) {
        start = parseTime(val[0], '{y}-{m}-{d}')
        end = parseTime(val[1], '{y}-{m}-{d}')
    }
    emit('change', [start, end])
}

</script>
<template>
    <el-form-item label="时间" prop="date" class="font-bold">
        <el-date-picker v-model="date" type="daterange" :shortcuts="shortcuts" :disabled-date="disabledDate"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleDateChange" unlink-panels />
    </el-form-item>
</template>
<style scoped>
:deep(.el-date-editor .el-range-separator) {
    font-weight: normal;
}
</style>