module.exports = {
  apps: [{
    // 应用名称
    name: "dify2openai",
    
    // 入口文件
    script: "app.js",
    
    // 实例数量
    instances: 1,
    
    // 自动重启
    autorestart: true,
    
    // 监控变化
    watch: false
  }]
}
