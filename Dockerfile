FROM ubuntu:latest
RUN apt-get update -y
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
RUN apt-get update
RUN apt-get install -y nodejs-legacy npm mongodb-10gen
RUN mkdir -p /backend && mkdir -p /data/db
WORKDIR /backend
COPY ./backend ./
RUN npm install
EXPOSE 4000
ENTRYPOINT ["./bin/run.sh"]