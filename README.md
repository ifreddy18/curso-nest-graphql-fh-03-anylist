<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Dev

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
npm i
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker-compose up -d
```
5. Clonar el archivo ```.env.template``` y renombrar a ```.env```

6. Llenar las variables de entorno en el ```.env```

7. Ejecutar la app con el siguiente comando
```
npm run start:dev
```
8. Visitar el sitio
```
http://localhost:3000/graphql
```

9. Ejecutar la __"mutation"__ executeSeed, para llenar la base de datos
```
mutation Mutation {
  executeSeed
}
```


## Stack usado
* Nest
* Graphql
* Postgres

## Libraries

### Validadores
```
npm i  class-validator class-transformer
```

### Variables de entorno
```
npm i @nestjs/config
```

### Validadores de variables de entorno
```
npm i joi
```