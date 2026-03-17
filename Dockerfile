# === Build Stage ===
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ . 
RUN npm run build

# === Production Stage ===
FROM nginx:stable-alpine AS production-stage

# ★ここを /app/dist にします。frontend は不要です。
# ログが「ここにファイルがあるよ」と教えてくれている場所です。
COPY --from=build-stage /app/dist /usr/share/nginx/html

RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
