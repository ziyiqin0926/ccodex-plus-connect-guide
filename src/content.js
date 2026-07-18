export const guideSteps = [
  {
    id: 'download',
    title: '准备环境与安装包',
    action: '先安装 Codex 并启动一次，让本机生成 config.toml；再选择一个接管工具完成安装。',
    helpKey: '下载',
    downloadUrl: '#pending-feishu-export',
    image: 'assets/step-download.webp',
    verified: false,
    checklist: ['Codex 首次启动成功，能看到主界面', 'CODEX++、CC Switch、VS 三选一，不要同时安装', 'Windows 商店打不开时，把链接复制到备用下载站'],
    example: {
      title: '小白判定：可以进入下一步',
      text: 'Codex 能打开，且用户目录下已经出现 .codex/config.toml。',
    },
  },
  {
    id: 'install',
    title: '选择供应商并创建令牌',
    action: '可以使用官版充值，也可以自行选择中转站；填入 API Key 或令牌、服务域名和模型信息。',
    helpKey: '安装',
    downloadUrl: '#pending-feishu-export',
    image: 'assets/step-install.webp',
    verified: false,
    checklist: ['官方 API：准备 API Key 和官方 Base URL', '中转站：找到域名并创建令牌，不要把令牌发到群里', '保存供应商后记下供应商名和模型名'],
    example: {
      title: '配置样例：以 DeepSeek 为例',
      text: '供应商 DeepSeek · Base URL https://api.deepseek.com · API 格式 OpenAI Chat Completions。',
    },
  },
  {
    id: 'connect',
    title: '检查供应商是否配对成功',
    action: '不会配对就按这一步一步来：打开供应商配置 → 选择纯 API → 填 Base URL 和 Key → 选择上游协议 → 开启目标功能 → 保存并点击诊断供应商。',
    helpKey: '连接',
    downloadUrl: '#pending-feishu-export',
    image: 'assets/step-connect.webp',
    verified: false,
    checklist: ['接入模式选「纯 API」，Base URL 填中转域名，例如 https://ergouzi.life/v1', '上游协议按供应商选择 Responses API 或 Chat Completions，不要乱切', '勾选「启用目标功能」，保存后点「诊断供应商」，看到 HTTP 200 / completed'],
    example: {
      title: '截图判定：可以进入下一步',
      text: '供应商列表里当前供应商显示「使用中」，诊断弹窗返回 HTTP 200，响应里出现 status: completed。',
      code: 'Base URL = https://ergouzi.life/v1\n上游协议 = Responses API\n诊断供应商 = HTTP 200 / completed',
    },
    screenshots: [
      {
        src: 'assets/provider-config.png',
        title: '配置页看这几处',
        note: '确认「使用中」、纯 API、Base URL、Key、Responses API、启用目标功能。',
      },
      {
        src: 'assets/provider-test.png',
        title: '诊断页看这几处',
        note: '点「诊断供应商」后，看到 HTTP 200 和 completed，说明供应商配对成功。',
      },
    ],
  },
  {
    id: 'verify',
    title: '重启并验证模型与任务',
    action: '保存供应商后重启 Codex，用 /model 检查模型，再发最短测试任务确认日志回传。',
    helpKey: '验证',
    downloadUrl: '#pending-feishu-export',
    image: 'assets/step-verify.webp',
    verified: false,
    checklist: ['重启当前 Codex 终端或桌面进程', '输入 /model，确认模型来自当前供应商', '发最短测试任务，看到执行日志再开始正式工作'],
    example: {
      title: '验收标准：三秒看懂状态',
      text: '模型列表正确、任务有回传、日志能定位；/model 不刷新时先完全退出再重开。',
    },
  },
];

export const downloadPackages = [
  {
    id: 'codex-installer',
    title: 'CODEX 安装包下载启动器',
    platform: 'Microsoft Store 直链',
    badge: 'Codex 直链下载',
    releaseUrl: 'https://apps.microsoft.com/detail/9PLM9XGG6VKS?hl=neutral&gl=CN&ocid=pdpshare',
    note: '先点这里安装 Codex 启动器。',
    verified: true,
  },
  {
    id: 'codex-plus-plus',
    title: 'CODEX++ 安装包',
    platform: 'Windows / Mac',
    badge: 'GitHub Releases',
    releaseUrl: 'https://github.com/BigPizzaV3/CodexPlusPlus/releases',
    note: '进入 Releases 后，按自己的系统选择 Windows 或 Mac 安装包。',
    verified: true,
  },
];

export const relayLinks = [
  {
    id: 'ergouzi-relay',
    title: '中转站注册与令牌',
    platform: '可选：不使用官版充值时使用',
    url: 'https://ergouzi.life/sign-up?aff=nkEx',
    note: '注册后找到中转域名，再创建令牌；把这两项填入 CODEX++ 配置。',
  },
];

