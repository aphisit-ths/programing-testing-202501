mig:
	bun run db:migrate
seed:
	bun run db:seed
gen:
	bun run db:generate

dbuild:
	docker build -t backend .
drun:
	docker run -p 7777:7777 backend

db-reset:
	rm -f ./user.sqlite
	bun run db:migrate
	bun run db:seed