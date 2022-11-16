# Stage 0, based on Node.js, and Name the node stage "builder"
FROM node:16 AS builder
# Set working directory
WORKDIR /usr/src/app
# Copy all files from current directory to working dir in image
COPY . .
# Install app dependencies
RUN npm install
# Build app
RUN npm run build

# Stage 1, based on Nginx
FROM nginx:1.21.1
COPY --from=builder /usr/src/app/dist/web/ /usr/share/nginx/html
EXPOSE 80