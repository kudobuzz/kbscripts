FROM node:16.15.0

RUN apt-get update && \
  apt-get install -y libsasl2-dev

USER node

ENV ROOTPATH=/home/node
ARG NPM_TOKEN
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR $ROOTPATH

COPY package.json npm-shrinkwrap.json $ROOTPATH/

RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > $ROOTPATH/.npmrc && \
  npm install && \
  rm -f .npmrc

COPY . $ROOTPATH/