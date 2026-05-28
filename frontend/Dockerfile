# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy application
COPY . .

# Build
RUN npm run build

# Serve with Node (or use Nginx in production)
EXPOSE 5173

CMD ["npm", "run", "dev"]
