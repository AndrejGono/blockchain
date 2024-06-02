# Use an official Node.js runtime as a parent image
FROM node:20.10.0-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a lightweight web server to serve the static files
FROM node:20.10.0-alpine AS runtime

# Set the working directory
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build /app ./

# Install only production dependencies
RUN npm install --production

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
