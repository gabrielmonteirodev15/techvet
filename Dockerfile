# Etapa 1: Build do backend
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend /app
RUN mvn clean package -DskipTests

# Etapa 2: Imagem final com Java + Nginx
FROM eclipse-temurin:21-jdk AS final

# Instala Nginx
RUN apt-get update && apt-get install -y nginx netcat && apt-get clean

# Copia o JAR gerado
COPY --from=build /app/target/*.jar /app/app.jar

# Copia frontend estático
COPY frontend/ /usr/share/nginx/html/

# Copia configuração personalizada do Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 (para Render detectar)
EXPOSE 80

# Script para iniciar backend e nginx
CMD sh -c "java -jar /app/app.jar & while ! nc -z localhost 8080; do sleep 1; done && nginx -g 'daemon off;'"
