# use node image as the base image.
FROM node:12

# create and change to Working directory
WORKDIR /usr/src/app

# install app dependencies

COPY package*.json ./

# install dependencies
RUN npm ci

# copy sources
COPY . .

# expose port 8080 for the server
EXPOSE 8080

# run npm script
CMD [ "npm", "run", "prod" ]