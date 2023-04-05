up:
	sudo docker compose up -d

shell:
	make up;
	sudo docker compose exec endpoint bash

down:
	sudo docker compose stop

logs:
	sudo docker compose logs -f

start-deploy:
	make stop-deploy;
	sudo docker compose -f docker-compose.deploy.yml up -d;

stop-deploy: 
	sudo docker compose -f docker-compose.deploy.yml down --remove-orphans;