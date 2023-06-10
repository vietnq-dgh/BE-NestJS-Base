sudo docker-compose --project-name app-nestjs-base  --env-file .env -f db-compose/MY_docker-compose.dev.yml up -d --build
yarn start:dev
