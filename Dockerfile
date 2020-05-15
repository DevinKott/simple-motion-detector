FROM node:14.2.0-buster

# Update packages
RUN     apt update

# Create the application directory
WORKDIR /mqtt-motion

# Copy in package.json
COPY    package.json .

# Run Yarn
RUN     yarn

# Copy in source files
COPY    .   .

# Print out what's inside this image
RUN     ls

# Command to run.
CMD [ "node", "./src/index.js"]