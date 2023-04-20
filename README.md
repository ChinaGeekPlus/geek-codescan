# geek-codescan
geek + npm审查工具

### 安装
如果需要使用命令行请全局安装该插件
```
npm install -g geek-codescan
```

如果仅用于本地`import`使用则使用
```
npm install geek-codescan
```

### 配置项
执行`gcs config <setKey> <setValue>`来设置一些通用配置内容, 如
```
gcs config wchatRobotToken 123456
```

如果需要嵌入到自己的逻辑中可以使用`setConfig`进行修改, 如
```
import gcs from geek-codescan
gcs.setConfig('wchatRobotToken', '123456')
```

目前可以使用的配置项如下


Name | Describe
---|---
wchatRobotToken | 企业微信的token, 如果不填写则不会向企业微信推送信息
logFile | 日志文件输出路径, 默认 auditReport.log

### 执行审查
执行 `gsc run`进行当前项目的审查

如果需要嵌入到自己的逻辑中, 可以使用`ready`
```
import gcs from geek-codescan
gcs.ready()
```