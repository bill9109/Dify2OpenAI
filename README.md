![banner](https://io.onenov.cn/file/202412240230660.webp)

# Dify2OpenAI Gateway

[![爱发电](https://afdian.moeci.com/13/badge.svg)](https://afdian.com/@orence)
<a href="./README.md"><img alt="简体中文版自述文件" src="https://img.shields.io/badge/简体中文-d9d9d9"></a>
<a href="./README_EN.md"><img alt="README in English" src="https://img.shields.io/badge/English-d9d9d9"></a>

**Dify2OpenAI** 是一个将 Dify 应用程序转换为 OpenAI API 接口的网关服务，使您可以使用 OpenAI API 兼容的方式访问 Dify 的 LLM、知识库、工具和工作流程。

---

## 特征

- 将 Dify API 转换为 OpenAI API
- 支持流式传输和阻止
- 在 dify 上支持 Chat、Completion、Agent 和 Workflow bots API

## 支持

- 图像支持
- 变量支持
- 持续对话
- Workflow Bot
- Streaming & Blocking
- Agent & Chat bots

---

## 安装与启动

### 安装依赖

```bash
git clone https://github.com/onenov/Dify2OpenAI.git
cd Dify2OpenAI
npm install
```

### 启动服务

使用 PM2 启动（推荐）：
```bash
pm2 start ecosystem.config.cjs
```

或者使用普通方式启动：
```bash
npm run start
```

默认服务会在 `http://localhost:3099` 运行。

### PM2 常用命令

```bash
# 查看应用状态
pm2 list

# 查看日志
pm2 logs

# 重启应用
pm2 restart dify2openai

# 停止应用
pm2 stop dify2openai

# 删除应用
pm2 delete dify2openai
```

---

## 一键部署

### Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fonenov%2FDify2OpenAI)

1. 点击上方按钮跳转至 Vercel
2. 创建并导入项目
3. 直接部署即可，无需配置环境变量
4. 部署完成后，可以通过以下三种方式访问：
   - 在 Authorization Header 中传递所有配置
   - 在 Authorization Header 中传递 API_KEY，其他配置通过 model 参数传递
   - 在 Authorization Header 中传递 DIFY_API_URL，其他配置通过 model 参数传递
   
注意：Vercel 的无服务器函数有 10 秒的超时限制。

---

## 接入方式

### 接入方式一：所有配置在 Authorization Header 中

**Authorization Header 格式：**

```
Authorization: Bearer DIFY_API_URL|API_KEY|BOT_TYPE|INPUT_VARIABLE|OUTPUT_VARIABLE
```

- 所有配置信息都通过 Authorization Header 传递。
- `model` 参数设置为 `dify`。

**示例：**

```bash
Authorization: Bearer https://cloud.dify.ai/v1|app-xxxx|Chat
```

### 接入方式二：Authorization Header 传递 API_KEY，model 参数传递其他配置

**Authorization Header 格式：**

```
Authorization: Bearer API_KEY
```

**`model` 参数格式：**

```
"model": "dify|BOT_TYPE|DIFY_API_URL|INPUT_VARIABLE|OUTPUT_VARIABLE"
```

- Authorization Header 中只包含 `API_KEY`。
- 其他配置信息通过请求体中的 `model` 参数传递。

**示例：**

```bash
Authorization: Bearer app-xxxx
```

```json
"model": "dify|Chat|https://cloud.dify.ai/v1"
```

### 接入方式三：Authorization Header 传递 DIFY_API_URL，model 参数传递其他配置

**Authorization Header 格式：**

```
Authorization: Bearer DIFY_API_URL
```

**`model` 参数格式：**

```
"model": "dify|API_KEY|BOT_TYPE|INPUT_VARIABLE|OUTPUT_VARIABLE"
```

- Authorization Header 中只包含 `DIFY_API_URL`。
- 其他配置信息通过请求体中的 `model` 参数传递。

**示例：**

```bash
Authorization: Bearer https://cloud.dify.ai/v1
```

```json
"model": "dify|app-xxxx|Chat"
```

---

## 开发指南

### 目录结构

```
.
├── app.js              # 应用入口文件
├── botType/           # 机器人类型处理器
│   ├── chatHandler.js     # 聊天处理器
│   ├── completionHandler.js # 补全处理器
│   ├── utils.js           # 工具函数
│   └── workflowHandler.js  # 工作流处理器
├── config/            # 配置文件目录
│   └── logger.js         # 日志配置
├── public/            # 静态文件目录
│   └── index.html        # API 文档页面
├── ecosystem.config.js # PM2 配置文件
├── nodemon.json       # Nodemon 配置文件
└── package.json       # 项目配置文件
```

### 开发模式配置

项目使用 nodemon 进行开发模式的热重载，配置如下：

```json
{
  "watch": ["*.js", "botType/*.js", "config/*.js"],
  "ext": "js,json,env",
  "ignore": [
    "node_modules/",
    "*.test.js",
    "logs/*",
    ".git",
    "public/*"
  ],
  "delay": "500",
  "verbose": true
}
```

- `watch`: 监控的文件和目录
- `ext`: 监控的文件扩展名
- `ignore`: 忽略的文件和目录
- `delay`: 延迟重启时间（毫秒）
- `verbose`: 显示详细日志

### 开发流程

1. 克隆项目
```bash
git clone https://github.com/onenov/Dify2OpenAI.git
cd Dify2OpenAI
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 生产环境部署
```bash
npm start
# 或使用 PM2
pm2 start ecosystem.config.js
```

### 代码风格

- 使用 ES Modules 导入导出
- 异步操作使用 async/await
- 错误处理使用 try/catch
- 使用 winston 进行日志记录

---

## 日志系统

### 日志配置

默认情况下：
- 生产环境（`npm start`）：只记录错误级别日志，仅在控制台显示
- 开发环境（`npm run dev`）：记录所有级别日志，同时输出到控制台和文件

日志文件存储在 `logs` 目录下：
- `combined-%DATE%.log`: 所有级别的日志
- `error-%DATE%.log`: 仅错误级别的日志

### 日志级别

支持以下日志级别（按严重程度排序）：
- `error`: 错误信息
- `warn`: 警告信息
- `info`: 一般信息
- `debug`: 调试信息

### 日志格式

每条日志包含以下信息：
- 时间戳
- 日志级别
- 详细信息
- 元数据（如果有）

示例：
```json
{
  "level": "info",
  "message": "服务器启动成功",
  "timestamp": "2024-12-24T01:51:10+08:00",
  "port": 3099
}
```

### 日志轮转

日志文件按以下规则自动轮转：
- 按日期轮转（每天一个新文件）
- 单个文件最大 20MB
- 保留最近 14 天的日志
- 超出限制的日志文件会被自动删除

### 性能优化

为了优化性能，日志系统采用以下策略：
- 使用缓冲写入，减少 I/O 操作
- 异步写入，不阻塞主线程
- 自动清理过期日志，控制磁盘占用

---

## 示例

### 基础对话

#### 接入方式一

```bash
curl http://localhost:3099/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer https://cloud.dify.ai/v1|app-xxxx|Chat" \
  -X POST \
  -d '{
    "model": "dify",
    "stream": true,
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "你好"
      }
    ]
  }'
