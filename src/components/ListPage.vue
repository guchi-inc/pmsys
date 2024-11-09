<script lang="tsx" setup>
import '@/assets/styles/print.scss'
import { computed, reactive, ref } from 'vue'
import { objectMerge, parseTime } from '@/utils'
import { useRoute } from 'vue-router'
import { Edit, Delete } from '@element-plus/icons-vue';
import { $success, $error } from '@/utils/message'
import { deepClone } from '@/utils/tools'
import xlsx from '@/utils/xlsx'
import { checkFormatter } from '@/utils/formatter';
import { configStore } from '@/store/config';
const config = configStore()
const route = useRoute()
const tableRef = ref()
const loading = ref(false)

const tableData = reactive([])
const dynamicColumns = reactive([])
const selectedIds = ref([])
const searchParam = computed(() => {
    const searchParam = deepClone(props.tableData.param)
    if (searchParam.date !== undefined && searchParam.date.length > 0) {
        searchParam['start_at'] = parseTime(searchParam.date[0], '{y}-{m}-{d} 00:00:00')
        searchParam['end_at'] = parseTime(searchParam.date[1], '{y}-{m}-{d} 23:59:59')
        delete searchParam.date
    }
    return {
        page: page.currentPage,
        page_size: page.pageSize,

        ...searchParam,
    }
})

const search = () => {
    console.log('search: ', props.tableData.param)
    editForm.value.id = 0
    props.tableData.api(searchParam.value).then(res => {
        console.log('res = ', res)
        tableData.splice(0, tableData.length, ...res.data)
        if (res.columns && res.columns.length > 0) {
            dynamicColumns.splice(0, dynamicColumns.length, ...res.columns)
        }
        page.total = res["total"]
        console.log("tableData = ", tableData)
    }).catch((err) => {
        console.log('err = ', err)
    })
}

const page = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
})
const getStatus = (statusType) => {
    const cnameObj = config.pre_define['status_cname'][statusType]
    if (cnameObj === undefined) return null;
    return (row, column, cellValue) => {
        console.log('getStatus:', row, column, cellValue)
        if (column.property == 'status') {
            const status = cnameObj
            // console.log('status:', status, 'cellValue:', cnameObj)
            const type = ['success', 'danger', 'warning']
            return <el-dropdown v-slots={{
                dropdown: () => <el-dropdown-menu>
                    {Object.keys(status).map((item, index) => {
                        {/* console.log('item:', item, index) */ }
                        item = status[item]
                        // console.log('item:', item, cellValue, type)
                        if (index + 1 == cellValue) return
                        return <el-dropdown-item key={index} onClick={() => {
                            currentRow.value = row
                            const param = {
                                id: row.id,
                                status: (index + 1).toString()
                            }
                            handleUpdate(param)
                        }}>
                            <el-tag type={type[index]}>{item}</el-tag>
                        </el-dropdown-item>
                    })}
                </el-dropdown-menu>

            }}><el-tag type={type[cellValue - 1]}>{status[cellValue]}</el-tag></el-dropdown>
        } else {
            const status = ['已禁用', '已启用']
            const operat = ['启用', '禁用']
            const type = ['danger', 'success']
            return <el-popconfirm title={'您确定『' + operat[cellValue] + '』这条记录？'} width="220" v-slots={{
                reference: () => <el-tag class="cursor-pointer" type={type[cellValue]}>{status[cellValue]}</el-tag>
            }} onConfirm={() => {
                currentRow.value = row
                const type = typeof cellValue
                cellValue = parseInt(cellValue)
                {/* var newStatus = cellValue === 0 ? 1 : 0 */ }
                let newStatus: number | string = cellValue === 0 ? 1 : 0
                console.log('type:', type)
                if (type === 'string') {
                    newStatus = newStatus.toString()
                }
                const param = {
                    id: row.id,
                }
                param[column.property] = newStatus
                console.log('param==', param, typeof newStatus)
                handleUpdate(param)
            }}>
            </el-popconfirm>
        }
    }
}
const dialogVisible = ref(false)
const editForm = computed({
    get() {
        return props.editForm
    },
    set(val) {
        console.log('editForm val=', val)
        emit('update:editForm', val)
    }
})
const editFormRef = ref()
const currentRow = ref({})
const props = defineProps({
    tableColumns: {
        type: Array,
        required: true
    },
    tableData: {
        type: Object,
        required: true
    },
    statusField: {
        type: String,
        default: '',
    },
    statusType: {
        type: String,
        default: 'user',
    },
    hasOperation: {
        type: Boolean,
        default: false
    },
    hideAddOnly: {
        type: Boolean,
        default: false
    },
    initForm: {
        type: Object,
        default: () => ({})
    },
    editForm: {
        type: Object,
        default: () => ({})
    },
    editRules: {
        type: Object,
        default: () => ({})
    },
    editIsArray: {
        type: Boolean,
        default: false
    },
    labelWidth: {
        type: String,
        default: 'auto'
    },
    dialogTitle: {
        type: String,
        default: ''
    },
    dialogWidth: {
        type: String,
        default: '30%'
    }
})
const tableColumns = computed(() => {
    if (props.tableColumns.length == 0 && tableData.length > 0) {
        // 根据动态数据生成表格列
        const sysField = ['id', 'delete_flag', 'enabled']
        if (dynamicColumns.length > 0) {
            dynamicColumns.forEach((item) => {
                if (!sysField.includes(item.name)) {
                    const formatter = checkFormatter(item.name)
                    // console.log('动态列', formatter[item.name])
                    props.tableColumns.push({
                        label: item.cname,
                        prop: item.name,
                        align: 'center',
                        width: '',
                        formatter: formatter ? formatter[item.name] : null
                    })
                }
            })
        } else {
            // 根据第一条数据生成表格列
            const columns = Object.keys(tableData[0])
            columns.forEach((item, key) => {
                if (!sysField.includes(item)) {
                    props.tableColumns.push({
                        label: item,
                        prop: item,
                        align: 'center',
                        width: '',
                    })
                }
            })
        }
    }
    return props.tableColumns
})
const emit = defineEmits(['reset', 'update:editForm', 'update:dialogWidth'])
const reset = () => {
    emit('reset')
    search()
}

