# Web financial app

Run it using docker! It should up a compose with postgres and the nexts app runnig on `localhost:3000`.

```bash
docker compose --env-file .env.finance up --build
```

And then make the migrations necessary to update the postgreSQL database.

```bash
npx prisma migrate dev
```

If you want to run it manually, you'll have to install the dependencies with npm by hand, including prisma client. Also, you'll have to generate the client and run the migrations to synchronize it with you bd. You'll also have to host your own instnace of postgres db.
