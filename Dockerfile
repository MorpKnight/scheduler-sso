FROM node:slim
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 6086
CMD ["npm", "run", "start"]