FROM node:18-alpine
RUN npm install -g pnpm
RUN mkdir -p /app
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
COPY . .
RUN pnpm i
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
