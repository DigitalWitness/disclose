# Node Backend for Disclose

Backend service for handling request from the android app and the frontend web app.

## Docker
You can choose to use this app via docker. To do so execute these commands:
```
  cd Node-Backend
  docker build ./ --tag backend:latest
  docker run -it -p 4000:4000 -v $(pwd)/backend:/backend backend:latest
```

## Requirements
- NodeJS (runtime)
- MongoDB (database)
- NPM (package management)

## Usage

MongoDB needs to be running in the background. Eventually, we'll provision a former mongodb instance on the VM. For now, just run mongo in another terminal.

```
mongod
```

Finally, for running the application itself.

```
npm install
bin/www
```
# Running on Ubuntu/Linux

Ubuntu and Linux use the Google DNS by default (8.8.8.X). This is blocked by GTRI. The Node-Backend can still be run by changing the DNS server to GTRIs:

Edit the /etc/resolv.conf file and add the following line:
```
DOCKER_OPTS="--dns=130.207.199.54"
```
