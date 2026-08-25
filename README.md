# Actividad 6: CRUD de mascotas

API REST sencilla para administrar mascotas en adopción. Fue desarrollada con Node.js y Express y guarda la información temporalmente en memoria.

## Requisitos

- Node.js instalado.
- Postman para probar las solicitudes.

## Instalación y ejecución

Abre una terminal dentro de la carpeta del proyecto y ejecuta:

```bash
npm install
npm start
```

El servidor quedará disponible en `http://localhost:3000`.

## Rutas disponibles

| Método | Ruta | Acción |
|---|---|---|
| GET | `/` | Comprobar que la API funciona |
| GET | `/mascotas` | Listar todas las mascotas |
| GET | `/mascotas/:id` | Consultar una mascota por su ID |
| POST | `/mascotas` | Registrar una mascota |
| PUT | `/mascotas/:id` | Actualizar una mascota |
| DELETE | `/mascotas/:id` | Eliminar una mascota |

## Ejemplo para POST

En Postman, selecciona `Body` → `raw` → `JSON` y envía a `http://localhost:3000/mascotas`:

```json
{
  "nombre": "Luna",
  "especie": "Gato",
  "edad": 2,
  "adoptado": false
}
```

Los campos `nombre`, `especie`, `edad` y `adoptado` son obligatorios al registrar una mascota.

## Consideraciones

- Los datos se almacenan en memoria y se reinician al detener el servidor.
- El puerto predeterminado es `3000`. Puede cambiarse mediante la variable de entorno `PORT`.
