// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Archivos de datos
const DATA_FILE = path.join(__dirname, 'modelJson.json');
const REGRESSIVE_FILE = path.join(__dirname, 'regressive.json');

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// =========================
// ENDPOINTS PRINCIPALES
// =========================

// GET: Obtener el modelJson
app.get('/model-json', (req, res) => {
  try {
    console.log('🔄 Petición GET /model-json');
    console.log('Ruta de modelJson.json:', DATA_FILE);
    
    if (!fs.existsSync(DATA_FILE)) {
      console.error('❌ No se encuentra modelJson.json');
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    let jsonData;
    
    try {
      jsonData = JSON.parse(rawData);
      console.log('✅ JSON parseado correctamente');
    } catch (parseErr) {
      console.error('❌ Error al parsear el JSON:', parseErr.message);
      return res.status(500).json({ error: 'JSON mal formado', details: parseErr.message });
    }

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
    console.log('Recibiendo actualización del modelo...');

    const newModel = req.body;

    if (!newModel || !newModel.component) {
      console.error('JSON inválido recibido');
      return res.status(400).json({
        ok: false,
        error: 'JSON inválido: falta estructura básica (component)'
      });
    }

    // Crear backup
    if (fs.existsSync(DATA_FILE)) {
      const backupFile = DATA_FILE.replace('.json', '_backup.json');
      fs.copyFileSync(DATA_FILE, backupFile);
      console.log(`💾 Backup creado o sobrescrito: ${backupFile}`);
    }


    // Guardar nuevo modelo
    fs.writeFileSync(DATA_FILE, JSON.stringify(newModel, null, 2));
    console.log('✅ Modelo actualizado correctamente');

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


// =========================
// ENDPOINTS REGRESIVOS
// =========================

// POST: Limpiar archivo regresivo
app.post('/clear-regressive', (req, res) => {
  try {
    console.log('Limpiando archivo regresivo...');
    
    // Limpiar archivo creando array vacío
    fs.writeFileSync(REGRESSIVE_FILE, JSON.stringify([], null, 2));
    console.log('Archivo regresivo limpiado correctamente');
    
    res.json({ ok: true, message: 'Archivo regresivo limpiado exitosamente' });
    
  } catch (err) {
    console.error('Error al limpiar archivo regresivo:', err.message);
    res.status(500).json({ ok: false, error: 'Error al limpiar archivo', details: err.message });
  }
});



// POST: Guardar múltiples pantallas de una vez
app.post('/upload-regressive', (req, res) => {
  try {
    const screens = req.body;
    
    console.log('🔍 Debug - screens recibidos:', screens);
    console.log('🔍 Debug - tipo de screens:', typeof screens);
    console.log('🔍 Debug - es array:', Array.isArray(screens));
    
    if (!Array.isArray(screens)) {
      return res.status(400).json({ ok: false, error: 'Se requiere un array de pantallas' });
    }
    
    // Validar que todas las pantallas tengan component
    for (let i = 0; i < screens.length; i++) {
      console.log(`🔍 Debug - pantalla ${i + 1}:`, screens[i]);
      console.log(`🔍 Debug - pantalla ${i + 1} tiene component:`, screens[i] && screens[i].component);
      
      if (!screens[i] || !screens[i].component) {
        return res.status(400).json({ 
          ok: false, 
          error: `Pantalla ${i + 1} inválida: falta "component"` 
        });
      }
    }

    
    // Guardar todas las pantallas de una vez
    fs.writeFileSync(REGRESSIVE_FILE, JSON.stringify(screens, null, 2));
    console.log(`${screens.length} pantallas regresivas guardadas correctamente`);
    
    res.json({ ok: true, message: `${screens.length} pantallas guardadas exitosamente` });
    
  } catch (err) {
    console.error('Error en /upload-regressive:', err.message);
    res.status(500).json({ ok: false, error: 'Error al guardar las pantallas', details: err.message });
  }
});

// GET: Obtener pantallas regresivas (útil para debugging)
app.get('/regressive-json', (req, res) => {
  try {
    if (!fs.existsSync(REGRESSIVE_FILE)) {
      return res.json([]);
    }
    
    const content = fs.readFileSync(REGRESSIVE_FILE, 'utf8');
    const data = JSON.parse(content);
    res.json(data);
    
  } catch (err) {
    console.error('Error al leer regressive.json:', err.message);
    res.status(500).json({ error: 'Error al cargar archivo regresivo', details: err.message });
  }
});

// =========================
// INICIALIZACIÓN DEL SERVIDOR
// =========================

// Crear archivos de ejemplo si no existen
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);

  // Verificar/crear modelJson.json
  if (!fs.existsSync(DATA_FILE)) {
    console.warn('modelJson.json NO existe. Creando archivo vacío...');
    fs.writeFileSync(DATA_FILE, JSON.stringify({
      component: "ExampleComponent",
      view_definition: []
    }, null, 2));
  }

  // Verificar/crear regressive.json
  if (!fs.existsSync(REGRESSIVE_FILE)) {
    console.log('Creando regressive.json vacío...');
    fs.writeFileSync(REGRESSIVE_FILE, JSON.stringify([], null, 2));
  }

  console.log('Archivos de datos verificados');
});