<script setup>
import { configStore } from '@/store/config'
const config = configStore()
const stageList = config.pre_define.fields_cname['stage']
const stageKeys = Object.keys(stageList)
</script>
<template>
    <el-select placeholder="请选择阶段">
        <el-option v-for="item in stageKeys" :key="item" :label="stageList[item]" :value="item"></el-option>
    </el-select>
</template>