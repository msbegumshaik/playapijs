# First stage: Java installation
FROM mcr.microsoft.com/playwright:v1.44.1-jammy

RUN mkdir playapijs

WORKDIR /playapijs

#copy common files from root directory
COPY ./package.json .
COPY ./package-lock.json .
COPY ./playwright.config.js .
COPY ./tests ./tests
COPY ./.env .
COPY ./playwright-report ./playwright-report

RUN npm install

ENTRYPOINT npx playwright test;

#docker build -t playapijs:1.1 .
#docker run -i -t playapijs:1.1