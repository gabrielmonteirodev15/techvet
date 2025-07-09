# Etapa 1: Build do backend
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend /app
RUN mvn clean package -DskipTests

# Etapa 2: Imagem final com Java + Nginx (base Ubuntu)
FROM ubuntu:22.04

# Instala Java, Nginx e utilitários
RUN apt-get update && \
    apt-get install -y openjdk-21-jdk nginx netcat && \
    apt-get clean

# Define diretório do app
WORKDIR /app

# Copia backend compilado
COPY --from=build /app/target/*.jar /app/app.jar

# Copia frontend
COPY frontend/ /usr/share/nginx/html/

# Copia configuração do Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Exponha a porta 80 para o Render reconhecer
EXPOSE 80

# Starta o Spring Boot + espera e inicia o Nginx
CMD sh -c "java -jar /app/app.jar & \
  while ! nc -z localhost 8080; do sleep 1; done && \
  nginx -g 'daemon off;'"
