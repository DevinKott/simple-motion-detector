FROM node:13.8.0-buster

# Update packages
RUN     apt update

# Install packages
RUN     apt install python3.7 -y

RUN     whereis python3

# Create the application directory
WORKDIR /mqtt-motion

# Set NPM config for python3
RUN     npm config set python "/usr/lib/python3"
ENV     PATH="/usr/lib/python3:${PATH}"
ENV     PYTHON="/usr/lib/python3"
RUN     echo $PATH
RUN     ls /usr/lib

# Copy in package.json
COPY    package.json .

# Run Yarn
RUN     yarn --python="/usr/lib/python3"

# Copy in source files
COPY    .   .

# Print out what's inside this image
RUN     ls

# Command to run.
CMD [ "node", "./src/index.js"]