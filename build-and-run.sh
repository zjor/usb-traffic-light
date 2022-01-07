#!/bin/bash

mvn clean install -DskipTests

java -jar ./target/clewareampel-jar-with-dependencies.jar