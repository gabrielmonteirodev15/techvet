# Etapa 1: Build do backend
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend /app
RUN mvn clean package -DskipTests

# Etapa 2: Imagem final com backend + frontend + nginx
FROM nginx:alpine

# Copia o backend compilado
COPY --from=build /app/target/*.jar /app/app.jar

# Copia frontend estático
COPY frontend/ /usr/share/nginx/html/

# Copia configuração personalizada do Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Script para iniciar o backend e nginx juntos
CMD sh -c "java -jar /app/app.jar & nginx -g 'daemon off;'"