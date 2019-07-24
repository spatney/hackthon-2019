FROM nginx:latest

MAINTAINER Sachin Patney

ADD VERSION .
COPY client.js /var/www/public
COPY soc.js /var/www/public
COPY index.html /var/www/public
COPY ./ssl/cert.pem /var/www/public/cert.pem
COPY ./ssl/key.pem /var/www/public/key.pem
COPY ./ssl/cert.pem /etc/nginx/cert.pem
COPY ./ssl/key.pem /etc/nginx/key.pem
COPY ./nginx.conf /etc/nginx/nginx.conf

VOLUME ["/var/www/public"]

EXPOSE 443
EXPOSE 80

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]