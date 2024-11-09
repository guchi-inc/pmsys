const dialogResize = (app) => {
    app.directive('dialogResize', {
        beforeMount(el) {
            // el.style.cursor = 'move';
            // el.style.touchAction = 'none';
        },
        mounted(el, binding, vnode, oldVnode) {
            // 可视窗口的宽度
            const clientWidth = document.documentElement.clientWidth
            // 可视窗口的高度
            const clientHeight = document.documentElement.clientHeight

            // 弹窗的容器
            const domDrag = el.parentElement.parentElement

            // 拖拽的div
            if (domDrag) {
                // 获取元素
                const dialogDom = domDrag;
                const headerDom = dialogDom.getElementsByClassName('el-dialog__header')[0];
                const dialogBoxDom = dialogDom.parentElement;

                // 初始化变量
                let startX, startY, initialX, initialY, newWidth, newHeight;
                let isDrag = false;
                let dragPosition = {
                    x: 0,
                    y: 0,
                };
                let isResizing = false;
                let isMousedown = false;

                headerDom.style.cursor = 'move';
                dialogDom.style.position = 'absolute';
                dialogDom.style.width = '60%';
                dialogDom.style.height = '80%';
                dialogDom.style.top = '10%';
                dialogDom.style.left = '20%';
                dialogDom.style.margin = '0';

                // 鼠标移动改变指针样式
                dialogDom.addEventListener('mousemove', (e) => {
                    if (isMousedown) return;
                    const size = 5;
                    const width = dialogDom.clientWidth;
                    const height = dialogDom.clientHeight;
                    const dialogBoxX = e.pageX - dialogBoxDom.offsetLeft;
                    const dialogBoxY = e.pageY - dialogBoxDom.offsetTop;
                    startX = dialogBoxX - dialogDom.offsetLeft;
                    startY = dialogBoxY - dialogDom.offsetTop;
                    // console.log(width, height);
                    if (startX < size && startY < size) {
                        dialogDom.style.cursor = 'nw-resize';
                        isResizing = 'top-left';
                    } else if (startX > width - size && startY > height - size) {
                        dialogDom.style.cursor = 'nw-resize';
                        isResizing = 'bottom-right';
                    } else if (startX > width - size && startY < size) {
                        dialogDom.style.cursor = 'ne-resize';
                        isResizing = 'top-right';
                    } else if (startX < size && startY > height - size) {
                        dialogDom.style.cursor = 'ne-resize';
                        isResizing = 'bottom-left';
                    } else if (startX < size) {
                        dialogDom.style.cursor = 'e-resize';
                        isResizing = 'left';
                    } else if (startX > width - size) {
                        dialogDom.style.cursor = 'e-resize';
                        isResizing = 'right';
                    } else if (startY < size) {
                        dialogDom.style.cursor = 'n-resize';
                        isResizing = 'top';
                    } else if (startY > height - size) {
                        dialogDom.style.cursor = 'n-resize';
                        isResizing = 'bottom';
                    } else {
                        dialogDom.style.cursor = 'default';
                        isResizing = false;
                    }
                });
                // 拖拽
                headerDom.addEventListener('mousedown', (e) => {
                    isDrag = true;
                    dragPosition.x = e.pageX - dialogBoxDom.offsetLeft - dialogDom.offsetLeft;
                    dragPosition.y = e.pageY - dialogBoxDom.offsetTop - dialogDom.offsetTop;
                });
                // 鼠标按下判断是否开启尺寸拖拽
                dialogDom.addEventListener('mousedown', (e) => {
                    if (!isResizing) return;
                    isMousedown = true;
                });
                // 按住鼠标移动改变尺寸
                dialogDom.parentElement.addEventListener('mousemove', (e) => {
                    const domWidth = dialogDom.clientWidth;
                    const domHeight = dialogDom.clientHeight;
                    const domTop = dialogDom.offsetTop;
                    const domLeft = dialogDom.offsetLeft;
                    const dialogBoxX = e.pageX - dialogBoxDom.offsetLeft;
                    const dialogBoxY = e.pageY - dialogBoxDom.offsetTop;
                    const minWidth = 100;
                    const minHeight = 100;
                    // 拖拽
                    if (isDrag) {
                        // console.log(dialogDom.clientWidth)
                        dialogDom.style.left = dialogBoxX - dragPosition.x + 'px';
                        dialogDom.style.top = dialogBoxY - dragPosition.y + 'px';
                    }
                    if (!isMousedown) return;
                    switch (isResizing) {
                        case 'top-left':
                            moveTop();
                            moveLeft();
                            break;
                        case 'bottom-right':
                            moveBottom();
                            moveRight();
                            break;
                        case 'top-right':
                            moveTop();
                            moveRight();
                            break;
                        case 'bottom-left':
                            moveBottom();
                            moveLeft();
                            break;
                        case 'left':
                            moveLeft();
                            break;
                        case 'right':
                            moveRight();
                            break;
                        case 'top':
                            moveTop();
                            break;
                        case 'bottom':
                            moveBottom();
                            break;
                        default:
                            break;
                    }
                    function moveLeft() {
                        const width = domWidth + domLeft - dialogBoxX;
                        if (domWidth < minWidth && width < domWidth) return;
                        dialogDom.style.left = dialogBoxX + 'px';
                        dialogDom.style.width = width + 'px';
                    }
                    function moveRight() {
                        const width = dialogBoxX - domLeft;
                        if (domWidth < minWidth && width < domWidth) return;
                        dialogDom.style.width = width + 'px';
                    }
                    function moveTop() {
                        const height = domHeight + domTop - dialogBoxY;
                        if (domHeight < minHeight && height < domHeight) return;
                        dialogDom.style.top = dialogBoxY + 'px';
                        dialogDom.style.height = height + 'px';
                    }
                    function moveBottom() {
                        const height = dialogBoxY - domTop;
                        if (domHeight < minHeight && height < domHeight) return;
                        dialogDom.style.height = height + 'px';
                    }
                });
                // 鼠标抬起
                dialogDom.parentElement.addEventListener('mouseup', (e) => {
                    isDrag = false;
                    isMousedown = false;
                });
            } else {
                setTimeout(() => {
                    addEventFun();
                }, 1000);
            }
        },
        _updated(el, binding, vnode, oldVnode) {
            console.log(' === updated = ', el, binding, vnode, oldVnode)
            //弹框可拉伸最小宽高
            let minWidth = 500;
            let minHeight = 400;
            //初始非全屏
            let isFullScreen = false;
            //当前宽高
            let nowWidth = 0;
            let nowHight = 0;
            //当前顶部高度
            let nowMarginTop = 0;
            //获取弹框头部（这部分可双击全屏）
            const dialogHeaderEl = el.querySelector('.el-dialog__header');
            if (!dialogHeaderEl) { return; }
            //弹窗
            const dragDom = el.querySelector('.el-dialog');
            //给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
            console.log(' === dragDom = ', el, dragDom)
            dragDom.style.overflow = "auto";
            //清除选择头部文字效果
            dialogHeaderEl.onselectstart = new Function("return false");
            //头部加上可拖动cursor
            dialogHeaderEl.style.cursor = 'move';

            // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
            const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

            let moveDown = (e) => {
                // 鼠标按下，计算当前元素距离可视区的距离
                const disX = e.clientX - dialogHeaderEl.offsetLeft;
                const disY = e.clientY - dialogHeaderEl.offsetTop;

                // 获取到的值带px 正则匹配替换
                let styL, styT;

                // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
                if (sty.left.includes('%')) {
                    styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
                    styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
                } else {
                    styL = +sty.left.replace(/\px/g, '');
                    styT = +sty.top.replace(/\px/g, '');
                };

                document.onmousemove = function (e) {
                    // 通过事件委托，计算移动的距离 
                    const l = e.clientX - disX;
                    const t = e.clientY - disY;

                    // 移动当前元素
                    dragDom.style.left = `${l + styL}px`;
                    dragDom.style.top = `${t + styT}px`;

                    //将此时的位置传出去
                    //binding.value({x:e.pageX,y:e.pageY})
                };

                document.onmouseup = function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
            dialogHeaderEl.onmousedown = moveDown;
            //双击头部效果
            dialogHeaderEl.ondblclick = (e) => {
                if (isFullScreen == false) {
                    nowHight = dragDom.clientHeight;
                    nowWidth = dragDom.clientWidth;
                    nowMarginTop = dragDom.style.marginTop;
                    dragDom.style.left = 0;
                    dragDom.style.top = 0;
                    dragDom.style.height = "100VH";
                    dragDom.style.width = "100VW";
                    dragDom.style.marginTop = 0;
                    isFullScreen = true;
                    dialogHeaderEl.style.cursor = 'initial';
                    dialogHeaderEl.onmousedown = null;
                } else {
                    dragDom.style.height = "auto";
                    dragDom.style.width = nowWidth + 'px';
                    dragDom.style.marginTop = nowMarginTop;
                    isFullScreen = false;
                    dialogHeaderEl.style.cursor = 'move';
                    dialogHeaderEl.onmousedown = moveDown;
                }
            }

            //拉伸(右下方)
            let resizeEl = document.createElement("div");
            dragDom.appendChild(resizeEl);
            //在弹窗右下角加上一个10-10px的控制块
            resizeEl.style.cursor = 'se-resize';
            resizeEl.style.position = 'absolute';
            resizeEl.style.height = '10px';
            resizeEl.style.width = '10px';
            resizeEl.style.right = '0px';
            resizeEl.style.bottom = '0px';
            resizeEl.style.zIndex = '99';
            //鼠标拉伸弹窗
            resizeEl.onmousedown = (e) => {
                // 记录初始x位置
                let clientX = e.clientX;
                // 鼠标按下，计算当前元素距离可视区的距离
                let disX = e.clientX - resizeEl.offsetLeft;
                let disY = e.clientY - resizeEl.offsetTop;

                document.onmousemove = function (e) {
                    e.preventDefault(); // 移动时禁用默认事件

                    // 通过事件委托，计算移动的距离
                    let x = e.clientX - disX + (e.clientX - clientX);//这里 由于elementUI的dialog控制居中的，所以水平拉伸效果是双倍
                    let y = e.clientY - disY;
                    //比较是否小于最小宽高
                    dragDom.style.width = x > minWidth ? `${x}px` : minWidth + 'px';
                    dragDom.style.height = y > minHeight ? `${y}px` : minHeight + 'px';
                };
                //拉伸结束
                document.onmouseup = function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }

            //拉伸(右边)
            let resizeElR = document.createElement("div");
            dragDom.appendChild(resizeElR);
            //在弹窗右下角加上一个10-10px的控制块
            resizeElR.style.cursor = 'w-resize';
            resizeElR.style.position = 'absolute';
            resizeElR.style.height = '100%';
            resizeElR.style.width = '10px';
            resizeElR.style.right = '0px';
            resizeElR.style.top = '0px';
            //鼠标拉伸弹窗
            resizeElR.onmousedown = (e) => {
                let elW = dragDom.clientWidth;
                let EloffsetLeft = dragDom.offsetLeft;
                // 记录初始x位置
                let clientX = e.clientX;
                document.onmousemove = function (e) {
                    e.preventDefault(); // 移动时禁用默认事件
                    //右侧鼠标拖拽位置
                    if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
                        //往左拖拽
                        if (clientX > e.clientX) {
                            if (dragDom.clientWidth < minWidth) {
                            } else {
                                dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px';
                            }
                        }
                        //往右拖拽
                        if (clientX < e.clientX) {
                            dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px';
                        }
                    }

                };
                //拉伸结束
                document.onmouseup = function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }

            //拉伸(左边)
            let resizeElL = document.createElement("div");
            dragDom.appendChild(resizeElL);
            //在弹窗右下角加上一个10-10px的控制块
            resizeElL.style.cursor = 'w-resize';
            resizeElL.style.position = 'absolute';
            resizeElL.style.height = '100%';
            resizeElL.style.width = '10px';
            resizeElL.style.left = '0px';
            resizeElL.style.top = '0px';
            //鼠标拉伸弹窗
            resizeElL.onmousedown = (e) => {
                let elW = dragDom.clientWidth;
                let EloffsetLeft = dragDom.offsetLeft;
                // 记录初始x位置
                let clientX = e.clientX;
                document.onmousemove = function (e) {
                    e.preventDefault(); // 移动时禁用默认事件
                    //左侧鼠标拖拽位置
                    if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
                        //往左拖拽
                        if (clientX > e.clientX) {
                            dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px';
                        }
                        //往右拖拽
                        if (clientX < e.clientX) {
                            if (dragDom.clientWidth < minWidth) {
                            } else {
                                dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px';

                            }
                        }
                    }

                };
                //拉伸结束
                document.onmouseup = function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }

            // 拉伸(下边)
            let resizeElB = document.createElement("div");
            dragDom.appendChild(resizeElB);
            //在弹窗右下角加上一个10-10px的控制块
            resizeElB.style.cursor = 'n-resize';
            resizeElB.style.position = 'absolute';
            resizeElB.style.height = '10px';
            resizeElB.style.width = '100%';
            resizeElB.style.left = '0px';
            resizeElB.style.bottom = '0px';
            //鼠标拉伸弹窗
            resizeElB.onmousedown = (e) => {
                let EloffsetTop = dragDom.offsetTop;
                let ELscrollTop = el.scrollTop;
                let clientY = e.clientY;
                let elH = dragDom.clientHeight;
                document.onmousemove = function (e) {
                    e.preventDefault(); // 移动时禁用默认事件
                    //底部鼠标拖拽位置
                    if (ELscrollTop + clientY > EloffsetTop + elH - 20 && ELscrollTop + clientY < EloffsetTop + elH) {
                        //往上拖拽
                        if (clientY > e.clientY) {
                            if (dragDom.clientHeight < minHeight) {
                            } else {
                                dragDom.style.height = elH - (clientY - e.clientY) * 2 + 'px';
                            }
                        }
                        //往下拖拽
                        if (clientY < e.clientY) {
                            dragDom.style.height = elH + (e.clientY - clientY) * 2 + 'px';
                        }
                    }
                };
                //拉伸结束
                document.onmouseup = function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        }
    })
}
export default dialogResize