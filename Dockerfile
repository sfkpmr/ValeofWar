#https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# specify the node base image with your desired version node:<version>
FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# npm ci installs the same versions defined in the lock file and doesn't try to update them as npm install does. 
# The --only=production flag skips installation of devDependencies, which we don't need in production.
RUN npm ci --only=production

# Bundle app source
COPY . .

# Change default timezone
ENV TZ="Europe/Stockholm"

# Set Node to production
ENV NODE_ENV="production"

# replace this with your application's default port
EXPOSE 3000

# Run image with nobody instead of root 
USER nobody

CMD [ "node", "server.js" ]
