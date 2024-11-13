import { login_server, main_server } from '@/utils/request'
export const code = { success: 100000 }
export const signin = (data) => {
    return login_server.post('/signin', data)
}
export const logout = (data) => {
    return login_server.post('/logout', data)
}
export const monitor = (data) => {
    return login_server.post('/resource/monitor', data)
}
export const power = (data) => {
    return login_server.get('/power/list', data)
}
/**
 * 系统管理
 */
// 菜单管理
export const getMenuList = (parameter) => {
    return login_server.get('/menu/list', parameter)
}
export const updateMenu = (parameter) => {
    return login_server.post('/menu/update', parameter)
}
/**
 * 仓库管理
 */
// 仓库清单
export const getDepotList = (parameter) => {
    return login_server.get('/depot/list', parameter)
}
export const updateDepot = (parameter) => {
    return login_server.post('/depot/update', parameter)
}
/**
 * 订单
 */
// 订单管理统计
export const getOrderList = (parameter) => {
    return main_server.post('/order/list', parameter)
}
export const getOrderTypes = (parameter) => {
    return main_server.get('/order/types', parameter)
}
// 物流
export const getOrderBatchs = (parameter) => {
    return main_server.get('/order/batchs', parameter)
}
export const NewOrderBatch = (parameter) => {
    return main_server.post('/order/batch/new', parameter)
}
export const UpdateOrderBatch = (parameter) => {
    return main_server.post('/order/batch/edit', parameter)
}
// 评价
export const getOrderAssess = (parameter) => {
    return main_server.get('/order/assess/list', parameter)
}
// 任务
export const getOrderListDepartment = (parameter) => {
    return main_server.post('/order/list/department', parameter)
}

export const getOrderAll = (parameter) => {
    return main_server.get('/order/all', parameter)
}

export const OrderPre = (parameter) => {
    return main_server.post('/order/pre', parameter)
}

export const NewOrder = (parameter) => {
    return main_server.post('/order/new', parameter)
}

export const UpdateOrder = (parameter) => {
    return main_server.post('/order/update', parameter)
}

export const AssignOrder = (parameter) => {
    return main_server.post('/order/assign/new', parameter)
}

export const EditAssign = (parameter) => {
    return main_server.post('/order/assign/update', parameter)
}

export const AssignList = (parameter) => {
    return main_server.get('/order/assign/list', parameter)
}
/**
 * 商品管理
 */
//商品类别
export const getMaterTypesList = (parameter) => {
    return login_server.get('/mater/types/list', parameter)
}
export const getMaterTypesAll = (parameter) => {
    return login_server.get('/mater/types/all', parameter)
}
export const newMaterTypes = (parameter) => {
    return login_server.post('/mater/types/new', parameter)
}
export const updateMaterTypes = (parameter) => {
    return login_server.post('/mater/types/update', parameter)
}
//产品信息
export const getMaterList = (parameter) => {
    return login_server.get('/mater/list', parameter)
}
export const newMater = (parameter) => {
    return login_server.post('/mater/insert', parameter)
}
export const updateMater = (parameter) => {
    return login_server.post('/mater/update', parameter)
}

//单位 
export const getMaterUnitList = (parameter) => {
    return login_server.get('/mater/unit/list', parameter)
}
export const newMaterUnit = (parameter) => {
    return login_server.post('/mater/unit/new', parameter)
}
export const updateMaterUnit = (parameter) => {
    return login_server.post('/mater/unit/update', parameter)
}

//标记编辑
export const getFlawList = (parameter) => {
    return main_server.get('/check/node/list', parameter)
}
export const NodeFlawNew = (parameter) => {
    return main_server.post('/check/node/new', parameter)
}
export const NodeFlawEdit = (parameter) => {
    return main_server.post('/check/node/edit', parameter)
}

//标记类型
export const getFlawTypeList = (parameter) => {
    return main_server.get('/flaws/types/list', parameter)
}
export const PostFlawNew = (parameter) => {
    return main_server.post('/flaws/types/new', parameter)
}
export const PostFlawUpdate = (parameter) => {
    return main_server.post('/flaws/types/update', parameter)
}

/**
 * 基本资料
 */
// 客户信息
export const getSupplierList = (parameter) => {
    return login_server.get('/supplier/list', parameter)
}
export const newSupplier = (parameter) => {
    return login_server.post('/supplier/new', parameter)
}
export const updateSupplier = (parameter) => {
    return login_server.post('/supplier/update', parameter)
}
/**
 * 系统管理
 */
// 角色管理
export const getRoleList = (parameter) => {
    return login_server.get('/role/list', parameter)
}
export const newRole = (parameter) => {
    return login_server.post('/role/new', parameter)
}
export const updateRole = (parameter) => {
    return login_server.post('/role/update', parameter)
}
// 用户部门
export const getUserDepList = (parameter) => {
    return login_server.get('/user/dep/list', parameter)
}
export const postNewUserDep = (parameter) => {
    return login_server.post('/user/dep/new', parameter)
}
export const postUpdateDep = (parameter) => {
    return login_server.post('/user/dep/update', parameter)
}
// 用户管理
export const getUserList = (parameter) => {
    return login_server.get('/user/list', parameter)
}
export const getUserInfo = (parameter) => {
    return login_server.get('/user/info', parameter)
}
export const newUser = (parameter) => {
    return login_server.post('/register', parameter)
}
export const updateUser = (parameter) => {
    return login_server.post('/user/update', parameter)
}
// 系统配置
export const getRoleUserList = (parameter) => {
    return login_server.get('/role/user/list', parameter)
}
export const newRoleUser = (parameter) => {
    return login_server.post('/role/user/new', parameter)
}
export const updateRoleUser = (parameter) => {
    return login_server.post('/role/user/update', parameter)
}
// 设备管理
export const getDeviceList = (parameter) => {
    return main_server.get('/check/machine/list', parameter)
}
export const newDevice = (parameter) => {
    return main_server.post('/check/machine/new', parameter)
}
export const updateDevice = (parameter) => {
    return main_server.post('/check/machine/update', parameter)
}

/**
 * 其他所有
 */
// 其他所有
export const getFakeList = (parameter) => {
    return login_server.get('/fake', parameter)
}