export const referenceLinks = [
  {
    title: 'Windows 商店备用下载',
    note: '商店无法下载时，把 Codex 商店链接粘贴到这里生成安装包。',
    url: 'https://store.rg-adguard.net/',
  },
  {
    title: '官方 API：以 DeepSeek 为例',
    note: 'Base URL 填 https://api.deepseek.com；API 格式选 OpenAI Chat Completions。这里只提供官方 API 入口。',
    url: 'https://platform.deepseek.com/usage',
    cta: true,
    panel: true,
  },
  {
    title: 'Codex++ 社区说明',
    note: '查看 CODEX++ 的安装说明与版本变化。',
    url: 'https://github.com/Alinccc/CodexPlusPlus/blob/main/README.md',
  },
];

export const docHighlights = [
  {
    title: '为什么要先诊断供应商',
    text: '小白不需要理解内部路由，只要确认供应商能被 CODEX++ 调通；诊断供应商返回 HTTP 200，说明域名、令牌、模型和协议基本配对成功。',
  },
  {
    title: '不要同时装多个接管工具',
    text: 'CC Switch、CODEX++、VS 任选一个即可；同时安装或卸载不干净，容易造成配置互相覆盖。',
  },
  {
    title: '三处状态必须一致',
    text: '供应商显示使用中、启用目标功能已勾选、诊断供应商通过，三处对齐后再去 Codex 里验证模型。',
  },
];

export const faqs = [
  {
    id: 'download-blocked',
    step: 'download',
    title: '下载页打不开或链接失效',
    keywords: ['下载', '链接', '打不开', '404', '失效'],
    resolution: '先确认网络正常；如果这里仍是占位链接，说明飞书真实资料还没导入，需要维护者补齐公开下载地址。',
  },
  {
    id: 'install-permission',
    step: 'install',
    title: '安装提示权限不足',
    keywords: ['安装', '权限', '管理员', '拦截', '失败'],
    resolution: '右键安装包，选择以管理员身份运行；仍失败时把错误截图拖到诊断区，再对照安装 FAQ。',
  },
  {
    id: 'config-invalid',
    step: 'install',
    title: '配置保存后仍然报错',
    keywords: ['配置', '密钥', '地址', '保存', '参数'],
    resolution: '检查中转地址前后有没有空格，密钥是否完整复制；不要改教程没要求的高级项。',
  },
  {
    id: 'connect-failed',
    step: 'connect',
    title: '诊断供应商失败或不是 HTTP 200',
    keywords: ['连接失败', '离线', '超时', 'agent', '中转', '诊断供应商', 'HTTP 200'],
    resolution: '回到供应商配置页，检查 Base URL 是否带 /v1、Key 是否完整、模型名是否可用；改完保存，再点「诊断供应商」。',
  },
  {
    id: 'verify-no-log',
    step: 'verify',
    title: '发任务后没有日志',
    keywords: ['验证', '日志', '没反应', '任务', '运行'],
    resolution: '先重启 CODEX++ 和 GPT 部署电脑上的 Agent，再发最短测试任务；若仍无日志，启用本机检查助手看端口和配置状态。',
  },
  {
    id: 'route-not-enabled',
    step: 'connect',
    title: '供应商保存了，但 Codex 没有接上',
    keywords: ['目标功能', '使用中', '供应商', '接管', '没有走中转'],
    resolution: '确认供应商列表里这一项显示「使用中」，详情页勾选了「启用目标功能」，保存后点右上角「重启 Codex++」。',
  },
  {
    id: 'protocol-mismatch',
    step: 'connect',
    title: '报 404、400 或 /responses 错误',
    keywords: ['404', '400', 'responses', 'chat/completions', '协议'],
    resolution: '不要把 Chat Completions 的完整路径直接填给 Codex。让本地路由处理 Responses 与 Chat 的协议转换，并保持 wire_api = "responses"。',
  },
  {
    id: 'model-missing',
    step: 'verify',
    title: '/model 看不到新供应商',
    keywords: ['/model', '模型', '看不到', 'modelcatalogjson', '重启'],
    resolution: '保存供应商后完全退出并重启 Codex；modelcatalogjson 更新后，正在运行的进程不一定会自动刷新。',
  },
  {
    id: 'tool-conflict',
    step: 'download',
    title: '同时装了多个接管工具后配置打架',
    keywords: ['CC Switch', 'CODEX++', '冲突', '卸载', '配置覆盖'],
    resolution: 'CC Switch、CODEX++、VS 任选一个。先停用或卸载多余工具，再重新确认 config.toml 和本地路由状态。',
  },
];

export const trainingVideos = [
  {
    title: '小白先看：安装和基础接入',
    note: '先看完这条入门视频，再回到四步流程操作；看不懂的地方可以进群提问。',
    url: 'https://v.douyin.com/FyDjdMS0p8c/',
    platform: '抖音教学视频',
  },
  {
    title: '进阶对照：中转、令牌和验证',
    note: '对照配置中转域名、创建令牌、验证模型和任务回传。',
    url: 'https://v.douyin.com/sPl8uhD826I/',
    platform: '抖音教学视频',
  },
];