const resetForm = () => {
    // 清除验证
    editFormRef.value?.clearValidate()
    // 清空数据
    for (const key in editForm.value) {
        const val = typeof editForm.value[key] == 'number' ? 0 : ''
        editForm.value[key] = val
        if (key.indexOf('enable_') > -1) {
            editForm.value[key] = '0'
        }
    }
    currentRow.value = {}
}
const handleExport = () => {
    const fields = props.tableColumns
    console.log('----->', selectedIds.value)
    // tableData.filter(item => selectedIds.value.includes(item.id))
    const data = selectedIds.value.length > 0 ? selectedIds.value : tableData
    xlsx(data, fields, route.meta.title)
}
const printData = ref({
    id: 'tableData', // 打印内容的id
    popTitle: route.meta.title, // 打印页面的页眉
    // extraCss: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
})

const handleIndex = (index) => {
    return index + 1 + (page.currentPage - 1) * page.pageSize
}

const dialogTitle = computed(() => {
    return (currentRow.value['id'] == undefined ? '新增' : '编辑') + props.dialogTitle
})
const handleAdd = () => {

    // editFormRef.value?.resetFields()
    // 处理默认值 
    // const param = ['isystem', 'status', 'enable', 'delete_flag']
    const param = {
        // isystem: '0',
        // status: 1,
        enabled: '1',
        delete_flag: '0',
        ...props.initForm
    }
    Object.keys(editForm.value).forEach((item) => {
        Object.keys(param).forEach((i) => {
            if (item == i) {
                editForm.value[item] = param[i]
            }
        })
    })

    dialogVisible.value = true
}
const handleEdit = (row) => {
    // editFormRef.value?.clearValidate()
    currentRow.value = row
    console.log("编辑数据：", row)
    dialogVisible.value = true
    let tmpForm = {}
    Object.keys(editForm.value).forEach((item, key) => {
        // console.log("item = ", item, "row[item] = ", row[item])
        tmpForm[item] = row[item]
    })
    // editForm.value = tmpForm
    // editForm.value = {}
    Object.assign(editForm.value, tmpForm)
    console.log("editForm = ", editForm.value)
}
const handleUpdate = (row) => {
    console.log("更新数据：", row)
    props.tableData.update(row).then(res => {
        console.log("update res = ", res)
        if (res.code == 100000) {
            $success(res.message)
            row.delete_flag || row.status == 2 ? search() : objectMerge(currentRow.value, row)
        }
    }).catch(err => {
        console.log("err = ", err)
        // $error(err) 403不再提示
    })
}
const handleDelete = (row) => {
    console.log(row.id)
    const isStatus = props.statusField == 'status'
    const param = !isStatus ? { id: row.id, delete_flag: '1' } : { id: row.id, status: '2' }
    handleUpdate(param)
}
const handleSubmit = () => {
    console.log("提交数据：", editForm.value)
    editFormRef.value.validate((valid) => {
        console.log("valid = ", valid)
        if (!valid) {
            return false
        }

        loading.value = true
        // const param = props.editIsArray ? [editForm.value] : editForm.value
        const isNew = currentRow.value['id'] == undefined
        var param = editForm.value, api = isNew ? props.tableData.create : props.tableData.update
        if (isNew) {
            delete param['id']
        } else {
            if (props.editIsArray) {
                param = [param]
            }
        }

        console.log('提交的数据参数：', param)
        api(param).then(res => {
            console.log("res = ", res)
            // search()
            if (res.code == 100000) {
                $success(res.message)
                isNew ? search() : objectMerge(currentRow.value, editForm.value)
                dialogVisible.value = false
            }
        }).catch(err => {
            console.log("err = ", err)
            // $error(err.message) // Request failed with status code 401
        }).finally(() => {
            loading.value = false
        })
    })
}

