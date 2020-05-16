# simple-motion-detector

**Must be built on a ARM device if running on an ARM device.**

### To Build

1. Install Docker (using [this](https://phoenixnap.com/kb/docker-on-raspberry-pi))
2. Pull this repository **onto a raspberry pi**.
3. `chmod +x ./build.sh`
4. `./build.sh`

### To Run

1. Create `.env` file to hold environment variables in `VAR=VAR` format
2. Run `docker run --env-file .env --privileged -d --name motion --net=host devinkott/security:latest`
