# simple-motion-detector

**Must be built on a ARM device if running on an ARM device.**

### To Setup

1. Install Docker (using [this](https://phoenixnap.com/kb/docker-on-raspberry-pi))
2. Pull this repository **onto a raspberry pi**.
3. Create `.env` file to hold environment variables in `VAR=VAR` format
4. `chmod +x ./build.sh`
5. `./build.sh`


The build script will install a service file via `systemd` that starts the motion container after installation **and** on every boot.
If there is an update to the code, run `git pull` in the directory and rerun the build script.


### Todo

1. If the MQTT connection fails, we should retry a couple of times before exiting the process
2. Disconnect MQTT on shutdown?
