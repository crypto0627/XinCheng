var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../node_modules/.pnpm/@cloudflare+unenv-preset@2.3.1_unenv@2.0.0-rc.15_workerd@1.20250424.0/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../node_modules/.pnpm/@cloudflare+unenv-preset@2.3.1_unenv@2.0.0-rc.15_workerd@1.20250424.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250412.0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x2, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return "";
  }
  get versions() {
    return {};
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  ref() {
  }
  unref() {
  }
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  mainModule = void 0;
  domain = void 0;
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../node_modules/.pnpm/@cloudflare+unenv-preset@2.3.1_unenv@2.0.0-rc.15_workerd@1.20250424.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule(
  "node:process"
);
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250412.0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// .wrangler/tmp/pages-vdZES9/bundledWorker-0.07695846668600725.mjs
import { Writable as Writable2 } from "node:stream";
import { EventEmitter as EventEmitter2 } from "node:events";
var __defProp2 = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __esm = /* @__PURE__ */ __name((fn, res) => /* @__PURE__ */ __name(function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
}, "__init"), "__esm");
var __export = /* @__PURE__ */ __name((target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
}, "__export");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError2(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError2, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented2(name) {
  const fn = /* @__PURE__ */ __name2(() => {
    throw /* @__PURE__ */ createNotImplementedError2(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented2, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass2(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass2, "notImplementedClass");
var init_utils = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name2(createNotImplementedError2, "createNotImplementedError");
    __name2(notImplemented2, "notImplemented");
    __name2(notImplementedClass2, "notImplementedClass");
  }
});
var _timeOrigin2;
var _performanceNow2;
var nodeTiming2;
var PerformanceEntry2;
var PerformanceMark3;
var PerformanceMeasure2;
var PerformanceResourceTiming2;
var PerformanceObserverEntryList2;
var Performance2;
var PerformanceObserver2;
var performance2;
var init_performance = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin2 = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow2 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin2;
    nodeTiming2 = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry2 = class {
      static {
        __name(this, "PerformanceEntry");
      }
      static {
        __name2(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow2();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow2() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark3 = class PerformanceMark2 extends PerformanceEntry2 {
      static {
        __name(this, "PerformanceMark2");
      }
      static {
        __name2(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure2 = class extends PerformanceEntry2 {
      static {
        __name(this, "PerformanceMeasure");
      }
      static {
        __name2(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming2 = class extends PerformanceEntry2 {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      static {
        __name2(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList2 = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      static {
        __name2(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance2 = class {
      static {
        __name(this, "Performance");
      }
      static {
        __name2(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin2;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming2;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming2("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin2) {
          return _performanceNow2();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark3(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure2(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver2 = class {
      static {
        __name(this, "PerformanceObserver");
      }
      static {
        __name2(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance2();
  }
});
var init_perf_hooks = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});
var init_performance2 = __esm({
  "../../../../../node_modules/.pnpm/@cloudflare+unenv-preset@2.3.1_unenv@2.0.0-rc.15_workerd@1.20250424.0/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance2;
    globalThis.Performance = Performance2;
    globalThis.PerformanceEntry = PerformanceEntry2;
    globalThis.PerformanceMark = PerformanceMark3;
    globalThis.PerformanceMeasure = PerformanceMeasure2;
    globalThis.PerformanceObserver = PerformanceObserver2;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList2;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming2;
  }
});
var noop_default2;
var init_noop = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default2 = Object.assign(() => {
    }, { __unenv__: true });
  }
});
var _console2;
var _ignoreErrors2;
var _stderr2;
var _stdout2;
var log3;
var info3;
var trace3;
var debug3;
var table3;
var error3;
var warn3;
var createTask3;
var clear3;
var count3;
var countReset3;
var dir3;
var dirxml3;
var group3;
var groupEnd3;
var groupCollapsed3;
var profile3;
var profileEnd3;
var time3;
var timeEnd3;
var timeLog3;
var timeStamp3;
var Console2;
var _times2;
var _stdoutErrorHandler2;
var _stderrErrorHandler2;
var init_console = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console2 = globalThis.console;
    _ignoreErrors2 = true;
    _stderr2 = new Writable2();
    _stdout2 = new Writable2();
    log3 = _console2?.log ?? noop_default2;
    info3 = _console2?.info ?? log3;
    trace3 = _console2?.trace ?? info3;
    debug3 = _console2?.debug ?? log3;
    table3 = _console2?.table ?? log3;
    error3 = _console2?.error ?? log3;
    warn3 = _console2?.warn ?? error3;
    createTask3 = _console2?.createTask ?? /* @__PURE__ */ notImplemented2("console.createTask");
    clear3 = _console2?.clear ?? noop_default2;
    count3 = _console2?.count ?? noop_default2;
    countReset3 = _console2?.countReset ?? noop_default2;
    dir3 = _console2?.dir ?? noop_default2;
    dirxml3 = _console2?.dirxml ?? noop_default2;
    group3 = _console2?.group ?? noop_default2;
    groupEnd3 = _console2?.groupEnd ?? noop_default2;
    groupCollapsed3 = _console2?.groupCollapsed ?? noop_default2;
    profile3 = _console2?.profile ?? noop_default2;
    profileEnd3 = _console2?.profileEnd ?? noop_default2;
    time3 = _console2?.time ?? noop_default2;
    timeEnd3 = _console2?.timeEnd ?? noop_default2;
    timeLog3 = _console2?.timeLog ?? noop_default2;
    timeStamp3 = _console2?.timeStamp ?? noop_default2;
    Console2 = _console2?.Console ?? /* @__PURE__ */ notImplementedClass2("console.Console");
    _times2 = /* @__PURE__ */ new Map();
    _stdoutErrorHandler2 = noop_default2;
    _stderrErrorHandler2 = noop_default2;
  }
});
var workerdConsole2;
var assert3;
var clear22;
var context2;
var count22;
var countReset22;
var createTask22;
var debug22;
var dir22;
var dirxml22;
var error22;
var group22;
var groupCollapsed22;
var groupEnd22;
var info22;
var log22;
var profile22;
var profileEnd22;
var table22;
var time22;
var timeEnd22;
var timeLog22;
var timeStamp22;
var trace22;
var warn22;
var console_default2;
var init_console2 = __esm({
  "../../../../../node_modules/.pnpm/@cloudflare+unenv-preset@2.3.1_unenv@2.0.0-rc.15_workerd@1.20250424.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole2 = globalThis["console"];
    ({
      assert: assert3,
      clear: clear22,
      context: (
        // @ts-expect-error undocumented public API
        context2
      ),
      count: count22,
      countReset: countReset22,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask22
      ),
      debug: debug22,
      dir: dir22,
      dirxml: dirxml22,
      error: error22,
      group: group22,
      groupCollapsed: groupCollapsed22,
      groupEnd: groupEnd22,
      info: info22,
      log: log22,
      profile: profile22,
      profileEnd: profileEnd22,
      table: table22,
      time: time22,
      timeEnd: timeEnd22,
      timeLog: timeLog22,
      timeStamp: timeStamp22,
      trace: trace22,
      warn: warn22
    } = workerdConsole2);
    Object.assign(workerdConsole2, {
      Console: Console2,
      _ignoreErrors: _ignoreErrors2,
      _stderr: _stderr2,
      _stderrErrorHandler: _stderrErrorHandler2,
      _stdout: _stdout2,
      _stdoutErrorHandler: _stdoutErrorHandler2,
      _times: _times2
    });
    console_default2 = workerdConsole2;
  }
});
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../../../../node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250412.0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default2;
  }
});
var hrtime4;
var init_hrtime = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime4 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime22(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint2() {
      return BigInt(Date.now() * 1e6);
    }, "bigint"), "bigint") });
  }
});
var WriteStream2;
var init_write_stream = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream2 = class {
      static {
        __name(this, "WriteStream");
      }
      static {
        __name2(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir32, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x2, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env22) {
        return 1;
      }
      hasColors(count32, env22) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});
var ReadStream2;
var init_read_stream = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream2 = class {
      static {
        __name(this, "ReadStream");
      }
      static {
        __name2(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});
var init_tty = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});
var Process2;
var init_process = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    Process2 = class _Process extends EventEmitter2 {
      static {
        __name(this, "_Process");
      }
      static {
        __name2(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter2.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream2(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream2(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream2(2);
      }
      #cwd = "/";
      chdir(cwd22) {
        this.#cwd = cwd22;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return "";
      }
      get versions() {
        return {};
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw /* @__PURE__ */ createNotImplementedError2("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw /* @__PURE__ */ createNotImplementedError2("process.getActiveResourcesInfo");
      }
      exit() {
        throw /* @__PURE__ */ createNotImplementedError2("process.exit");
      }
      reallyExit() {
        throw /* @__PURE__ */ createNotImplementedError2("process.reallyExit");
      }
      kill() {
        throw /* @__PURE__ */ createNotImplementedError2("process.kill");
      }
      abort() {
        throw /* @__PURE__ */ createNotImplementedError2("process.abort");
      }
      dlopen() {
        throw /* @__PURE__ */ createNotImplementedError2("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw /* @__PURE__ */ createNotImplementedError2("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw /* @__PURE__ */ createNotImplementedError2("process.loadEnvFile");
      }
      disconnect() {
        throw /* @__PURE__ */ createNotImplementedError2("process.disconnect");
      }
      cpuUsage() {
        throw /* @__PURE__ */ createNotImplementedError2("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw /* @__PURE__ */ createNotImplementedError2("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw /* @__PURE__ */ createNotImplementedError2("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw /* @__PURE__ */ createNotImplementedError2("process.initgroups");
      }
      openStdin() {
        throw /* @__PURE__ */ createNotImplementedError2("process.openStdin");
      }
      assert() {
        throw /* @__PURE__ */ createNotImplementedError2("process.assert");
      }
      binding() {
        throw /* @__PURE__ */ createNotImplementedError2("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented2("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented2("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented2("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented2("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented2("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented2("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name2(() => 0, "rss") });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});
var globalProcess2;
var getBuiltinModule2;
var exit2;
var platform2;
var nextTick2;
var unenvProcess2;
var abort2;
var addListener2;
var allowedNodeEnvironmentFlags2;
var hasUncaughtExceptionCaptureCallback2;
var setUncaughtExceptionCaptureCallback2;
var loadEnvFile2;
var sourceMapsEnabled2;
var arch2;
var argv2;
var argv02;
var chdir2;
var config2;
var connected2;
var constrainedMemory2;
var availableMemory2;
var cpuUsage2;
var cwd2;
var debugPort2;
var dlopen2;
var disconnect2;
var emit2;
var emitWarning2;
var env2;
var eventNames2;
var execArgv2;
var execPath2;
var finalization2;
var features2;
var getActiveResourcesInfo2;
var getMaxListeners2;
var hrtime32;
var kill2;
var listeners2;
var listenerCount2;
var memoryUsage2;
var on2;
var off2;
var once2;
var pid2;
var ppid2;
var prependListener2;
var prependOnceListener2;
var rawListeners2;
var release2;
var removeAllListeners2;
var removeListener2;
var report2;
var resourceUsage2;
var setMaxListeners2;
var setSourceMapsEnabled2;
var stderr2;
var stdin2;
var stdout2;
var title2;
var throwDeprecation2;
var traceDeprecation2;
var umask2;
var uptime2;
var version2;
var versions2;
var domain2;
var initgroups2;
var moduleLoadList2;
var reallyExit2;
var openStdin2;
var assert22;
var binding2;
var send2;
var exitCode2;
var channel2;
var getegid2;
var geteuid2;
var getgid2;
var getgroups2;
var getuid2;
var setegid2;
var seteuid2;
var setgid2;
var setgroups2;
var setuid2;
var permission2;
var mainModule2;
var _events2;
var _eventsCount2;
var _exiting2;
var _maxListeners2;
var _debugEnd2;
var _debugProcess2;
var _fatalException2;
var _getActiveHandles2;
var _getActiveRequests2;
var _kill2;
var _preload_modules2;
var _rawDebug2;
var _startProfilerIdleNotifier2;
var _stopProfilerIdleNotifier2;
var _tickCallback2;
var _disconnect2;
var _handleQueue2;
var _pendingMessage2;
var _channel2;
var _send2;
var _linkedBinding2;
var _process2;
var process_default2;
var init_process2 = __esm({
  "../../../../../node_modules/.pnpm/@cloudflare+unenv-preset@2.3.1_unenv@2.0.0-rc.15_workerd@1.20250424.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess2 = globalThis["process"];
    getBuiltinModule2 = globalProcess2.getBuiltinModule;
    ({ exit: exit2, platform: platform2, nextTick: nextTick2 } = getBuiltinModule2(
      "node:process"
    ));
    unenvProcess2 = new Process2({
      env: globalProcess2.env,
      hrtime: hrtime4,
      nextTick: nextTick2
    });
    ({
      abort: abort2,
      addListener: addListener2,
      allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
      hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
      setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
      loadEnvFile: loadEnvFile2,
      sourceMapsEnabled: sourceMapsEnabled2,
      arch: arch2,
      argv: argv2,
      argv0: argv02,
      chdir: chdir2,
      config: config2,
      connected: connected2,
      constrainedMemory: constrainedMemory2,
      availableMemory: availableMemory2,
      cpuUsage: cpuUsage2,
      cwd: cwd2,
      debugPort: debugPort2,
      dlopen: dlopen2,
      disconnect: disconnect2,
      emit: emit2,
      emitWarning: emitWarning2,
      env: env2,
      eventNames: eventNames2,
      execArgv: execArgv2,
      execPath: execPath2,
      finalization: finalization2,
      features: features2,
      getActiveResourcesInfo: getActiveResourcesInfo2,
      getMaxListeners: getMaxListeners2,
      hrtime: hrtime32,
      kill: kill2,
      listeners: listeners2,
      listenerCount: listenerCount2,
      memoryUsage: memoryUsage2,
      on: on2,
      off: off2,
      once: once2,
      pid: pid2,
      ppid: ppid2,
      prependListener: prependListener2,
      prependOnceListener: prependOnceListener2,
      rawListeners: rawListeners2,
      release: release2,
      removeAllListeners: removeAllListeners2,
      removeListener: removeListener2,
      report: report2,
      resourceUsage: resourceUsage2,
      setMaxListeners: setMaxListeners2,
      setSourceMapsEnabled: setSourceMapsEnabled2,
      stderr: stderr2,
      stdin: stdin2,
      stdout: stdout2,
      title: title2,
      throwDeprecation: throwDeprecation2,
      traceDeprecation: traceDeprecation2,
      umask: umask2,
      uptime: uptime2,
      version: version2,
      versions: versions2,
      domain: domain2,
      initgroups: initgroups2,
      moduleLoadList: moduleLoadList2,
      reallyExit: reallyExit2,
      openStdin: openStdin2,
      assert: assert22,
      binding: binding2,
      send: send2,
      exitCode: exitCode2,
      channel: channel2,
      getegid: getegid2,
      geteuid: geteuid2,
      getgid: getgid2,
      getgroups: getgroups2,
      getuid: getuid2,
      setegid: setegid2,
      seteuid: seteuid2,
      setgid: setgid2,
      setgroups: setgroups2,
      setuid: setuid2,
      permission: permission2,
      mainModule: mainModule2,
      _events: _events2,
      _eventsCount: _eventsCount2,
      _exiting: _exiting2,
      _maxListeners: _maxListeners2,
      _debugEnd: _debugEnd2,
      _debugProcess: _debugProcess2,
      _fatalException: _fatalException2,
      _getActiveHandles: _getActiveHandles2,
      _getActiveRequests: _getActiveRequests2,
      _kill: _kill2,
      _preload_modules: _preload_modules2,
      _rawDebug: _rawDebug2,
      _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
      _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
      _tickCallback: _tickCallback2,
      _disconnect: _disconnect2,
      _handleQueue: _handleQueue2,
      _pendingMessage: _pendingMessage2,
      _channel: _channel2,
      _send: _send2,
      _linkedBinding: _linkedBinding2
    } = unenvProcess2);
    _process2 = {
      abort: abort2,
      addListener: addListener2,
      allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
      hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
      setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
      loadEnvFile: loadEnvFile2,
      sourceMapsEnabled: sourceMapsEnabled2,
      arch: arch2,
      argv: argv2,
      argv0: argv02,
      chdir: chdir2,
      config: config2,
      connected: connected2,
      constrainedMemory: constrainedMemory2,
      availableMemory: availableMemory2,
      cpuUsage: cpuUsage2,
      cwd: cwd2,
      debugPort: debugPort2,
      dlopen: dlopen2,
      disconnect: disconnect2,
      emit: emit2,
      emitWarning: emitWarning2,
      env: env2,
      eventNames: eventNames2,
      execArgv: execArgv2,
      execPath: execPath2,
      exit: exit2,
      finalization: finalization2,
      features: features2,
      getBuiltinModule: getBuiltinModule2,
      getActiveResourcesInfo: getActiveResourcesInfo2,
      getMaxListeners: getMaxListeners2,
      hrtime: hrtime32,
      kill: kill2,
      listeners: listeners2,
      listenerCount: listenerCount2,
      memoryUsage: memoryUsage2,
      nextTick: nextTick2,
      on: on2,
      off: off2,
      once: once2,
      pid: pid2,
      platform: platform2,
      ppid: ppid2,
      prependListener: prependListener2,
      prependOnceListener: prependOnceListener2,
      rawListeners: rawListeners2,
      release: release2,
      removeAllListeners: removeAllListeners2,
      removeListener: removeListener2,
      report: report2,
      resourceUsage: resourceUsage2,
      setMaxListeners: setMaxListeners2,
      setSourceMapsEnabled: setSourceMapsEnabled2,
      stderr: stderr2,
      stdin: stdin2,
      stdout: stdout2,
      title: title2,
      throwDeprecation: throwDeprecation2,
      traceDeprecation: traceDeprecation2,
      umask: umask2,
      uptime: uptime2,
      version: version2,
      versions: versions2,
      // @ts-expect-error old API
      domain: domain2,
      initgroups: initgroups2,
      moduleLoadList: moduleLoadList2,
      reallyExit: reallyExit2,
      openStdin: openStdin2,
      assert: assert22,
      binding: binding2,
      send: send2,
      exitCode: exitCode2,
      channel: channel2,
      getegid: getegid2,
      geteuid: geteuid2,
      getgid: getgid2,
      getgroups: getgroups2,
      getuid: getuid2,
      setegid: setegid2,
      seteuid: seteuid2,
      setgid: setgid2,
      setgroups: setgroups2,
      setuid: setuid2,
      permission: permission2,
      mainModule: mainModule2,
      _events: _events2,
      _eventsCount: _eventsCount2,
      _exiting: _exiting2,
      _maxListeners: _maxListeners2,
      _debugEnd: _debugEnd2,
      _debugProcess: _debugProcess2,
      _fatalException: _fatalException2,
      _getActiveHandles: _getActiveHandles2,
      _getActiveRequests: _getActiveRequests2,
      _kill: _kill2,
      _preload_modules: _preload_modules2,
      _rawDebug: _rawDebug2,
      _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
      _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
      _tickCallback: _tickCallback2,
      _disconnect: _disconnect2,
      _handleQueue: _handleQueue2,
      _pendingMessage: _pendingMessage2,
      _channel: _channel2,
      _send: _send2,
      _linkedBinding: _linkedBinding2
    };
    process_default2 = _process2;
  }
});
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../../../../node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250412.0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default2;
  }
});
var kInit;
var kBefore;
var kAfter;
var kDestroy;
var kPromiseResolve;
var _AsyncHook;
var createHook;
var executionAsyncId;
var executionAsyncResource;
var triggerAsyncId;
var asyncWrapProviders;
var init_async_hook = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/internal/async_hooks/async-hook.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    kInit = /* @__PURE__ */ Symbol("init");
    kBefore = /* @__PURE__ */ Symbol("before");
    kAfter = /* @__PURE__ */ Symbol("after");
    kDestroy = /* @__PURE__ */ Symbol("destroy");
    kPromiseResolve = /* @__PURE__ */ Symbol("promiseResolve");
    _AsyncHook = class {
      static {
        __name(this, "_AsyncHook");
      }
      static {
        __name2(this, "_AsyncHook");
      }
      __unenv__ = true;
      _enabled = false;
      _callbacks = {};
      constructor(callbacks = {}) {
        this._callbacks = callbacks;
      }
      enable() {
        this._enabled = true;
        return this;
      }
      disable() {
        this._enabled = false;
        return this;
      }
      get [kInit]() {
        return this._callbacks.init;
      }
      get [kBefore]() {
        return this._callbacks.before;
      }
      get [kAfter]() {
        return this._callbacks.after;
      }
      get [kDestroy]() {
        return this._callbacks.destroy;
      }
      get [kPromiseResolve]() {
        return this._callbacks.promiseResolve;
      }
    };
    createHook = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function createHook2(callbacks) {
      const asyncHook = new _AsyncHook(callbacks);
      return asyncHook;
    }, "createHook2"), "createHook");
    executionAsyncId = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function executionAsyncId2() {
      return 0;
    }, "executionAsyncId2"), "executionAsyncId");
    executionAsyncResource = /* @__PURE__ */ __name2(function() {
      return /* @__PURE__ */ Object.create(null);
    }, "executionAsyncResource");
    triggerAsyncId = /* @__PURE__ */ __name2(function() {
      return 0;
    }, "triggerAsyncId");
    asyncWrapProviders = Object.assign(/* @__PURE__ */ Object.create(null), {
      NONE: 0,
      DIRHANDLE: 1,
      DNSCHANNEL: 2,
      ELDHISTOGRAM: 3,
      FILEHANDLE: 4,
      FILEHANDLECLOSEREQ: 5,
      BLOBREADER: 6,
      FSEVENTWRAP: 7,
      FSREQCALLBACK: 8,
      FSREQPROMISE: 9,
      GETADDRINFOREQWRAP: 10,
      GETNAMEINFOREQWRAP: 11,
      HEAPSNAPSHOT: 12,
      HTTP2SESSION: 13,
      HTTP2STREAM: 14,
      HTTP2PING: 15,
      HTTP2SETTINGS: 16,
      HTTPINCOMINGMESSAGE: 17,
      HTTPCLIENTREQUEST: 18,
      JSSTREAM: 19,
      JSUDPWRAP: 20,
      MESSAGEPORT: 21,
      PIPECONNECTWRAP: 22,
      PIPESERVERWRAP: 23,
      PIPEWRAP: 24,
      PROCESSWRAP: 25,
      PROMISE: 26,
      QUERYWRAP: 27,
      QUIC_ENDPOINT: 28,
      QUIC_LOGSTREAM: 29,
      QUIC_PACKET: 30,
      QUIC_SESSION: 31,
      QUIC_STREAM: 32,
      QUIC_UDP: 33,
      SHUTDOWNWRAP: 34,
      SIGNALWRAP: 35,
      STATWATCHER: 36,
      STREAMPIPE: 37,
      TCPCONNECTWRAP: 38,
      TCPSERVERWRAP: 39,
      TCPWRAP: 40,
      TTYWRAP: 41,
      UDPSENDWRAP: 42,
      UDPWRAP: 43,
      SIGINTWATCHDOG: 44,
      WORKER: 45,
      WORKERHEAPSNAPSHOT: 46,
      WRITEWRAP: 47,
      ZLIB: 48,
      CHECKPRIMEREQUEST: 49,
      PBKDF2REQUEST: 50,
      KEYPAIRGENREQUEST: 51,
      KEYGENREQUEST: 52,
      KEYEXPORTREQUEST: 53,
      CIPHERREQUEST: 54,
      DERIVEBITSREQUEST: 55,
      HASHREQUEST: 56,
      RANDOMBYTESREQUEST: 57,
      RANDOMPRIMEREQUEST: 58,
      SCRYPTREQUEST: 59,
      SIGNREQUEST: 60,
      TLSWRAP: 61,
      VERIFYREQUEST: 62
    });
  }
});
var init_async_hooks = __esm({
  "../../../../../node_modules/.pnpm/unenv@2.0.0-rc.15/node_modules/unenv/dist/runtime/node/async_hooks.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_async_hook();
  }
});
var async_hooks_exports = {};
__export(async_hooks_exports, {
  AsyncLocalStorage: /* @__PURE__ */ __name(() => AsyncLocalStorage, "AsyncLocalStorage"),
  AsyncResource: /* @__PURE__ */ __name(() => AsyncResource, "AsyncResource"),
  asyncWrapProviders: /* @__PURE__ */ __name(() => asyncWrapProviders, "asyncWrapProviders"),
  createHook: /* @__PURE__ */ __name(() => createHook, "createHook"),
  default: /* @__PURE__ */ __name(() => async_hooks_default, "default"),
  executionAsyncId: /* @__PURE__ */ __name(() => executionAsyncId, "executionAsyncId"),
  executionAsyncResource: /* @__PURE__ */ __name(() => executionAsyncResource, "executionAsyncResource"),
  triggerAsyncId: /* @__PURE__ */ __name(() => triggerAsyncId, "triggerAsyncId")
});
var workerdAsyncHooks;
var AsyncLocalStorage;
var AsyncResource;
var async_hooks_default;
var init_async_hooks2 = __esm({
  "../../../../../node_modules/.pnpm/@cloudflare+unenv-preset@2.3.1_unenv@2.0.0-rc.15_workerd@1.20250424.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/async_hooks.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_async_hooks();
    init_async_hooks();
    workerdAsyncHooks = process.getBuiltinModule("node:async_hooks");
    ({ AsyncLocalStorage, AsyncResource } = workerdAsyncHooks);
    async_hooks_default = {
      /**
       * manually unroll unenv-polyfilled-symbols to make it tree-shakeable
       */
      // @ts-expect-error @types/node is missing this one - this is a bug in typings
      asyncWrapProviders,
      createHook,
      executionAsyncId,
      executionAsyncResource,
      triggerAsyncId,
      /**
       * manually unroll workerd-polyfilled-symbols to make it tree-shakeable
       */
      AsyncLocalStorage,
      AsyncResource
    };
  }
});
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
import("node:buffer").then(({ Buffer: Buffer2 }) => {
  globalThis.Buffer = Buffer2;
}).catch(() => null);
var __ALSes_PROMISE__ = Promise.resolve().then(() => (init_async_hooks2(), async_hooks_exports)).then(({ AsyncLocalStorage: AsyncLocalStorage2 }) => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage2;
  const envAsyncLocalStorage = new AsyncLocalStorage2();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage2();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: /* @__PURE__ */ __name2(() => Reflect.ownKeys(envAsyncLocalStorage.getStore()), "ownKeys"),
        getOwnPropertyDescriptor: /* @__PURE__ */ __name2((_2, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
        get: /* @__PURE__ */ __name2((_2, property) => Reflect.get(envAsyncLocalStorage.getStore(), property), "get"),
        set: /* @__PURE__ */ __name2((_2, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value), "set")
      }
    )
  };
  globalThis[Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: /* @__PURE__ */ __name2(() => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()), "ownKeys"),
      getOwnPropertyDescriptor: /* @__PURE__ */ __name2((_2, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
      get: /* @__PURE__ */ __name2((_2, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property), "get"),
      set: /* @__PURE__ */ __name2((_2, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value), "set")
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var ae = Object.create;
var U = Object.defineProperty;
var re = Object.getOwnPropertyDescriptor;
var ne = Object.getOwnPropertyNames;
var ie = Object.getPrototypeOf;
var oe = Object.prototype.hasOwnProperty;
var T = /* @__PURE__ */ __name2((e, t) => () => (e && (t = e(e = 0)), t), "T");
var z = /* @__PURE__ */ __name2((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "z");
var ce = /* @__PURE__ */ __name2((e, t, a, s) => {
  if (t && typeof t == "object" || typeof t == "function") for (let n of ne(t)) !oe.call(e, n) && n !== a && U(e, n, { get: /* @__PURE__ */ __name2(() => t[n], "get"), enumerable: !(s = re(t, n)) || s.enumerable });
  return e;
}, "ce");
var V = /* @__PURE__ */ __name2((e, t, a) => (a = e != null ? ae(ie(e)) : {}, ce(t || !e || !e.__esModule ? U(a, "default", { value: e, enumerable: true }) : a, e)), "V");
var m;
var l = T(() => {
  m = { collectedLocales: [] };
});
var g;
var p = T(() => {
  g = { version: 3, routes: { none: [{ src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true }, { src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308 }], filesystem: [{ src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/_next/data/(.*)$", status: 404 }], miss: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media)/.+$", status: 404, check: true, dest: "$0" }], rewrite: [], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|qhBNtxBQJhZ8dEX2Pq5VO)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }], error: [{ status: 404, src: "^.*$", dest: "/404" }] }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "auth/google/callback.html": { path: "auth/google/callback", contentType: "text/html; charset=utf-8" }, "index.html": { path: "index", contentType: "text/html; charset=utf-8" }, "login.html": { path: "login", contentType: "text/html; charset=utf-8" }, "steps/diet-preferences.html": { path: "steps/diet-preferences", contentType: "text/html; charset=utf-8" }, "steps/goal-preference.html": { path: "steps/goal-preference", contentType: "text/html; charset=utf-8" }, "steps/personal-goals.html": { path: "steps/personal-goals", contentType: "text/html; charset=utf-8" }, "steps/plan.html": { path: "steps/plan", contentType: "text/html; charset=utf-8" }, "steps/summary.html": { path: "steps/summary", contentType: "text/html; charset=utf-8" } }, framework: { version: "15.2.4" }, crons: [] };
});
var f;
var u = T(() => {
  f = { "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_next/static/chunks/0574ad49-c6b0d558fbb99499.js": { type: "static" }, "/_next/static/chunks/201-5fecb606931d742a.js": { type: "static" }, "/_next/static/chunks/211-30f47e2505f86e88.js": { type: "static" }, "/_next/static/chunks/237-c861905b47f423d7.js": { type: "static" }, "/_next/static/chunks/251-89c978ba955735cb.js": { type: "static" }, "/_next/static/chunks/347-2986a99c3ffef823.js": { type: "static" }, "/_next/static/chunks/370-6afa6fe7f4270065.js": { type: "static" }, "/_next/static/chunks/999-e2d2a4ef40b14873.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-e326747a6bd425e3.js": { type: "static" }, "/_next/static/chunks/app/api/generateMealPlan/route-123f6be770a87c76.js": { type: "static" }, "/_next/static/chunks/app/auth/google/callback/page-f16d2bdb3744437a.js": { type: "static" }, "/_next/static/chunks/app/layout-1801473238d56372.js": { type: "static" }, "/_next/static/chunks/app/login/page-24c25b4960397668.js": { type: "static" }, "/_next/static/chunks/app/page-84b7783c197707eb.js": { type: "static" }, "/_next/static/chunks/app/steps/diet-preferences/page-3763c4ac10697ad4.js": { type: "static" }, "/_next/static/chunks/app/steps/goal-preference/page-433afbb878acfd0f.js": { type: "static" }, "/_next/static/chunks/app/steps/layout-487dc2ed0d3dc16a.js": { type: "static" }, "/_next/static/chunks/app/steps/personal-goals/page-76ced3d33bf6d22f.js": { type: "static" }, "/_next/static/chunks/app/steps/plan/page-aef497746cb9cb72.js": { type: "static" }, "/_next/static/chunks/app/steps/summary/page-afdd18e8295d31ad.js": { type: "static" }, "/_next/static/chunks/bc5e0e84-fd7b83d8b61d8994.js": { type: "static" }, "/_next/static/chunks/framework-0ebd2f904ba1aed0.js": { type: "static" }, "/_next/static/chunks/main-ae8a236f2dd978d8.js": { type: "static" }, "/_next/static/chunks/main-app-6655453adf219005.js": { type: "static" }, "/_next/static/chunks/pages/_app-33f434b85ff59653.js": { type: "static" }, "/_next/static/chunks/pages/_error-8053571a9896b150.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-a1799575740c91ce.js": { type: "static" }, "/_next/static/css/a5b506c2905af581.css": { type: "static" }, "/_next/static/media/26a46d62cd723877-s.woff2": { type: "static" }, "/_next/static/media/55c55f0601d81cf3-s.woff2": { type: "static" }, "/_next/static/media/581909926a08bbc8-s.woff2": { type: "static" }, "/_next/static/media/6d93bde91c0c2823-s.woff2": { type: "static" }, "/_next/static/media/97e0cb1ae144a2a9-s.woff2": { type: "static" }, "/_next/static/media/a34f9d1faa5f3315-s.p.woff2": { type: "static" }, "/_next/static/media/df0a9ae256c0569c-s.woff2": { type: "static" }, "/_next/static/qhBNtxBQJhZ8dEX2Pq5VO/_buildManifest.js": { type: "static" }, "/_next/static/qhBNtxBQJhZ8dEX2Pq5VO/_ssgManifest.js": { type: "static" }, "/android/android-launchericon-144-144.png": { type: "static" }, "/android/android-launchericon-192-192.png": { type: "static" }, "/android/android-launchericon-48-48.png": { type: "static" }, "/android/android-launchericon-512-512.png": { type: "static" }, "/android/android-launchericon-72-72.png": { type: "static" }, "/android/android-launchericon-96-96.png": { type: "static" }, "/auth/google/callback.html": { type: "override", path: "/auth/google/callback.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/auth/google/callback.txt": { type: "static" }, "/favicon.ico": { type: "static" }, "/index.html": { type: "override", path: "/index.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/index.txt": { type: "static" }, "/ios/100.png": { type: "static" }, "/ios/1024.png": { type: "static" }, "/ios/114.png": { type: "static" }, "/ios/120.png": { type: "static" }, "/ios/128.png": { type: "static" }, "/ios/144.png": { type: "static" }, "/ios/152.png": { type: "static" }, "/ios/16.png": { type: "static" }, "/ios/167.png": { type: "static" }, "/ios/180.png": { type: "static" }, "/ios/192.png": { type: "static" }, "/ios/20.png": { type: "static" }, "/ios/256.png": { type: "static" }, "/ios/29.png": { type: "static" }, "/ios/32.png": { type: "static" }, "/ios/40.png": { type: "static" }, "/ios/50.png": { type: "static" }, "/ios/512.png": { type: "static" }, "/ios/57.png": { type: "static" }, "/ios/58.png": { type: "static" }, "/ios/60.png": { type: "static" }, "/ios/64.png": { type: "static" }, "/ios/72.png": { type: "static" }, "/ios/76.png": { type: "static" }, "/ios/80.png": { type: "static" }, "/ios/87.png": { type: "static" }, "/login.html": { type: "override", path: "/login.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/login.txt": { type: "static" }, "/logo.png": { type: "static" }, "/manifest.json": { type: "static" }, "/placeholder-logo.png": { type: "static" }, "/placeholder-logo.svg": { type: "static" }, "/placeholder-user.jpg": { type: "static" }, "/placeholder.jpg": { type: "static" }, "/placeholder.svg": { type: "static" }, "/steps/diet-preferences.html": { type: "override", path: "/steps/diet-preferences.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/steps/diet-preferences.txt": { type: "static" }, "/steps/goal-preference.html": { type: "override", path: "/steps/goal-preference.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/steps/goal-preference.txt": { type: "static" }, "/steps/personal-goals.html": { type: "override", path: "/steps/personal-goals.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/steps/personal-goals.txt": { type: "static" }, "/steps/plan.html": { type: "override", path: "/steps/plan.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/steps/plan.txt": { type: "static" }, "/steps/summary.html": { type: "override", path: "/steps/summary.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/steps/summary.txt": { type: "static" }, "/sw.js": { type: "static" }, "/windows11/LargeTile.scale-100.png": { type: "static" }, "/windows11/LargeTile.scale-125.png": { type: "static" }, "/windows11/LargeTile.scale-150.png": { type: "static" }, "/windows11/LargeTile.scale-200.png": { type: "static" }, "/windows11/LargeTile.scale-400.png": { type: "static" }, "/windows11/SmallTile.scale-100.png": { type: "static" }, "/windows11/SmallTile.scale-125.png": { type: "static" }, "/windows11/SmallTile.scale-150.png": { type: "static" }, "/windows11/SmallTile.scale-200.png": { type: "static" }, "/windows11/SmallTile.scale-400.png": { type: "static" }, "/windows11/SplashScreen.scale-100.png": { type: "static" }, "/windows11/SplashScreen.scale-125.png": { type: "static" }, "/windows11/SplashScreen.scale-150.png": { type: "static" }, "/windows11/SplashScreen.scale-200.png": { type: "static" }, "/windows11/SplashScreen.scale-400.png": { type: "static" }, "/windows11/Square150x150Logo.scale-100.png": { type: "static" }, "/windows11/Square150x150Logo.scale-125.png": { type: "static" }, "/windows11/Square150x150Logo.scale-150.png": { type: "static" }, "/windows11/Square150x150Logo.scale-200.png": { type: "static" }, "/windows11/Square150x150Logo.scale-400.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png": { type: "static" }, "/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-16.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-20.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-24.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-256.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-30.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-32.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-36.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-40.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-44.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-48.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-60.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-64.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-72.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-80.png": { type: "static" }, "/windows11/Square44x44Logo.altform-unplated_targetsize-96.png": { type: "static" }, "/windows11/Square44x44Logo.scale-100.png": { type: "static" }, "/windows11/Square44x44Logo.scale-125.png": { type: "static" }, "/windows11/Square44x44Logo.scale-150.png": { type: "static" }, "/windows11/Square44x44Logo.scale-200.png": { type: "static" }, "/windows11/Square44x44Logo.scale-400.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-16.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-20.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-24.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-256.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-30.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-32.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-36.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-40.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-44.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-48.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-60.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-64.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-72.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-80.png": { type: "static" }, "/windows11/Square44x44Logo.targetsize-96.png": { type: "static" }, "/windows11/StoreLogo.scale-100.png": { type: "static" }, "/windows11/StoreLogo.scale-125.png": { type: "static" }, "/windows11/StoreLogo.scale-150.png": { type: "static" }, "/windows11/StoreLogo.scale-200.png": { type: "static" }, "/windows11/StoreLogo.scale-400.png": { type: "static" }, "/windows11/Wide310x150Logo.scale-100.png": { type: "static" }, "/windows11/Wide310x150Logo.scale-125.png": { type: "static" }, "/windows11/Wide310x150Logo.scale-150.png": { type: "static" }, "/windows11/Wide310x150Logo.scale-200.png": { type: "static" }, "/windows11/Wide310x150Logo.scale-400.png": { type: "static" }, "/workbox-01fd22c6.js": { type: "static" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/auth/google/callback": { type: "override", path: "/auth/google/callback.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/index": { type: "override", path: "/index.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/": { type: "override", path: "/index.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/login": { type: "override", path: "/login.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/steps/diet-preferences": { type: "override", path: "/steps/diet-preferences.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/steps/goal-preference": { type: "override", path: "/steps/goal-preference.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/steps/personal-goals": { type: "override", path: "/steps/personal-goals.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/steps/plan": { type: "override", path: "/steps/plan.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/steps/summary": { type: "override", path: "/steps/summary.html", headers: { "content-type": "text/html; charset=utf-8" } } };
});
var $ = z((Ke, j) => {
  "use strict";
  l();
  p();
  u();
  function S(e, t) {
    e = String(e || "").trim();
    let a = e, s, n = "";
    if (/^[^a-zA-Z\\\s]/.test(e)) {
      s = e[0];
      let o = e.lastIndexOf(s);
      n += e.substring(o + 1), e = e.substring(1, o);
    }
    let r = 0;
    return e = ue(e, (o) => {
      if (/^\(\?[P<']/.test(o)) {
        let c = /^\(\?P?[<']([^>']+)[>']/.exec(o);
        if (!c) throw new Error(`Failed to extract named captures from ${JSON.stringify(o)}`);
        let d = o.substring(c[0].length, o.length - 1);
        return t && (t[r] = c[1]), r++, `(${d})`;
      }
      return o.substring(0, 3) === "(?:" || r++, o;
    }), e = e.replace(/\[:([^:]+):\]/g, (o, c) => S.characterClasses[c] || o), new S.PCRE(e, n, a, n, s);
  }
  __name(S, "S");
  __name2(S, "S");
  function ue(e, t) {
    let a = 0, s = 0, n = false;
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      if (n) {
        n = false;
        continue;
      }
      switch (r) {
        case "(":
          s === 0 && (a = i), s++;
          break;
        case ")":
          if (s > 0 && (s--, s === 0)) {
            let o = i + 1, c = a === 0 ? "" : e.substring(0, a), d = e.substring(o), h = String(t(e.substring(a, o)));
            e = c + h + d, i = a;
          }
          break;
        case "\\":
          n = true;
          break;
        default:
          break;
      }
    }
    return e;
  }
  __name(ue, "ue");
  __name2(ue, "ue");
  (function(e) {
    class t extends RegExp {
      static {
        __name(this, "t");
      }
      static {
        __name2(this, "t");
      }
      constructor(s, n, i, r, o) {
        super(s, n), this.pcrePattern = i, this.pcreFlags = r, this.delimiter = o;
      }
    }
    e.PCRE = t, e.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(S || (S = {}));
  S.prototype = S.PCRE.prototype;
  j.exports = S;
});
var Q = z((H) => {
  "use strict";
  l();
  p();
  u();
  H.parse = _e;
  H.serialize = Pe;
  var be = Object.prototype.toString, E = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function _e(e, t) {
    if (typeof e != "string") throw new TypeError("argument str must be a string");
    for (var a = {}, s = t || {}, n = s.decode || ve, i = 0; i < e.length; ) {
      var r = e.indexOf("=", i);
      if (r === -1) break;
      var o = e.indexOf(";", i);
      if (o === -1) o = e.length;
      else if (o < r) {
        i = e.lastIndexOf(";", r - 1) + 1;
        continue;
      }
      var c = e.slice(i, r).trim();
      if (a[c] === void 0) {
        var d = e.slice(r + 1, o).trim();
        d.charCodeAt(0) === 34 && (d = d.slice(1, -1)), a[c] = Ce(d, n);
      }
      i = o + 1;
    }
    return a;
  }
  __name(_e, "_e");
  __name2(_e, "_e");
  function Pe(e, t, a) {
    var s = a || {}, n = s.encode || Le;
    if (typeof n != "function") throw new TypeError("option encode is invalid");
    if (!E.test(e)) throw new TypeError("argument name is invalid");
    var i = n(t);
    if (i && !E.test(i)) throw new TypeError("argument val is invalid");
    var r = e + "=" + i;
    if (s.maxAge != null) {
      var o = s.maxAge - 0;
      if (isNaN(o) || !isFinite(o)) throw new TypeError("option maxAge is invalid");
      r += "; Max-Age=" + Math.floor(o);
    }
    if (s.domain) {
      if (!E.test(s.domain)) throw new TypeError("option domain is invalid");
      r += "; Domain=" + s.domain;
    }
    if (s.path) {
      if (!E.test(s.path)) throw new TypeError("option path is invalid");
      r += "; Path=" + s.path;
    }
    if (s.expires) {
      var c = s.expires;
      if (!ke(c) || isNaN(c.valueOf())) throw new TypeError("option expires is invalid");
      r += "; Expires=" + c.toUTCString();
    }
    if (s.httpOnly && (r += "; HttpOnly"), s.secure && (r += "; Secure"), s.priority) {
      var d = typeof s.priority == "string" ? s.priority.toLowerCase() : s.priority;
      switch (d) {
        case "low":
          r += "; Priority=Low";
          break;
        case "medium":
          r += "; Priority=Medium";
          break;
        case "high":
          r += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (s.sameSite) {
      var h = typeof s.sameSite == "string" ? s.sameSite.toLowerCase() : s.sameSite;
      switch (h) {
        case true:
          r += "; SameSite=Strict";
          break;
        case "lax":
          r += "; SameSite=Lax";
          break;
        case "strict":
          r += "; SameSite=Strict";
          break;
        case "none":
          r += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return r;
  }
  __name(Pe, "Pe");
  __name2(Pe, "Pe");
  function ve(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(ve, "ve");
  __name2(ve, "ve");
  function Le(e) {
    return encodeURIComponent(e);
  }
  __name(Le, "Le");
  __name2(Le, "Le");
  function ke(e) {
    return be.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(ke, "ke");
  __name2(ke, "ke");
  function Ce(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(Ce, "Ce");
  __name2(Ce, "Ce");
});
l();
p();
u();
l();
p();
u();
l();
p();
u();
var b = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
l();
p();
u();
l();
p();
u();
l();
p();
u();
l();
p();
u();
var F = V($());
function L(e, t, a) {
  if (t == null) return { match: null, captureGroupKeys: [] };
  let s = a ? "" : "i", n = [];
  return { match: (0, F.default)(`%${e}%${s}`, n).exec(t), captureGroupKeys: n };
}
__name(L, "L");
__name2(L, "L");
function _(e, t, a, { namedOnly: s } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (n, i) => {
    let r = a.indexOf(i);
    return s && r === -1 ? n : (r === -1 ? t[parseInt(i, 10)] : t[r + 1]) || "";
  });
}
__name(_, "_");
__name2(_, "_");
function I(e, { url: t, cookies: a, headers: s, routeDest: n }) {
  switch (e.type) {
    case "host":
      return { valid: t.hostname === e.value };
    case "header":
      return e.value !== void 0 ? M(e.value, s.get(e.key), n) : { valid: s.has(e.key) };
    case "cookie": {
      let i = a[e.key];
      return i && e.value !== void 0 ? M(e.value, i, n) : { valid: i !== void 0 };
    }
    case "query":
      return e.value !== void 0 ? M(e.value, t.searchParams.get(e.key), n) : { valid: t.searchParams.has(e.key) };
  }
}
__name(I, "I");
__name2(I, "I");
function M(e, t, a) {
  let { match: s, captureGroupKeys: n } = L(e, t);
  return a && s && n.length ? { valid: !!s, newRouteDest: _(a, s, n, { namedOnly: true }) } : { valid: !!s };
}
__name(M, "M");
__name2(M, "M");
l();
p();
u();
function D(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", b), new Request(e, { headers: t });
}
__name(D, "D");
__name2(D, "D");
l();
p();
u();
function w(e, t, a) {
  let s = t instanceof Headers ? t.entries() : Object.entries(t);
  for (let [n, i] of s) {
    let r = n.toLowerCase(), o = a?.match ? _(i, a.match, a.captureGroupKeys) : i;
    r === "set-cookie" ? e.append(r, o) : e.set(r, o);
  }
}
__name(w, "w");
__name2(w, "w");
function P(e) {
  return /^https?:\/\//.test(e);
}
__name(P, "P");
__name2(P, "P");
function x(e, t) {
  for (let [a, s] of t.entries()) {
    let n = /^nxtP(.+)$/.exec(a), i = /^nxtI(.+)$/.exec(a);
    n?.[1] ? (e.set(a, s), e.set(n[1], s)) : i?.[1] ? e.set(i[1], s.replace(/(\(\.+\))+/, "")) : (!e.has(a) || !!s && !e.getAll(a).includes(s)) && e.append(a, s);
  }
}
__name(x, "x");
__name2(x, "x");
function A(e, t) {
  let a = new URL(t, e.url);
  return x(a.searchParams, new URL(e.url).searchParams), a.pathname = a.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(a, e);
}
__name(A, "A");
__name2(A, "A");
function v(e) {
  return new Response(e.body, e);
}
__name(v, "v");
__name2(v, "v");
function O(e) {
  return e.split(",").map((t) => {
    let [a, s] = t.split(";"), n = parseFloat((s ?? "q=1").replace(/q *= */gi, ""));
    return [a.trim(), isNaN(n) ? 1 : n];
  }).sort((t, a) => a[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(O, "O");
__name2(O, "O");
l();
p();
u();
function N(e) {
  switch (e) {
    case "none":
      return "filesystem";
    case "filesystem":
      return "rewrite";
    case "rewrite":
      return "resource";
    case "resource":
      return "miss";
    default:
      return "miss";
  }
}
__name(N, "N");
__name2(N, "N");
async function k(e, { request: t, assetsFetcher: a, ctx: s }, { path: n, searchParams: i }) {
  let r, o = new URL(t.url);
  x(o.searchParams, i);
  let c = new Request(o, t);
  try {
    switch (e?.type) {
      case "function":
      case "middleware": {
        let d = await import(e.entrypoint);
        try {
          r = await d.default(c, s);
        } catch (h) {
          let y = h;
          throw y.name === "TypeError" && y.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${e.entrypoint})`) : h;
        }
        break;
      }
      case "override": {
        r = v(await a.fetch(A(c, e.path ?? n))), e.headers && w(r.headers, e.headers);
        break;
      }
      case "static": {
        r = await a.fetch(A(c, n));
        break;
      }
      default:
        r = new Response("Not Found", { status: 404 });
    }
  } catch (d) {
    return console.error(d), new Response("Internal Server Error", { status: 500 });
  }
  return v(r);
}
__name(k, "k");
__name2(k, "k");
function B(e, t) {
  let a = "^//?(?:", s = ")/(.*)$";
  return !e.startsWith(a) || !e.endsWith(s) ? false : e.slice(a.length, -s.length).split("|").every((i) => t.has(i));
}
__name(B, "B");
__name2(B, "B");
l();
p();
u();
function de(e, { protocol: t, hostname: a, port: s, pathname: n }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(a).test(e.hostname) || s && !new RegExp(s).test(e.port) || n && !new RegExp(n).test(e.pathname));
}
__name(de, "de");
__name2(de, "de");
function he(e, t) {
  if (e.method !== "GET") return;
  let { origin: a, searchParams: s } = new URL(e.url), n = s.get("url"), i = Number.parseInt(s.get("w") ?? "", 10), r = Number.parseInt(s.get("q") ?? "75", 10);
  if (!n || Number.isNaN(i) || Number.isNaN(r) || !t?.sizes?.includes(i) || r < 0 || r > 100) return;
  let o = new URL(n, a);
  if (o.pathname.endsWith(".svg") && !t?.dangerouslyAllowSVG) return;
  let c = n.startsWith("//"), d = n.startsWith("/") && !c;
  if (!d && !t?.domains?.includes(o.hostname) && !t?.remotePatterns?.find((R) => de(o, R))) return;
  let h = e.headers.get("Accept") ?? "", y = t?.formats?.find((R) => h.includes(R))?.replace("image/", "");
  return { isRelative: d, imageUrl: o, options: { width: i, quality: r, format: y } };
}
__name(he, "he");
__name2(he, "he");
function ge(e, t, a) {
  let s = new Headers();
  if (a?.contentSecurityPolicy && s.set("Content-Security-Policy", a.contentSecurityPolicy), a?.contentDispositionType) {
    let i = t.pathname.split("/").pop(), r = i ? `${a.contentDispositionType}; filename="${i}"` : a.contentDispositionType;
    s.set("Content-Disposition", r);
  }
  e.headers.has("Cache-Control") || s.set("Cache-Control", `public, max-age=${a?.minimumCacheTTL ?? 60}`);
  let n = v(e);
  return w(n.headers, s), n;
}
__name(ge, "ge");
__name2(ge, "ge");
async function W(e, { buildOutput: t, assetsFetcher: a, imagesConfig: s }) {
  let n = he(e, s);
  if (!n) return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: i, imageUrl: r } = n, c = await (i && r.pathname in t ? a.fetch.bind(a) : fetch)(r);
  return ge(c, r, s);
}
__name(W, "W");
__name2(W, "W");
l();
p();
u();
l();
p();
u();
l();
p();
u();
async function C(e) {
  return import(e);
}
__name(C, "C");
__name2(C, "C");
var fe = "x-vercel-cache-tags";
var me = "x-next-cache-soft-tags";
var ye = Symbol.for("__cloudflare-request-context__");
async function J(e) {
  let t = `https://${b}/v1/suspense-cache/`;
  if (!e.url.startsWith(t)) return null;
  try {
    let a = new URL(e.url), s = await we();
    if (a.pathname === "/v1/suspense-cache/revalidate") {
      let i = a.searchParams.get("tags")?.split(",") ?? [];
      for (let r of i) await s.revalidateTag(r);
      return new Response(null, { status: 200 });
    }
    let n = a.pathname.replace("/v1/suspense-cache/", "");
    if (!n.length) return new Response("Invalid cache key", { status: 400 });
    switch (e.method) {
      case "GET": {
        let i = K(e, me), r = await s.get(n, { softTags: i });
        return r ? new Response(JSON.stringify(r.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (r.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let i = globalThis[ye], r = /* @__PURE__ */ __name2(async () => {
          let o = await e.json();
          o.data.tags === void 0 && (o.tags ??= K(e, fe) ?? []), await s.set(n, o);
        }, "r");
        return i ? i.ctx.waitUntil(r()) : await r(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (a) {
    return console.error(a), new Response("Error handling cache request", { status: 500 });
  }
}
__name(J, "J");
__name2(J, "J");
async function we() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? G("kv") : G("cache-api");
}
__name(we, "we");
__name2(we, "we");
async function G(e) {
  let t = `./__next-on-pages-dist__/cache/${e}.js`, a = await C(t);
  return new a.default();
}
__name(G, "G");
__name2(G, "G");
function K(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(K, "K");
__name2(K, "K");
function X() {
  globalThis[Z] || (xe(), globalThis[Z] = true);
}
__name(X, "X");
__name2(X, "X");
function xe() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let a = new Request(...t), s = await Se(a);
    return s || (s = await J(a), s) ? s : (Re(a), e(a));
  };
}
__name(xe, "xe");
__name2(xe, "xe");
async function Se(e) {
  if (e.url.startsWith("blob:")) try {
    let a = `./__next-on-pages-dist__/assets/${new URL(e.url).pathname}.bin`, s = (await C(a)).default, n = { async arrayBuffer() {
      return s;
    }, get body() {
      return new ReadableStream({ start(i) {
        let r = Buffer.from(s);
        i.enqueue(r), i.close();
      } });
    }, async text() {
      return Buffer.from(s).toString();
    }, async json() {
      let i = Buffer.from(s);
      return JSON.stringify(i.toString());
    }, async blob() {
      return new Blob(s);
    } };
    return n.clone = () => ({ ...n }), n;
  } catch {
  }
  return null;
}
__name(Se, "Se");
__name2(Se, "Se");
function Re(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(Re, "Re");
__name2(Re, "Re");
var Z = Symbol.for("next-on-pages fetch patch");
l();
p();
u();
var Y = V(Q());
var q = class {
  static {
    __name(this, "q");
  }
  static {
    __name2(this, "q");
  }
  constructor(t, a, s, n, i) {
    this.routes = t;
    this.output = a;
    this.reqCtx = s;
    this.url = new URL(s.request.url), this.cookies = (0, Y.parse)(s.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), x(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = i?.find((r) => r.domain === this.url.hostname), this.locales = new Set(n.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(t, { checkStatus: a, checkIntercept: s }) {
    let n = L(t.src, this.path, t.caseSensitive);
    if (!n.match || t.methods && !t.methods.map((r) => r.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase())) return;
    let i = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: t.dest };
    if (!t.has?.find((r) => {
      let o = I(r, i);
      return o.newRouteDest && (i.routeDest = o.newRouteDest), !o.valid;
    }) && !t.missing?.find((r) => I(r, i).valid) && !(a && t.status !== this.status)) {
      if (s && t.dest) {
        let r = /\/(\(\.+\))+/, o = r.test(t.dest), c = r.test(this.path);
        if (o && !c) return;
      }
      return { routeMatch: n, routeDest: i.routeDest };
    }
  }
  processMiddlewareResp(t) {
    let a = "x-middleware-override-headers", s = t.headers.get(a);
    if (s) {
      let c = new Set(s.split(",").map((d) => d.trim()));
      for (let d of c.keys()) {
        let h = `x-middleware-request-${d}`, y = t.headers.get(h);
        this.reqCtx.request.headers.get(d) !== y && (y ? this.reqCtx.request.headers.set(d, y) : this.reqCtx.request.headers.delete(d)), t.headers.delete(h);
      }
      t.headers.delete(a);
    }
    let n = "x-middleware-rewrite", i = t.headers.get(n);
    if (i) {
      let c = new URL(i, this.url), d = this.url.hostname !== c.hostname;
      this.path = d ? `${c}` : c.pathname, x(this.searchParams, c.searchParams), t.headers.delete(n);
    }
    let r = "x-middleware-next";
    t.headers.get(r) ? t.headers.delete(r) : !i && !t.headers.has("location") ? (this.body = t.body, this.status = t.status) : t.headers.has("location") && t.status >= 300 && t.status < 400 && (this.status = t.status), w(this.reqCtx.request.headers, t.headers), w(this.headers.normal, t.headers), this.headers.middlewareLocation = t.headers.get("location");
  }
  async runRouteMiddleware(t) {
    if (!t) return true;
    let a = t && this.output[t];
    if (!a || a.type !== "middleware") return this.status = 500, false;
    let s = await k(a, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(t), s.status === 500 ? (this.status = s.status, false) : (this.processMiddlewareResp(s), true);
  }
  applyRouteOverrides(t) {
    !t.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(t, a, s) {
    !t.headers || (w(this.headers.normal, t.headers, { match: a, captureGroupKeys: s }), t.important && w(this.headers.important, t.headers, { match: a, captureGroupKeys: s }));
  }
  applyRouteStatus(t) {
    !t.status || (this.status = t.status);
  }
  applyRouteDest(t, a, s) {
    if (!t.dest) return this.path;
    let n = this.path, i = t.dest;
    this.wildcardMatch && /\$wildcard/.test(i) && (i = i.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = _(i, a, s);
    let r = /\/index\.rsc$/i.test(this.path), o = /^\/(?:index)?$/i.test(n), c = /^\/__index\.prefetch\.rsc$/i.test(n);
    r && !o && !c && (this.path = n);
    let d = /\.rsc$/i.test(this.path), h = /\.prefetch\.rsc$/i.test(this.path), y = this.path in this.output;
    d && !h && !y && (this.path = this.path.replace(/\.rsc/i, ""));
    let R = new URL(this.path, this.url);
    return x(this.searchParams, R.searchParams), P(this.path) || (this.path = R.pathname), n;
  }
  applyLocaleRedirects(t) {
    if (!t.locale?.redirect || !/^\^(.)*$/.test(t.src) && t.src !== this.path || this.headers.normal.has("location")) return;
    let { locale: { redirect: s, cookie: n } } = t, i = n && this.cookies[n], r = O(i ?? ""), o = O(this.reqCtx.request.headers.get("accept-language") ?? ""), h = [...r, ...o].map((y) => s[y]).filter(Boolean)[0];
    if (h) {
      !this.path.startsWith(h) && (this.headers.normal.set("location", h), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(t, a) {
    return !this.locales || a !== "miss" ? t : B(t.src, this.locales) ? { ...t, src: t.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : t;
  }
  async checkRoute(t, a) {
    let s = this.getLocaleFriendlyRoute(a, t), { routeMatch: n, routeDest: i } = this.checkRouteMatch(s, { checkStatus: t === "error", checkIntercept: t === "rewrite" }) ?? {}, r = { ...s, dest: i };
    if (!n?.match || r.middlewarePath && this.middlewareInvoked.includes(r.middlewarePath)) return "skip";
    let { match: o, captureGroupKeys: c } = n;
    if (this.applyRouteOverrides(r), this.applyLocaleRedirects(r), !await this.runRouteMiddleware(r.middlewarePath)) return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation) return "done";
    this.applyRouteHeaders(r, o, c), this.applyRouteStatus(r);
    let h = this.applyRouteDest(r, o, c);
    if (r.check && !P(this.path)) if (h === this.path) {
      if (t !== "miss") return this.checkPhase(N(t));
      this.status = 404;
    } else if (t === "miss") {
      if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output)) return this.checkPhase("filesystem");
      this.status === 404 && (this.status = void 0);
    } else return this.checkPhase("none");
    return !r.continue || r.status && r.status >= 300 && r.status <= 399 ? "done" : "next";
  }
  async checkPhase(t) {
    if (this.checkPhaseCounter++ >= 50) return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let a = true;
    for (let i of this.routes[t]) {
      let r = await this.checkRoute(t, i);
      if (r === "error") return "error";
      if (r === "done") {
        a = false;
        break;
      }
    }
    if (t === "hit" || P(this.path) || this.headers.normal.has("location") || !!this.body) return "done";
    if (t === "none") for (let i of this.locales) {
      let r = new RegExp(`/${i}(/.*)`), c = this.path.match(r)?.[1];
      if (c && c in this.output) {
        this.path = c;
        break;
      }
    }
    let s = this.path in this.output;
    if (!s && this.path.endsWith("/")) {
      let i = this.path.replace(/\/$/, "");
      s = i in this.output, s && (this.path = i);
    }
    if (t === "miss" && !s) {
      let i = !this.status || this.status < 400;
      this.status = i ? 404 : this.status;
    }
    let n = "miss";
    return s || t === "miss" || t === "error" ? n = "hit" : a && (n = N(t)), this.checkPhase(n);
  }
  async run(t = "none") {
    this.checkPhaseCounter = 0;
    let a = await this.checkPhase(t);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), a;
  }
};
async function ee(e, t, a, s) {
  let n = new q(t.routes, a, e, s, t.wildcard), i = await te(n);
  return Ee(e, i, a);
}
__name(ee, "ee");
__name2(ee, "ee");
async function te(e, t = "none", a = false) {
  return await e.run(t) === "error" || !a && e.status && e.status >= 400 ? te(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(te, "te");
__name2(te, "te");
async function Ee(e, { path: t = "/404", status: a, headers: s, searchParams: n, body: i }, r) {
  let o = s.normal.get("location");
  if (o) {
    if (o !== s.middlewareLocation) {
      let h = [...n.keys()].length ? `?${n.toString()}` : "";
      s.normal.set("location", `${o ?? "/"}${h}`);
    }
    return new Response(null, { status: a, headers: s.normal });
  }
  let c;
  if (i !== void 0) c = new Response(i, { status: a });
  else if (P(t)) {
    let h = new URL(t);
    x(h.searchParams, n), c = await fetch(h, e.request);
  } else c = await k(r[t], e, { path: t, status: a, headers: s, searchParams: n });
  let d = s.normal;
  return w(d, c.headers), w(d, s.important), c = new Response(c.body, { ...c, status: a || c.status, headers: d }), c;
}
__name(Ee, "Ee");
__name2(Ee, "Ee");
l();
p();
u();
function se() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: qe };
}
__name(se, "se");
__name2(se, "se");
function qe(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t) return t;
  let a = Te();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, a), a;
}
__name(qe, "qe");
__name2(qe, "qe");
function Te() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: /* @__PURE__ */ __name2((t, a) => e.has(a) ? e.get(a) : Reflect.get(globalThis, a), "get"), set: /* @__PURE__ */ __name2((t, a, s) => Me.has(a) ? Reflect.set(globalThis, a, s) : (e.set(a, s), true), "set") });
}
__name(Te, "Te");
__name2(Te, "Te");
var Me = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var Ie = Object.defineProperty;
var Ae = /* @__PURE__ */ __name2((...e) => {
  let t = e[0], a = e[1], s = "__import_unsupported";
  if (!(a === s && typeof t == "object" && t !== null && s in t)) return Ie(...e);
}, "Ae");
globalThis.Object.defineProperty = Ae;
globalThis.AbortController = class extends AbortController {
  constructor() {
    try {
      super();
    } catch (t) {
      if (t instanceof Error && t.message.includes("Disallowed operation called within global scope")) return { signal: { aborted: false, reason: null, onabort: /* @__PURE__ */ __name2(() => {
      }, "onabort"), throwIfAborted: /* @__PURE__ */ __name2(() => {
      }, "throwIfAborted") }, abort() {
      } };
      throw t;
    }
  }
};
var vs = { async fetch(e, t, a) {
  se(), X();
  let s = await __ALSes_PROMISE__;
  if (!s) {
    let r = new URL(e.url), o = await t.ASSETS.fetch(`${r.protocol}//${r.host}/cdn-cgi/errors/no-nodejs_compat.html`), c = o.ok ? o.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(c, { status: 503 });
  }
  let { envAsyncLocalStorage: n, requestContextAsyncLocalStorage: i } = s;
  return n.run({ ...t, NODE_ENV: "production", SUSPENSE_CACHE_URL: b }, async () => i.run({ env: t, ctx: a, cf: e.cf }, async () => {
    if (new URL(e.url).pathname.startsWith("/_next/image")) return W(e, { buildOutput: f, assetsFetcher: t.ASSETS, imagesConfig: g.images });
    let o = D(e);
    return ee({ request: o, ctx: a, assetsFetcher: t.ASSETS }, g, f, m);
  }));
} };

// ../../node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250412.0/node_modules/wrangler/templates/pages-dev-util.ts
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
__name(isRoutingRuleMatch, "isRoutingRuleMatch");
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}
__name(transformRoutingRuleToRegExp, "transformRoutingRuleToRegExp");

// .wrangler/tmp/pages-vdZES9/7gy0lwfh4v9.js
var define_ROUTES_default = { version: 1, description: "Built with @cloudflare/next-on-pages@1.13.12.", include: ["/*"], exclude: ["/_next/static/*"] };
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env3, context3) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env3.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = vs;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env3, context3);
      }
    }
    return env3.ASSETS.fetch(request);
  }
};

// ../../node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250412.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env3, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env3);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250412.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env3, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env3);
  } catch (e) {
    const error4 = reduceError(e);
    return Response.json(error4, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-1vxsmK/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_dev_pipeline_default;

// ../../node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250412.0/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env3, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env3, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env3, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env3, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-1vxsmK/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env3, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env3, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env3, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env3, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env3, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env3, ctx) => {
      this.env = env3;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=7gy0lwfh4v9.js.map
