# Stage 1: Build the Vue.js app
FROM node:18 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build

# Stage 2: Use Nginx to serve the built Vue.js app
FROM nginx:1.21-alpine

# Copy SSL certificates to the container
COPY ./ssl/star_ddc_moph_go_th.crt /etc/nginx/star_ddc_moph_go_th.crt
COPY ./ssl/cert_bundle.crt /etc/nginx/cert_bundle.crt
COPY ./ssl/star_ddc_moph_go_th.key /etc/nginx/star_ddc_moph_go_th.key

# Copy Nginx configuration with SSL
COPY ./nginx.conf /etc/nginx/nginx.conf
# Copy the helpdesk-app
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
# Copy node_modules for Bootstrap
#COPY --from=build-stage /app/node_modules /usr/share/nginx/html/node_modules

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
