# === Build Stage ===
FROM node:lts-alpine AS build-stage
WORKDIR /app

# 1. frontend フォルダ内の package.json をコピー
COPY frontend/package*.json ./

# 2. 依存関係のインストール
RUN npm install

# 3. frontend フォルダ内のすべてのソースをコピー
COPY frontend/ . 

# 4. ビルド実行
RUN npm run build

# === Production Stage ===
FROM nginx:stable-alpine AS production-stage
# ビルド成果物（dist）をコピー
COPY --from=build-stage /app/frontend/dist /usr/share/nginx/html

# Cloud Runのポート8080に対応
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]