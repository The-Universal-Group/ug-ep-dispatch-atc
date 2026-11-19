FROM node:22-slim
WORKDIR /app

# Copy package files and .npmrc
COPY package*.json .npmrc ./

# Install dependencies
ARG NODE_AUTH_TOKEN
RUN npm install

# Copy source
COPY . .

# Expose dev server port
EXPOSE 3030

# Run dev server (hot reload)
CMD ["npm", "run", "dev"]
