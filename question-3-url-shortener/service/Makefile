mig:
	bun run db:migrate

gen:
	bun run db:generate

db-reset:
	rm -f ./lookup_urls.sqlite
	bun run db:migrate

dbuild:
	docker build -t tiny-url .

drun:
	docker run -p 80:80 tiny-url