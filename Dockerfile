# Stage 1: Frontend 빌드
FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Backend 빌드 (프론트엔드 결과물 포함)
FROM eclipse-temurin:21-jdk-alpine AS backend
WORKDIR /app
COPY . .
COPY --from=frontend /frontend/dist ./src/main/resources/static
RUN chmod +x gradlew && ./gradlew bootJar -x test -x copyFrontend

# Stage 3: 실행 이미지 (JRE만 포함 — 경량화)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend /app/build/libs/musicjournal-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
