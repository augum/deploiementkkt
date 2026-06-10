# -------- Étape 1 : Build avec Maven --------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copier uniquement les fichiers nécessaires (optimisation cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copier le reste du projet
COPY src ./src

# Build du JAR
RUN mvn clean package -DskipTests

# -------- Étape 2 : Runtime --------
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copier le jar généré depuis l'étape build
COPY --from=build /app/target/*.jar app.jar

# Port exposé
EXPOSE 8080

# Lancer l'application
ENTRYPOINT ["java","-jar","app.jar"]
