# TechVet - Sistema de Agendamentos para Clínica Veterinária 🐶🐱

Este é o backend do sistema TechVet, uma aplicação web para agendamento de consultas veterinárias, construída com **Spring Boot** e **PostgreSQL**.

## 🚀 Funcionalidades

- Cadastro de agendamentos com data e hora
- Listagem de agendamentos por data
- Edição e exclusão de consultas
- Filtros dinâmicos de dias disponíveis

## 🛠️ Tecnologias

- Java 21+
- Spring Boot
- PostgreSQL
- Gradle
- HTML + JavaScript (frontend separado)

## ⚙️ Configuração local

1. Configure o banco PostgreSQL com nome `techvet`
2. Crie um arquivo `application.properties` baseado no `application-example.properties`
3. Rode o projeto com:

```bash
./gradlew bootRun
