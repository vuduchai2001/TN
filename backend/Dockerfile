 FROM node:18-alpine
 
    WORKDIR /usr/src/app
 
    COPY package*.json ./ 
 
    RUN yarn 
 
    COPY . .  

    RUN rm -rf dist
 
    RUN yarn build

    RUN npm install pm2 -g

   CMD ["pm2-runtime", "dist/main.js"]