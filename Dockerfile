FROM node:18-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /home/node/app

COPY package*.json /home/node/app/
COPY . /home/node/app/
COPY ENV_EXAMPLE /home/node/app/.env

RUN npm install 
RUN npm run compile

CMD ["npm", "start"]