```

#### 接入方式二

```bash
curl http://localhost:3099/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer app-xxxx" \
  -X POST \
  -d '{
    "model": "dify|Chat|https://cloud.dify.ai/v1",
    "stream": true,
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "你好"
      }
    ]
  }'
```

#### 接入方式三

```bash
curl http://localhost:3099/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer https://cloud.dify.ai/v1" \
  -X POST \
  -d '{
    "model": "dify|app-xxxx|Chat",
    "stream": true,
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "你好"
      }
    ]
  }'
```

### 带图片的对话

#### 接入方式一

```bash
curl http://localhost:3099/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer https://cloud.dify.ai/v1|app-xxxx|Chat" \
  -X POST \
  -d '{
    "model": "dify",
    "stream": true,
    "messages": [
      {
        "role": "user",
        "content": [
          "请分析这张图片。",
          {
            "type": "image_url",
            "image_url": {
              "url": "https://example.com/image.jpg"
            }
          }
        ]
      }
    ]
  }'
```

#### 接入方式二

```bash
curl http://localhost:3099/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer app-xxxx" \
  -X POST \
  -d '{
    "model": "dify|Chat|https://cloud.dify.ai/v1",
    "stream": true,
    "messages": [
      {
        "role": "user",
        "content": [
          "请分析这张图片。",
          {
            "type": "image_url",
            "image_url": {
              "url": "https://example.com/image.jpg"
            }
          }
        ]
      }
    ]
  }'
```

#### 接入方式三

```bash
curl http://localhost:3099/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer https://cloud.dify.ai/v1" \
  -X POST \
  -d '{
    "model": "dify|app-xxxx|Chat",
    "stream": true,
    "messages": [
      {
        "role": "user",
        "content": [
          "请分析这张图片。",
          {
            "type": "image_url",
            "image_url": {
              "url": "https://example.com/image.jpg"
            }
          }
        ]
      }
    ]
  }'
```

---

## 注意事项

- **参数替换**：请将示例中的 `https://cloud.dify.ai/v1`、`app-xxxx`、`BOT_TYPE` 等参数替换为您实际的值。

- **`BOT_TYPE`**：可选值为 `Chat`、`Completion` 或 `Workflow`，请根据您的应用类型选择。

- **`INPUT_VARIABLE` 和 `OUTPUT_VARIABLE`**：主要用于 `Workflow` 类型的应用，如果不需要可省略。

- **`stream` 参数**：如果需要流式返回，请将 `stream` 设置为 `true`，否则可以省略或设置为 `false`。

- **安全性**：请妥善保管您的 `API_KEY`，不要泄露给无关人员。

---
## 联系

WeChat：**`AOKIEO`** ｜ Mail: **`dev@orence.ai`**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**感谢您使用 Dify2OpenAI！如果您在使用过程中遇到任何问题，欢迎提问，我们将尽快协助您解决。**
