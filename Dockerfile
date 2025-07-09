# Etapa 1: Build do backend
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend /app
RUN mvn clean package -DskipTests

# Etapa 2: Imagem final
FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y openjdk-21-jdk nginx netcat && \
    apt-get clean

WORKDIR /app

COPY --from=build /app/target/*.jar /app/app.jar

# Remove conteúdo antigo do Nginx e config padrão
RUN rm -rf /usr/share/nginx/html/* && \
    rm -f /etc/nginx/sites-enabled/default

# Copia frontend
COPY frontend/ /usr/share/nginx/html/

# Copia config personalizada do Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Verifica se index.html existe (debug)
RUN ls -l /usr/share/nginx/html

# Valida config do Nginx (debug)
RUN nginx -t

EXPOSE 80

CMD sh -c "java -jar /app/app.jar & \
  while ! nc -z localhost 8080; do sleep 1; done && \
  nginx -g 'daemon off;'"