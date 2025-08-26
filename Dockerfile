# Dockerfile
# Example command to build image from this Dockerfile:
# docker build -t bay-consent-admin .

# --- STAGE 1: Build ---
# Use Node.js version 24.0.0 as a base image to install and build application and name this stage as 'build'.
# FROM node:24.0.0-alpine AS build
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
# FROM nginx:1.29.1-alpine
FROM nginx:1.29.1

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