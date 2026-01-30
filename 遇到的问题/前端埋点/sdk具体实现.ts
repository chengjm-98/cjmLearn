/**
 * =========================
 * 前端埋点 SDK（Core）
 * =========================
 */

/**
 * SDK 初始化配置
 */
interface TrackerConfig {
  appId: string; // 应用唯一标识
  endpoint: string; // 埋点接收地址
  batchSize?: number; // 批量上报条数
  flushInterval?: number; // 定时上报间隔（ms）
  sampleRate?: number; // 采样率 0 ~ 1
}

/**
 * 单条埋点事件结构
 */
interface TrackEvent {
  event: string; // 事件名
  appId: string; // 应用 ID
  page: string; // 当前页面
  ts: number; // 时间戳
  data?: Record<string, any>; // 自定义数据
}

class TrackerSDK {
  /** SDK 配置 */
  private config!: Required<TrackerConfig>;

  /** 内存事件队列 */
  private queue: TrackEvent[] = [];

  /** 定时器 */
  private timer: number | null = null;

  /** once 事件去重 */
  private onceSet = new Set<string>();

  /** 节流时间记录 */
  private throttleMap: Record<string, number> = {};

  /**
   * 初始化 SDK
   */
  init(config: TrackerConfig) {
    this.config = {
      batchSize: 10,
      flushInterval: 3000,
      sampleRate: 1,
      ...config,
    };

    // 页面关闭 / 切后台时立即上报
    this.bindLifecycle();
  }

  /**
   * 对外暴露的埋点方法
   */
  track(
    event: string,
    data?: Record<string, any>,
    options?: {
      once?: boolean; // 是否只上报一次
      throttle?: number; // 节流时间（ms）
    },
  ) {
    try {
      // 采样控制（减少数据量）
      if (Math.random() > this.config.sampleRate) return;

      // once 去重
      if (options?.once) {
        if (this.onceSet.has(event)) return;
        this.onceSet.add(event);
      }

      // 节流控制
      if (options?.throttle) {
        const now = Date.now();
        const last = this.throttleMap[event] || 0;
        if (now - last < options.throttle) return;
        this.throttleMap[event] = now;
      }

      // 生成标准化事件
      const trackEvent: TrackEvent = {
        event,
        appId: this.config.appId,
        page: location.pathname,
        ts: Date.now(),
        data,
      };

      // 推入队列
      this.queue.push(trackEvent);

      // 触发调度
      this.scheduleFlush();
    } catch (err) {
      // ⚠️ 埋点绝对不能影响业务
    }
  }

  /**
   * 调度上报（防抖）
   */
  private scheduleFlush() {
    // 队列达到批量阈值，立即上报
    if (this.queue.length >= this.config.batchSize) {
      this.flush();
      return;
    }

    // 已经有定时器，不重复创建
    if (this.timer) return;

    this.timer = window.setTimeout(() => {
      this.flush();
      this.timer = null;
    }, this.config.flushInterval);
  }

  /**
   * 真正上报数据
   */
  private flush() {
    if (!this.queue.length) return;

    // 拷贝并清空队列
    const events = this.queue.splice(0, this.queue.length);
    const payload = JSON.stringify(events);

    try {
      // 首选 sendBeacon（非阻塞，页面关闭也能发）
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.config.endpoint, payload);
      } else {
        this.fallbackSend(payload);
      }
    } catch (err) {
      // 失败兜底（不能 throw）
      this.fallbackSend(payload);
    }
  }

  /**
   * sendBeacon 不可用时的兜底方案
   */
  private fallbackSend(data: string) {
    try {
      const img = new Image();
      img.src = this.config.endpoint + "?data=" + encodeURIComponent(data);
    } catch (err) {
      // 静默失败
    }
  }

  /**
   * 监听页面生命周期，防止数据丢失
   */
  private bindLifecycle() {
    // 页面切后台
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flush();
      }
    });

    // 页面关闭
    window.addEventListener("beforeunload", () => {
      this.flush();
    });
  }
}

/**
 * 导出单例（全局唯一）
 */
const Tracker = new TrackerSDK();
export default Tracker;
