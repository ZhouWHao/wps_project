# 使用 alpine 作为基础镜像
FROM node:12.22.12-alpine

# 设置工作目录
RUN mkdir -p /var/www/wpsproject
RUN mkdir /var/www/wpsproject/upload
WORKDIR /var/www/wpsproject

# 拷贝 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝应用程序代码到工作目录
COPY . .

# 暴露应用程序运行的端口
EXPOSE 8000

# 运行应用程序
RUN npm run build
CMD ["node", "dist/app.js"]