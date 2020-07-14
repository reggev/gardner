FROM node:13.6.0-alpine3.10 
# environment
ENV node_env=development
WORKDIR /usr/src/app

# dependencies
COPY package.json .
COPY yarn.lock .
COPY packages/collector/package.json ./packages/collector/

# install dependencies
RUN yarn install --pure-lockfile --non-interactive

COPY packages/collector/ ./packages/collector/

WORKDIR /usr/src/app/packages/collector
# RUN npm audit fix 

CMD [ "npm", "start" ]