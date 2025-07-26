// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'modelJson.json');

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// GET: Obtener el modelJson
app.get('/model-json', (req, res) => {
  try {
    console.log('🔄 Petición GET /model-json');
    console.log('Ruta absoluta de modelJson.json:', DATA_FILE);
    if (!fs.existsSync(DATA_FILE)) {
      console.error('❌ No se encuentra modelJson.json');
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    console.log('Contenido leído de modelJson.json (texto):', rawData);
    let jsonData;
    try {
      jsonData = JSON.parse(rawData);
      console.log('Objeto JSON parseado:', jsonData);
    } catch (parseErr) {
      console.error('❌ Error al parsear el JSON:', parseErr.message);
      return res.status(500).json({ error: 'JSON mal formado', details: parseErr.message });
    }
    // console.log('JSON que se va a enviar al frontend:', JSON.stringify(jsonData, null, 2));

    res.setHeader('Cache-Control', 'no-store');
    res.json(jsonData);
  } catch (e) {
    console.error('❌ Error al procesar /model-json:', e.message);
    res.status(500).json({ error: 'Error al cargar el archivo', details: e.message });
  }
});

// POST: Actualizar el modelJson
app.post('/upload-model', (req, res) => {
  try {
    console.log('📤 Recibiendo actualización del modelo...');

    const newModel = req.body;

    if (!newModel || !newModel.component) {
      console.error('❌ JSON inválido recibido');
      return res.status(400).json({
        ok: false,
        error: 'JSON inválido: falta estructura básica (component)'
      });
    }

    // Crear backup
    if (fs.existsSync(DATA_FILE)) {
      const backupFile = DATA_FILE.replace('.json', `_backup_${Date.now()}.json`);
      fs.copyFileSync(DATA_FILE, backupFile);
      console.log(`💾 Backup creado: ${backupFile}`);
    }

    // Guardar nuevo modelo
    fs.writeFileSync(DATA_FILE, JSON.stringify(newModel, null, 2));
    console.log('✅ Modelo actualizado correctamente en', DATA_FILE);

    res.json({ ok: true, message: 'Modelo actualizado exitosamente' });
  } catch (error) {
    console.error('❌ Error al guardar:', error.message);
    res.status(500).json({
      ok: false,
      error: 'Error al guardar el modelo',
      details: error.message
    });
  }
});

// Crear archivo de ejemplo si no existe
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);

  if (!fs.existsSync(DATA_FILE)) {
    console.warn('⚠️ modelJson.json NO existe. Por favor, crea el archivo manualmente en la carpeta del backend.');
  } else {
    // Verificar si el archivo está vacío o mal formado
    try {
      const contenido = fs.readFileSync(DATA_FILE, 'utf8');
      if (!contenido.trim()) {
        console.warn('⚠️ modelJson.json existe pero está vacío. Por favor, reemplázalo por el archivo correcto.');
      } else {
        const json = JSON.parse(contenido);
        if (!json.component) {
          console.warn('⚠️ modelJson.json existe pero no tiene la propiedad "component". Por favor, revisa el archivo.');
        } else {
          console.log('📁 modelJson.json ya existe y parece válido.');
        }
        console.log('contenido', contenido);
        console.log('json', json);
      }
    } catch (err) {
      console.error('❌ Error al leer o parsear modelJson.json:', err.message);
    }
  }
});
