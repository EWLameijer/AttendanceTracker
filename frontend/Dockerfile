FROM node:22-slim

# Set env variable
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]