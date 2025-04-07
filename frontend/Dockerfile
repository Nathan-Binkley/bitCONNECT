# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# ENV
ENV API_URL=https://bitconnect.onrender.com
# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start serve
CMD ["serve", "-s", "build", "-l", "3000"] 