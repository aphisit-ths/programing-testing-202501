mig:
	bun run db:migrate

seed:
	bun run db:seed

gen:
	bun run db:generate

db-reset:
	rm -f ./mydb.sqlite
	bun run db:migrate

dbuild:
	docker build -t tiny-url .

drun:
	docker run -p 80:80 tiny-url