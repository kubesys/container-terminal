FROM node:latest
MAINTAINER tt,lcz
ADD . /root/web-k8s-exec
WORKDIR /root/web-k8s-exec
RUN npm cache clean -f \
    && npm install 
CMD ["node index.js"]
