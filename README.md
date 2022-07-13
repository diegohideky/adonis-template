# backend-boilerplate

This repository has everything we need for our backend projects

### Docker

Before running docker you must create a network

```
docker network create adonis_internal
```

Then you can start the container

```
npm run dc:up
```

And stop the container

```
npm run dc:down
```

### Docker Test

Before running docker you must create a testing network

```
docker network create adonis_test_internal
```

Then you can start the container

```
npm run dc:up:test
```

And stop the container

```
npm run dc:down:test
```

### Postman

Import the collection

1. Open Postman
2. Click on _Import button_ on top left
3. Click in the tab _Import Form Link_
4. Paste the following link and click on _Import button_

```
https://www.getpostman.com/collections/28eb55545a49f2bba8eb
```

## Creating Files

Try to use the automated commands as much as you can

### Create a CRUD

To create CRUD run:

```
npm run make:crud players
```

that will generate all the files you need to make a crud:

```
database/migrations/1653505923452_players.ts
start/routes/players.ts
app/Validators/PlayersCreateValidator.ts
app/Validators/PlayersQueryValidator.ts
app/Validators/PlayersUpdateValidator.ts
app/Models/Players.ts
app/Interfaces/PlayersInterface.ts
app/Types/PlayersType.ts
app/Repositories/PlayersRepository.ts
app/Services/PlayersService.ts
app/Controllers/PlayersController.ts
```

now run the new migration:

```
npm run mg
```

if you need to roll it back then hit:

```
npm run mg:back
```

You will also need to populate your database with default data:

```
npm run db:seed
```

and import the new route file to `start/routes.ts`

```typescript
import './routes/players'
```

_That's Done, you've just completed a whole CRUD Flow in minutes_

### Controllers

To create Controller run:

```
npm run make:controller Users
```

that will generate 1 new file:

```
/app/Controllers/Http/UsersController.ts
```

### Models

To create Model run:

```
npm run make:model Users
```

that will generate 1 new file:

```
/app/Models/Users.ts
```

### Migrations

To create Migration run:

```
npm run make:migration Users
```

that will generate 1 new file:

```
/database/migrations/1653142541773_users.ts
```

## Auto format Eslint & Prettier

create a file inside .vscode named `settings.json`
copy the file `.vscode/settings.example.json` content to `.vscode/settings.json``
now whenever you hit save button in any file, it will automatically fix issues with estlint & prettier

## Production

```cmd
npm run build
cd build
npm ci --production
ENV_PATH=../.env node server.js
```
