const express = require('express');

const app = express();

app.use(express.json());

const mascotasIniciales = [
  {
    id: 1,
    nombre: 'Firulais',
    especie: 'Perro',
    edad: 3,
    adoptado: false,
  },
  {
    id: 2,
    nombre: 'Michi',
    especie: 'Gato',
    edad: 2,
    adoptado: true,
  },
];

let mascotas = mascotasIniciales.map((mascota) => ({ ...mascota }));
let siguienteId = Math.max(...mascotas.map((mascota) => mascota.id)) + 1;

function obtenerId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validarMascota(datos, esActualizacion = false) {
  const errores = [];
  const camposRequeridos = ['nombre', 'especie', 'edad', 'adoptado'];

  if (!esActualizacion) {
    for (const campo of camposRequeridos) {
      if (datos[campo] === undefined) {
        errores.push(`El campo '${campo}' es obligatorio.`);
      }
    }
  }

  if (datos.nombre !== undefined &&
      (typeof datos.nombre !== 'string' || datos.nombre.trim() === '')) {
    errores.push("El campo 'nombre' debe ser un texto no vacío.");
  }

  if (datos.especie !== undefined &&
      (typeof datos.especie !== 'string' || datos.especie.trim() === '')) {
    errores.push("El campo 'especie' debe ser un texto no vacío.");
  }

  if (datos.edad !== undefined &&
      (!Number.isInteger(datos.edad) || datos.edad < 0)) {
    errores.push("El campo 'edad' debe ser un número entero mayor o igual a 0.");
  }

  if (datos.adoptado !== undefined && typeof datos.adoptado !== 'boolean') {
    errores.push("El campo 'adoptado' debe ser true o false.");
  }

  return errores;
}

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de adopción de mascotas funcionando.' });
});

app.get('/mascotas', (req, res) => {
  res.status(200).json(mascotas);
});

app.get('/mascotas/:id', (req, res) => {
  const id = obtenerId(req.params.id);
  const mascota = mascotas.find((item) => item.id === id);

  if (!mascota) {
    return res.status(404).json({ mensaje: 'Mascota no encontrada.' });
  }

  return res.status(200).json(mascota);
});

app.post('/mascotas', (req, res) => {
  const errores = validarMascota(req.body);

  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Datos inválidos.', errores });
  }

  const nuevaMascota = {
    id: siguienteId,
    nombre: req.body.nombre.trim(),
    especie: req.body.especie.trim(),
    edad: req.body.edad,
    adoptado: req.body.adoptado,
  };

  siguienteId += 1;
  mascotas.push(nuevaMascota);

  return res.status(201).json(nuevaMascota);
});

app.put('/mascotas/:id', (req, res) => {
  const id = obtenerId(req.params.id);
  const indice = mascotas.findIndex((item) => item.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Mascota no encontrada.' });
  }

  const errores = validarMascota(req.body, true);
  const camposPermitidos = ['nombre', 'especie', 'edad', 'adoptado'];
  const datosRecibidos = camposPermitidos.filter(
    (campo) => req.body[campo] !== undefined,
  );

  if (datosRecibidos.length === 0) {
    errores.push('Debes enviar al menos un campo para actualizar.');
  }

  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Datos inválidos.', errores });
  }

  const datosActualizados = Object.fromEntries(
    datosRecibidos.map((campo) => {
      const valor = req.body[campo];
      return [campo, typeof valor === 'string' ? valor.trim() : valor];
    }),
  );

  mascotas[indice] = { ...mascotas[indice], ...datosActualizados };

  return res.status(200).json(mascotas[indice]);
});

app.delete('/mascotas/:id', (req, res) => {
  const id = obtenerId(req.params.id);
  const indice = mascotas.findIndex((item) => item.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Mascota no encontrada.' });
  }

  const [mascotaEliminada] = mascotas.splice(indice, 1);

  return res.status(200).json({
    mensaje: 'Mascota eliminada correctamente.',
    mascota: mascotaEliminada,
  });
});

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

module.exports = app;
