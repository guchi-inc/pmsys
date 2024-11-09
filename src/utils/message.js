import { ElNotification, ElMessageBox } from 'element-plus';

export const notify = (title, message = "", type = "success", duration = 2500) => ElNotification({
    title: title,
    message: message,
    type: type,
    duration: duration,
});

export const getErrName = (err) => {
    var title = '';
    if (err instanceof TypeError) {
        title = '类型错误';
    } else if (err instanceof ReferenceError) {
        title = '缺少对象';
    } else if (err instanceof RangeError) {
        title = '范围错误';
    } else if (err instanceof SyntaxError) {
        title = '语法错误';
    } else if (err instanceof URIError) {
        title = 'URI错误';
    } else if (err instanceof EvalError) {
        title = 'Eval错误';
    } else {
        title = '系统错误';
    }
    return title + '：';
};

export const $success = (title, message = '') => notify(title, message, 'success');
export const $error = (err) => notify(getErrName(err), err.message, 'error', 5000); // 5s
export const $warning = (title, message = '') => notify(title, message, 'warning');
export const $info = (title, message = '') => notify(title, message, 'info');

export const messageBox = (titile, msg, type = 'info', callback) => ElMessageBox.alert(msg, titile, {
    type: type,
    callback: callback
});
export const alert = (msg) => {
    messageBox('提示', msg);
};

export const confirmOptions = {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true
};

export const confirm = (title, msg, options) => ElMessageBox.confirm(msg,
    title,
    options ? Object.assign(confirmOptions, options) : confirmOptions
);