FROM node:16
ARG MUMBAI_PROVIDER
ENV MUMBAI_PROVIDER=$MUMBAI_PROVIDER
WORKDIR /usr/src/app
COPY . .
COPY test_file/logo192.png /inputs/logo192.png
RUN yarn install
CMD ["npx", "ts-node", "index.ts"]