export const communityGroup = {
  title: 'Codex 部署交流群',
  note: '扫码加入 QQ 群，交流安装、配置、中转和实际使用问题。',
  groupNumber: '942308330',
  qrImage: 'assets/community-qr.jpg',
};

export const localHelper = {
  healthUrl: 'http://127.0.0.1:7331/health',
  downloadUrl: '#local-helper-coming-after-feishu-import',
};

export const localOptimizationSkills = [
  { badge: '01 · 破线秘籍', title: '我的 Codex 自定义配置', text: '把你的工作规则放进 Codex 配置目录，遇到复杂任务时自动按这套规则执行。', action: '右上角复制，粘贴到项目 AGENTS.md 或你的 Codex 规则文件。', copyText: '中文优先；回复极简；先读项目结构再修改；复杂任务先列计划；修改后必须验证；保留用户已有改动。' },
  { badge: '02 · Codex 记忆系统', title: '每日复盘与成长任务', text: '让 Codex 每天回顾完成了什么、哪里出错、下次怎么做得更好，持续沉淀到本地记忆。', action: '右上角复制，作为你的定时任务提示词。', copyText: '请完成今日复盘：1.总结今天完成的任务；2.记录遇到的错误与原因；3.提炼可复用经验；4.列出明日最重要的三件事；5.把长期有效内容写入本地 Codex 记忆。' },
  { badge: '03 · 推荐安装 3 个 Skill', title: '从文档精选的技能包', text: '先安装这 3 个，再按需要扩展：Antfu Skills、Composio Skills、Context Engineering Skills。', action: '右上角复制链接清单；打开后按仓库说明安装。', copyText: 'Antfu Skills\nhttps://github.com/antfu/skills\n\nComposio Skills\nhttps://github.com/ComposioHQ/skills\n\nContext Engineering Skills\nhttps://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering', links: [
    { title: 'Antfu Skills', url: 'https://github.com/antfu/skills' },
    { title: 'Composio Skills', url: 'https://github.com/ComposioHQ/skills' },
    { title: 'Context Engineering Skills', url: 'https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering' },
  ] },
  { badge: '04 · 全局优化指令', title: 'Codex 全局优化配置', text: '把这套规则放进 Codex 配置目录；卡片只展示摘要，完整内容通过右上角按钮一次复制。', action: '复制全部内容后，粘贴到你的全局配置文件。', copyLabel: '一键复制全部内容', copyText: String.raw`个性化指定配置：
Codex 全局优化指令 (最高优先级)
适用范围: 所有 Codex 工作目录
规则: 压缩 Token 消耗 → 极致性能 → 最大化缓存命中

第一条 · 极致 Token 压缩（违反需说明理由）
1.1 响应压缩
- 所有回复必须极简：能用一句话说完的不用两句话，能枚举的不用描述
- 中文优先：用户使用中文时全程中文回复，不中英夹杂
- 禁用空话：不用“当然”“首先”“总的来说”“需要注意的是”等填充词
- 代码只展示必要部分：修改文件用 apply_patch 精确指定行号，不输出现有文件全文
- 文件内容摘要输出：读取大文件时只输出关键部分（前 10 行 + 关键函数签名），不 dump 全文

1.2 工具调用优化
- 合并操作：能一个工具调用完成的绝不拆成多个
- 批量查询：多个文件查询合并为一次 rg 或 Get-ChildItem，不逐个 cat
- 精确查找：优先用 rg 带具体搜索词，不用宽泛关键词导致大量输出
- 避免无用输出：管道操作时用 Select-Object / Measure-Object 截断输出，不返回整表

1.3 上下文缓存最大化
- 复用已有上下文：同一会话内优先复用已读取过的文件内容
- 渐进式读取：先读文件头和索引，需要时再读具体部分
- 保持紧凑：减少重复解释，不反复陈述已确定的事实

第二条 · 性能优先策略
2.1 操作顺序
1. 先读索引和目录结构了解全貌
2. 再有针对性地读取具体文件
3. 理解后再修改，避免改完发现理解错误需要重来

2.2 错误预防
- 关键操作前先 dry-run 确认路径和参数
- 复杂修改分步进行，每一步确认后再继续
- 使用 -WhatIf 等预览参数先看影响范围

第三条 · 自动化/后台任务守则
- 定时任务输出必须极简，只输出关键数据和变化
- PDF/PPT 等生成任务使用最小资源模式
- Web 请求优先使用缓存数据而非实时请求

第四条 · 覆写规则
- 以上指令优先级高于用户的日常对话指令
- 除非用户明确要求详细回答，否则一律执行压缩模式
- 当用户要求查看大文件内容时，用摘要替代全文，并询问是否需要完整内容

Self-Improvement
使用全局记忆目录 C:\\Users\\ASUS\\.codex\\memories。
开始新任务前读取 PROFILE.md 和 ACTIVE.md，再分析用户请求。` },
];

