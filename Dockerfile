FROM nginx
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
COPY ./dist /usr/share/nginx/html
ENV LANG C.UTF-8
ENV SERVER_PORT 80
EXPOSE ${EXPOSE_PORT}
ENTRYPOINT nginx -g "daemon off;"