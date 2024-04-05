#!/bin/bash

cp_dev="MY_docker-compose.dev.yml"
cp_prod="MY_docker-compose.prod.yml"

read -p "Enter to select mode [dev/prod]: " MODE

if [[ "$MODE" == "prod" ]]; then
  docker-compose --project-name app_test_please_replace_me --env-file .env -f db-compose/$cp_prod up -d --build
else
  docker-compose --project-name app_test_please_replace_me --env-file .env -f db-compose/$cp_dev up -d --build
fi
