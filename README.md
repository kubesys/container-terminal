

## 技术架构

![Alt Screenshot](https://github.com/kubesys/container-terminal/raw/master/example/架构1.png)
架构包括三个部分：浏览器端，websocket client端，websocket server端（即k8s api实际执行端）   
websocket client端接收浏览器传递端数据，转发到server端，server端执行结果返回给浏览器端

## 技术特色

多通道的简单Websocket框架。将允许从JavaScript控制台执行。还包括对流日志的websocket支持。支持连接上的空闲超时。   
exec websocket连接的协议是以下两种类型之一：
* channel.k8s.io - 使用0-3作为读写通道标识符
* base64.channel.k8s.io - 同上       

通道0是STDIN, 1是STDOUT, 2是STDERR (if TTY is not requested), and 3 是特殊错误通道. 服务器从STDIN读, 往其他三种写。


## 代码结构
```
container-terminal
├─.gitignore
├─Dockerfile
├─README.md
├─index.js
├─package-lock.json
├─package.json
├─replace.build.js
├─start.sh
├─public
|   └index.html
├─example
|    └web-k8s-exec.png
```

## 部署方式

```
git clone https://github.com/kubesys/container-terminal.git
cd container-terminal
npm install
sh start.sh
```
## 使用说明
```
docker run -d --restart=always --net=host -e "host=39.106.40.190:" -e "token=xxx" registry.cn-beijing.aliyuncs.com/dosproj/container-terminal:v1.1.0-amd64
```
界面
![Alt Screenshot](https://github.com/samejack/web-k8s-exec/raw/master/example/web-k8s-exec.png)

