FROM node:14-alpine

# Install dependencies for native modules (if needed)
RUN apk add --no-cache libc6-compat python3 make g++

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy application source files
COPY src/ ./src

# Expose the port your app listens on
EXPOSE 3000

# Wait for the database to be ready before starting the app
CMD ["sh", "-c", "sleep 10 && node src/app.js"]

