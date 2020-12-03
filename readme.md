http://zenn.dev/is_ryo/books/10ef5a30196e16110bc1
上記参考にtodoアプリ作成、セットアップコマンド以下


## docker:init db-network
```
docker network create docker-network
```

## docker:init db-volume
```
docker volume create db.data
```

## docker:up
```
docker-compose -f ./docker-compose.yml up -d
```

## docker:down
```
docker-compose -f ./docker-compose.yml down
```


## sequelize:create-db
```
npm run sequelize db:create
```

## sequelize:db-migration
```
npm run sequelize db:migrate
```

## server:ts-build
```
npm run build
```

## server:run
```
npm run start
```