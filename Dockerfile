FROM node:22-alpine AS dependencies

WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock ./
RUN HUSKY=0 yarn install --frozen-lockfile

FROM dependencies AS development

COPY . .
EXPOSE 5173
CMD ["yarn", "dev", "--host", "0.0.0.0"]

FROM dependencies AS build

COPY . .
RUN yarn build

FROM nginx:alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
