# Opciones de Hosting Gratuito para Node.js

## 1. RENDER (Recomendado) ⭐

### Características:
- **Gratis:** 750 horas/mes
- **Sleep:** El servicio duerme después de 15 min de inactividad
- **SSL:** Incluido automáticamente
- **Dominio personalizado:** Disponible
- **Build automático:** Desde GitHub

### Pasos:
1. **Crear cuenta:** https://render.com
2. **Conectar GitHub:**
   - Click "New +" → "Web Service"
   - Autorizar acceso a GitHub
   - Seleccionar repositorio `sri-consulta-masiva`

3. **Configurar:**
   - **Name:** `sri-consulta-masiva`
   - **Region:** Oregon (o más cercano)
   - **Branch:** `main`
   - **Root Directory:** (dejar vacío)
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Variables de Entorno (opcional):**
   - PORT: 10000
   - BATCH_SIZE: 50
   - MAX_CONCURRENT_REQUESTS: 5

5. **Deploy:** Click "Create Web Service"

### URL resultante:
```
https://sri-consulta-masiva.onrender.com/api/health
```

---

## 2. RAILWAY

### Características:
- **Gratis:** $5 USD de crédito/mes (~500 horas)
- **No duerme:** Siempre activo mientras tengas crédito
- **SSL:** Incluido
- **Base de datos:** PostgreSQL gratis

### Pasos:
1. **Crear cuenta:** https://railway.app
2. **Nuevo Proyecto:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Seleccionar repositorio
   - Railway detecta Node.js automáticamente

3. **Configuración:**
   - Railway configurará todo automáticamente
   - Si necesita configuración manual:
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`

4. **Variables:**
   - Ir a Settings → Variables
   - Agregar: `PORT=10000`

### URL resultante:
```
https://sri-consulta-masiva.railway.app/api/health
```

---

## 3. FLY.IO

### Características:
- **Gratis:** 3 shared VMs, 160GB带宽
- **No duerme:** Siempre activo
- **SSL:** Incluido
- **Docker:** Soporte nativo

### Pasos:
1. **Crear cuenta:** https://fly.io
2. **Instalar CLI:**
   ```bash
   npm install -g flyctl
   flyctl auth login
   ```

3. **Desde el proyecto:**
   ```bash
   cd sri-consulta-masiva
   flyctl launch
   ```

4. **Responder prompts:**
   - App name: `sri-consulta-masiva`
   - Region: `sea` (Seattle) o closest
   - Deploy now: `yes`

5. **Configurar puerto:**
   ```bash
   flyctl secrets set PORT=8080
   flyctl deploy
   ```

### URL resultante:
```
https://sri-consulta-masiva.fly.dev/api/health
```

---

## 4. CYCLIC

### Características:
- **Gratis:** Ilimitado para proyectos pequeños
- **No duerme:** Siempre activo
- **SSL:** Incluido
- **Integración directa:** Conecta con GitHub

### Pasos:
1. **Crear cuenta:** https://cyclic.sh
2. **Conectar GitHub:**
   - Click "Connect your repo"
   - Seleccionar `sri-consulta-masiva`
   
3. **Deploy automático:**
   - Cyclic detecta Node.js automáticamente
   - Click "Connect"

4. **Configurar en cyclic.json** (crear archivo):
   ```json
   {
     "name": "sri-consulta-masiva",
     "build": "npm install && npm run build",
     "start": "npm start"
   }
   ```

### URL resultante:
```
https://sri-consulta-masiva.cyclic.sh/api/health
```

---

## 5. GLITCH

### Características:
- **Gratis:** 1000 horas/mes
- **Editor online:** Puedes editar código desde el navegador
- **Sleep:** Duerme después de 5 min de inactividad
- **Limitado:** Sin HTTPS para API externa compleja

### Pasos:
1. **Crear cuenta:** https://glitch.com
2. **Importar proyecto:**
   - Click "New Project" → "Import from GitHub"
   - Pegar URL del repositorio

3. **Configuración:**
   - Glitch detecta automáticamente
   - Si hay problemas, crear `package.json` con scripts

4. **Remixar:**
   - El proyecto está listo para usar

### URL resultante:
```
https://sri-consulta-masiva.glitch.me/api/health
```

---

## Recomendación Final

| Uso | Mejor Opción |
|-----|-------------|
| **Proyecto personal/Side project** | **Render** o **Cyclic** |
| **API con mucho tráfico** | **Railway** (con crédito) |
| **Necesita dormir y despertar** | **Render** |
| **Siempre activo** | **Fly.io** o **Railway** |
| **Edición desde navegador** | **Glitch** |

### Mi Recomendación: **RENDER** ⭐

- Fácil configuración
- SSL automático
- Despierta automáticamente
-足够 para la mayoría de casos de uso

---

## Preparación para Deploy

Independientemente de la opción, necesitas:

1. **Subir a GitHub:**
   ```bash
   cd sri-consulta-masiva
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/sri-consulta-masiva.git
   git push -u origin main
   ```

2. ** Asegurarse que tienes:**
   - ✅ `package.json` con scripts correctos
   - ✅ `tsconfig.json` 
   - ✅ `.gitignore` con `node_modules/`
   - ✅ `Procfile` (para algunos servicios)

3. **Configurar .env en producción:**
   - No subir `.env` a GitHub
   - Configurar variables en el panel del hosting