const handleSizeChange = (val) => {
    console.log(`${val} items per page`)
    page.currentPage = 1
    page.pageSize = val
    search()
}

const handleCurrentChange = (val) => {
    console.log(`current page: ${val}`)
    page.currentPage = val
    search()
}
const handleSelectionChange = (val) => {
    selectedIds.value = val //val.map(item => item.id)
    // console.log("选择了 : ", selectedIds.value)
    // console.log("tableRef = ", tableRef.value)
    const table = tableRef.value.$el //document.getElementById('tableData')
    const name = 'selected' //'el-table--border'
    if (selectedIds.value.length > 0) {
        table.classList.add(name)
    } else {
        table.classList.remove(name)
    }
    // console.log("table = ", table.classList.value)
}
const handleRowClick = (row) => {
    // console.log("单击 row = ", row)
    tableRef.value.toggleRowSelection(row)
}
const handleRowDblClick = (row) => {
    // console.log("双击 row = ", row)
    if (props.hasOperation || props.hideAddOnly) {
        dialogVisible.value = true
        handleEdit(row)
    }
}
const dialogWidth = computed({
    get() {
        return props.dialogWidth
    },
    set(val) {
        console.log('dialogWidth val=', val)
        emit('update:dialogWidth', val)
    }
})
const dialogHeight = ref('auto')
const onResize = ({ detail: { width, height } }) => {
    // 设置对话框的宽度和高度
    dialogWidth.value = `${width}px`;
    dialogHeight.value = `${height}px`;
};

search()
</script>
<template>
    <div class="app-container">
        <el-form ref="searchFormRef" label-width="auto">
            <el-row class="p-5 pb-0 flex flex-wrap">
                <slot name="searchForm"></slot>
                <el-col :span="3" class="text-center">
                    <el-button type="primary" @click="() => {
                        page.currentPage = 1
                        search()

                    }">查询</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
        <div class="p-5 pr-0">
            <el-row>
                <el-col :span="24">
                    <el-button v-if="hasOperation" type="primary" @click="handleAdd">新增</el-button>
                    <el-button type="success" @click="handleExport">导出</el-button>
                    <el-button type="info" v-print="printData">打印</el-button>
                </el-col>
            </el-row>
            <el-table id="tableData" ref="tableRef" class="mt-5" table-layout="auto" :data="tableData" stripe
                :show-header="true" @selection-change="handleSelectionChange" @row-click="handleRowClick"
                @row-dblclick="handleRowDblClick">
                <el-table-column type="selection" prop="selection" label="selection" align="center" width="30px">
                </el-table-column>
                <el-table-column type="index" prop="index" label="序号" align="center" width="80px" :index="handleIndex">
                </el-table-column>
                <el-table-column v-for="column in tableColumns" :type="column['type']" :prop="column['prop']"
                    :label="column['label']" :align="column['align']" :width="column['width']"
                    :formatter="column['formatter']">
                </el-table-column>
                <!-- 状态列 -->
                <el-table-column v-if="statusField !== ''" :prop="statusField" label="状态" align="center"
                    :formatter="getStatus(statusType)">
                </el-table-column>
                <!-- 操作列 -->
                <el-table-column v-if="hasOperation || hideAddOnly" prop="action" label="操作" align="center"
                    class-name="action" fixed="right" min-width="300">
                    <template #default="scope">
                        <slot name="action" :row="scope.row"></slot>
                        <el-button type="primary" :icon="Edit" size="small" @click="() => handleEdit(scope.row)" />
                        <el-popconfirm title="您确定『删除』这条记录？" width="220" @confirm="() => handleDelete(scope.row)">
                            <template #reference>
                                <el-button type="danger" :icon="Delete" size="small" />
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="p-5">
                <el-pagination v-if="page.total > 0" :current-page="page.currentPage" :page-size="page.pageSize"
                    :page-sizes="[10, 20, 30, 50, 100]" :background="true" layout="total, ->, prev, pager, next, sizes"
                    :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>
    </div>
    <!-- <div v-dialog-resize> -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth" :height="dialogHeight"
        :close-on-click-modal="false" draggable @close="resetForm">
        <el-form :label-width="labelWidth" ref="editFormRef" :model="editForm" :rules="editRules">
            <slot name="dialogBody"></slot>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="loading" @click="handleSubmit">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
    <!-- </div> -->
</template>
<style scoped>
.el-col-3 {
    min-width: 180px;
    padding-bottom: 20px;
}

.dark .el-form {
    border-bottom: 1px solid #363637;
}

.el-form>.el-row {
    @apply bg-gray-50
}

.dark .el-form>.el-row {
    @apply bg-zinc-800
}

:deep(.el-tag) {
    cursor: pointer;
    outline: none;
}

:deep(.el-input-number) {
    width: 100%;
    text-align: left;
}

:deep(.el-input-number .el-input__inner) {
    text-align: left;
}

:deep(.el-input-number.is-without-controls .el-input__wrapper) {
    padding: 1px 11px;
}

.resizable-content {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: aqua;
}
</style>