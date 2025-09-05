# Dockerfile
# Example build image command from this Dockerfile:
#   docker image build -t jlo-crm .
# Example start container command:
#   docker container run -d --name jlo-crm -p 4200:80 -e PRODUCTION=true -e API_ENDPOINT=http://localhost:8080/jlo-crm-backend -e WEB_SOCKET_ENDPOINT=ws://localhost:8080/jlo-crm-backend/chat -e WHITELISTED_DOMAINS=localhost:8080 --restart unless-stopped jlo-crm

# --- STAGE 1: Build ---
# Use Node.js version 24.0.0 as a base image to install and build application and name this stage as 'build'.
FROM node:24.0.0 AS build

# Set the container working directory.
WORKDIR /app

# Copy package.json and package-lock.json, in order to download dependencies.
COPY package*.json ./
RUN npm install --force

# Copy all source code into the container.
COPY . .

# Build Angular project in production mode.
RUN npm run build.prod


# --- STAGE 2: Serve ---
# User NGINX as a base image to run application.
FROM nginx:1.29.1

# Set default environment variables
ENV PORT=80
ENV PRODUCTION=false
ENV API_ENDPOINT=http://localhost:8080/jlo-crm-backend
ENV WEB_SOCKET_ENDPOINT=ws://localhost:8080/jlo-crm-backend/chat
ENV WHITELISTED_DOMAINS=localhost:8080

# Remove NGINX default configuration file.
RUN rm /etc/nginx/conf.d/default.conf

# Replace default NGINX configuration with custom NGINX config.
COPY docker-config/nginx.conf /etc/nginx/conf.d

# Copy all built files from 'build' stage into NGINX and set permission.
COPY --from=build /app/dist/jlo-crm/browser/ /usr/share/nginx/html
# RUN chmod +x -R /usr/share/nginx/html

# Copy the environment template file
COPY src/assets/env.js /usr/share/nginx/html/assets/env.js

# Copy and set executable permissions for the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# The default command for the nginx image
CMD ["nginx", "-g", "daemon off;"]

# Listen at port 80.
EXPOSE 80