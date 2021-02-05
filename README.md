# web-k8s-exec

Use WebSocket implements Docker exec via Kubernetes API.

## Getting and Start

```
git clone https://github.com/samejack/web-k8s-exec.git
cd web-k8s-exec
npm install
nodejs index.js
```
You can change configuration in index.js
## 镜像运行
```
docker run -d --restart=always --net=host -e "host=39.106.40.190:" -e "token=xxx" registry.cn-beijing.aliyuncs.com/dosproj/container-terminal:v1.1.0-amd64
```

Screenshot
![Alt Screenshot](https://github.com/samejack/web-k8s-exec/raw/master/example/web-k8s-exec.png)

## License

Apache License Version 2.0
