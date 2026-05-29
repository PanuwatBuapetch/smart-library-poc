# เปลี่ยนจาก node:18-alpine เป็น node:20-alpine
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock?.* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]