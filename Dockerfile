# ==============================================================================
# Stage 1: Build Spring Boot application using Maven and Temurin JDK 17
# ==============================================================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copy Maven descriptor and source code
COPY pom.xml .
COPY src ./src

# Compile and package application into an executable JAR
RUN mvn clean package -DskipTests

# ==============================================================================
# Stage 2: Lightweight runtime image with Temurin JRE 17
# ==============================================================================
FROM eclipse-temurin:17-jre-alpine AS runner

WORKDIR /app

# Create unprivileged system user for container security compliance
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy executable JAR artifact from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Assign ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

# Expose default Spring Boot application port
EXPOSE 8080

# Configure container-aware JVM memory allocation
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
