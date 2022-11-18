FROM node:16

ARG MUMBAI_PROVIDER

ENV MUMBAI_PROVIDER=$MUMBAI_PROVIDER

WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN yarn build
CMD ["node", "dist/index.js"]
