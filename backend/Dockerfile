
FROM openjdk:21-jdk-slim as build

WORKDIR /ridewarriors

COPY /target/rwportal-0.0.1-SNAPSHOT.jar /ridewarriors/rwportal.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/ridewarriors/rwportal.jar"]
