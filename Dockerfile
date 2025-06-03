# Etapa de build (usando Maven e Java 21)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa de execução (imagem leve com Java 21)
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/backend-techvet-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
