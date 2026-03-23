# Despliegue Gratuito en Línea

Tu aplicativo está listo para desplegarse. Aquí tienes las opciones gratuitas:

---

## 🏆 RENDER (Recomendado)

**Gratis, SSL automático, fácil configuración**

### Pasos:
1. **Crea cuenta:** https://render.com
2. **Nuevo Web Service:** Click "New +" → "Web Service"
3. **Conecta GitHub:** Autoriza acceso y selecciona el repositorio
4. **Configura:**
   - Name: `sri-consulta-masiva`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Free**
5. **Deploy:** Click "Create Web Service"

### Tu API estará disponible en:
```
https://sri-consulta-masiva.onrender.com/api/health
```

---

## Alternativas Gratuitas

| Plataforma | Características | URL |
|------------|----------------|-----|
| **Railway** | $5 crédito/mes, no duerme | https://railway.app |
| **Fly.io** | 3 VMs gratis, siempre activo | https://fly.io |
| **Cyclic** | Ilimitado, integración GitHub | https://cyclic.sh |

---

## Antes de Desplegar

Necesitas crear un repositorio en GitHub:

1. Ve a https://github.com/new
2. Repository name: `sri-consulta-masiva`
3. **No** initialices con README
4. Click "Create repository"

5. En tu terminal, dentro de `sri-consulta-masiva/`:
```bash
git init
git add .
git commit -m "SRI Consulta Masiva - API"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/sri-consulta-masiva.git
git push -u origin main
```

6. Luego ve a Render y conecta ese repositorio

---

## Endpoints de tu API

Una vez desplegado, usa:

```bash
# Health check
GET https://TU-APP.onrender.com/api/health

# Consulta individual
GET https://TU-APP.onrender.com/api/consulta/CLAVE_ACCESO?ambiente=produccion

# Consulta masiva
POST https://TU-APP.onrender.com/api/consulta-masiva
{
  "clavesAcceso": ["CLAVE1", "CLAVE2"],
  "ambiente": "produccion"
}
```

---

## Notas Importantes

- **Render Free:** Duerme después de 15 min de inactividad (despierta automáticamente)
- **Primer request:** Puede tardar ~30 segundos (cold start)
- **SSL:** Incluido automáticamente
- **Build:** Se ejecuta automáticamente en cada push a main
