# === Build Stage ===
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# === Production Stage ===
# Nginxを使ってビルドされた静的ファイルを配信します
FROM nginx:stable-alpine AS production-stage
# Vueがビルドした成果物をNginxの公開ディレクトリにコピー
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Cloud Runのデフォルトポート8080に対応させる設定
# Nginxは通常80番ですが、Cloud Runのために8080で待機させます
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
