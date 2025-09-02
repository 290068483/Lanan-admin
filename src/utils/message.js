import { ElMessage, ElMessageBox, ElNotification } from "element-plus";

/**
 * 消息提示工具类
 * 实现单例模式，确保同一时间只能显示一个消息提示
 */
export default class MessageUtils {
  // 当前活动的消息实例
  static currentMessageInstance = null;
  // 当前活动的通知实例
  static currentNotificationInstance = null;
  // 消息队列，用于管理待显示的消息
  static messageQueue = [];
  // 是否正在显示消息
  static isShowingMessage = false;

  /**
   * 关闭当前消息实例
   */
  static closeCurrentMessage() {
    if (this.currentMessageInstance) {
      this.currentMessageInstance.close();
      this.currentMessageInstance = null;
    }
  }

  /**
   * 关闭当前通知实例
   */
  static closeCurrentNotification() {
    if (this.currentNotificationInstance) {
      this.currentNotificationInstance.close();
      this.currentNotificationInstance = null;
    }
  }

  /**
   * 处理消息队列
   */
  static processMessageQueue() {
    if (this.isShowingMessage || this.messageQueue.length === 0) {
      return;
    }

    const nextMessage = this.messageQueue.shift();
    if (nextMessage) {
      this.showMessageInternal(nextMessage.message, nextMessage.type, nextMessage.duration);
    }
  }

  /**
   * 内部消息显示方法
   */
  static showMessageInternal(
    message,
    type = "info",
    duration = 3000,
  ) {
    this.isShowingMessage = true;

    // 关闭当前消息
    this.closeCurrentMessage();

    // 显示新消息
    this.currentMessageInstance = ElMessage({
      message,
      type,
      duration,
      showClose: true,
      onClose: () => {
        this.currentMessageInstance = null;
        this.isShowingMessage = false;
        // 处理队列中的下一个消息
        setTimeout(() => {
          this.processMessageQueue();
        }, 100);
      },
    });
  }

  /**
   * 普通消息提示
   * @param message 消息内容
   * @param type 消息类型：'success' | 'warning' | 'info' | 'error'
   * @param duration 显示时间，默认3000毫秒
   * @param immediate 是否立即显示（忽略队列），默认false
   */
  static message(
    message,
    type = "info",
    duration = 3000,
    immediate = false,
  ) {
    if (immediate) {
      // 立即显示，清空队列
      this.messageQueue = [];
      this.showMessageInternal(message, type, duration);
    } else if (!this.isShowingMessage) {
      // 如果没有正在显示的消息，直接显示
      this.showMessageInternal(message, type, duration);
    } else {
      // 添加到队列
      this.messageQueue.push({ message, type, duration });
      // 队列最大长度限制为5，超出则移除最早的消息
      if (this.messageQueue.length > 5) {
        this.messageQueue.shift();
      }
    }
  }

  /**
   * 成功消息提示
   * @param message 消息内容
   * @param duration 显示时间，默认3000毫秒
   * @param immediate 是否立即显示，默认false
   */
  static success(message, duration = 3000, immediate = false) {
    this.message(message, "success", duration, immediate);
  }

  /**
   * 警告消息提示
   * @param message 消息内容
   * @param duration 显示时间，默认3000毫秒
   * @param immediate 是否立即显示，默认false
   */
  static warning(message, duration = 3000, immediate = false) {
    this.message(message, "warning", duration, immediate);
  }

  /**
   * 错误消息提示
   * @param message 消息内容
   * @param duration 显示时间，默认5000毫秒（错误信息显示时间稍长）
   * @param immediate 是否立即显示，默认true（错误信息优先显示）
   */
  static error(message, duration = 5000, immediate = true) {
    this.message(message, "error", duration, immediate);
  }

  /**
   * 信息消息提示
   * @param message 消息内容
   * @param duration 显示时间，默认3000毫秒
   * @param immediate 是否立即显示，默认false
   */
  static info(message, duration = 3000, immediate = false) {
    this.message(message, "info", duration, immediate);
  }

  /**
   * 清空消息队列
   */
  static clearMessageQueue() {
    this.messageQueue = [];
  }

  /**
   * 关闭所有消息提示
   */
  static closeAll() {
    this.closeCurrentMessage();
    this.clearMessageQueue();
    ElMessage.closeAll();
  }

  /**
   * 通知提示
   * @param title 标题
   * @param message 消息内容
   * @param type 通知类型：'success' | 'warning' | 'info' | 'error'
   * @param duration 显示时间，默认4500毫秒
   * @param position 显示位置，默认右上角
   */
  static notification(
    title,
    message,
    type = "info",
    duration = 4500,
    position = "top-right",
  ) {
    // 关闭当前通知
    this.closeCurrentNotification();

    this.currentNotificationInstance = ElNotification({
      title,
      message,
      type,
      duration,
      position,
      showClose: true,
      onClose: () => {
        this.currentNotificationInstance = null;
      },
    });
  }

  /**
   * 确认对话框
   * @param message 提示内容
   * @param title 标题
   * @param confirmButtonText 确认按钮文字
   * @param cancelButtonText 取消按钮文字
   * @param type 类型：'success' | 'warning' | 'info' | 'error'
   * @returns Promise
   */
  static confirm(
    message,
    title = "提示",
    confirmButtonText = "确定",
    cancelButtonText = "取消",
    type = "warning",
  ) {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      type,
      draggable: true, // 是否可拖拽
      closeOnClickModal: false, // 是否可以通过点击遮罩层关闭
      closeOnPressEscape: true, // 是否可以通过按下ESC键关闭
    });
  }

  /**
   * 提示对话框
   * @param message 提示内容
   * @param title 标题
   * @param confirmButtonText 确认按钮文字
   * @param type 类型：'success' | 'warning' | 'info' | 'error'
   * @returns Promise
   */
  static alert(
    message,
    title = "提示",
    confirmButtonText = "确定",
    type = "info",
  ) {
    return ElMessageBox.alert(message, title, {
      confirmButtonText,
      type,
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: true,
    });
  }

  /**
   * 输入对话框
   * @param message 提示内容
   * @param title 标题
   * @param defaultValue 默认值
   * @param confirmButtonText 确认按钮文字
   * @param cancelButtonText 取消按钮文字
   * @param inputPlaceholder 输入框占位符
   * @param inputType 输入框类型：'text' | 'textarea' | 'password'
   * @param inputValidator 输入验证函数
   * @returns Promise
   */
  static prompt(
    message,
    title = "提示",
    defaultValue = "",
    confirmButtonText = "确定",
    cancelButtonText = "取消",
    inputPlaceholder = "",
    inputType = "text",
    inputValidator,
  ) {
    return ElMessageBox.prompt(message, title, {
      confirmButtonText,
      cancelButtonText,
      defaultValue,
      placeholder: inputPlaceholder,
      inputType,
      inputValidator,
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: true,
    });
  }
}