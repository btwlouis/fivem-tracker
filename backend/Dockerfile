# Use Node.js base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript source code
RUN npm run build

# Expose port
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/index.js"]
