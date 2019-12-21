# Specifies where to get the base image (Node v12 in our case) and creates a new container for it
FROM node:10

# Set working directory. Paths will be relative this WORKDIR.
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files from host computer to the container
COPY . .

# Build the app
RUN npm run build

# Specify port app runs on
EXPOSE 3000

# Run the app
CMD [ "npm", "start" ]

#To build the docker image
#docker build -t szsong100/kwpolish:v1 .
#docker run -d -p 3333:3000 szsong100/kwpolish:v1