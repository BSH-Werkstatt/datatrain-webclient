FROM nginx:alpine
COPY dist/bsh-gotcha /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf