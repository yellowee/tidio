FROM mcr.microsoft.com/playwright:v1.48.1-noble

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

CMD ["yarn", "test-headless"]
