mig:
	bun run db:migrate
seed:
	bun run db:seed
gen:
	bun run db:generate

db-reset:
	rm -f ./mydb.sqlite
	bun run db:migrate
	bun run db:seed