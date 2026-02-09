# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && \
    npm install --os=linux --cpu=x64 sharp && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage  
FROM node:20-slim AS production

WORKDIR /app

# Install runtime dependencies and Flyway
RUN apt-get update && apt-get install -y \
    wget \
    openjdk-17-jre-headless \
    && rm -rf /var/lib/apt/lists/*

# Install Flyway CLI
ENV FLYWAY_VERSION=9.22.0
RUN wget https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/${FLYWAY_VERSION}/flyway-commandline-${FLYWAY_VERSION}-linux-x64.tar.gz \
    && tar -xzf flyway-commandline-${FLYWAY_VERSION}-linux-x64.tar.gz \
    && mv flyway-${FLYWAY_VERSION} /opt/flyway \
    && chmod +x /opt/flyway/flyway \
    && chmod +x /opt/flyway/lib/* \
    && rm flyway-commandline-${FLYWAY_VERSION}-linux-x64.tar.gz

# Configure Flyway to use system Java by modifying the flyway script
RUN sed -i 's|$INSTALLDIR/jre/bin/java|java|g' /opt/flyway/flyway \
    && ln -s /opt/flyway/flyway /usr/local/bin/flyway

# Configure Java environment
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# Add user and group for executing Flyway commands
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --system --create-home nestjs

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm install --os=linux --cpu=x64 sharp && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy database migrations
COPY --from=builder /app/database ./database

# Change ownership of the app directory and Flyway
RUN chown -R nestjs:nodejs /app && \
    chown -R nestjs:nodejs /opt/flyway

USER nestjs

# Expose port
EXPOSE 3000

CMD ["npm", "run", "start:prod"]