# ==============================================================================
# Nginx Static Web Server for Frontends Containerization
# ==============================================================================
FROM nginx:1.25-alpine

# Clean up default configurations and placeholder files
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy Student Management frontend as root web application
COPY frontend /usr/share/nginx/html

# Copy Rick & Morty exploration portal as subproject under /rick-morty/
COPY miniproyecto_rick_morty /usr/share/nginx/html/rick-morty

# Expose standard web HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
