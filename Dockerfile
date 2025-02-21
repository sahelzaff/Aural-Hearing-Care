# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project (including .env and .env.local if needed)
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine

WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Optionally copy the environment files if your app requires them at runtime.
# If you prefer using runtime environment variables, you can skip this.
# COPY --from=builder /app/.env ./.env
# COPY --from=builder /app/.env.local ./.env.local
# (Optional) Copy the .env file if you want to include it in the image.
# If you prefer not to embed secrets in the image, remove this line and pass env vars during docker run.
COPY .env .env


# Install only production dependencies
RUN npm install --only=production

# Expose port 3010 (or whichever port your production app will run on)
EXPOSE 3000

# Start the Next.js application on port 3010
CMD ["npm", "start"]
