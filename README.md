# Práctica Backend Avanzado

Práctica de KeepCoding para el módulo de backend avanzado

## Instrucciones
----

### Arrancamon la base de datos de mongo:

```
./bin/mongod --dbpath ./data/db --directoryperdb
```

### Instalamos los paquetes:
````
npm install
````

### Instalamos la base de datos:
````
npm run createDB
````

### Arrancamos Nodepop

* En modo desarrollo

    ````
    npm run dev
    ```` 

* En modo producción

    ````
    npm start
    ````

## Hacer login
----
/api/authenticate para hacer login y devolver un token JWT

usuario: user@example.com
contraseña: 1234

## Insertar anuncio
----

Enviamos por post los campos: nombre, venta, precio, foto y tags a /api/anuncios con el token obtenido


## Peticiones a la API
----

siempre enviar el token-> ?token=edgdwgdudugdedge_ejemploToken

### Listar los tags existentes

````
/api/anuncios/tags
````

### Filtrar por nombre

````
/api/anuncios?nombre=nombre_del_producto
````

### Filtrar por venta
Valores true o false. Ejemplo:

````
/api/anuncios?venta=false
````

### Filtrar por tag:

````
/api/anuncios?tag=nombre_tag
````

### Filtrar por precio:
* Precio menor o igual. Ejemplo:

    ````
    /api/anuncios?precio=-50
    ````

* Precio entre dos valores. Ejemplo:

    ````
    /api/anuncios?precio=20-300
    ````

* Precio mayor o igual. Ejemplo:

    ````
    /api/anuncios?precio=80-
    ````

### Ordernar

* Orden ascendente
    ````
    /api/anuncios?sort=campo
    ````

* Orden descendente
    ````
    /api/anuncios?sort=-campo
    ````

### Paginación

````
/api/anuncios?start=numero&limit=numero
````


## Ayudas
____

### Utilizar shell de mongo
```
./bin/mongo
```

