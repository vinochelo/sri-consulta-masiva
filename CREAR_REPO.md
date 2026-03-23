# Crear Repositorio en GitHub

## Pasos para crear el repositorio:

1. **Ve a GitHub:** https://github.com/new

2. **Configura el repositorio:**
   - **Repository name:** `sri-consulta-masiva`
   - **Description:** `API para consultas masivas de comprobantes electrónicos del SRI Ecuador`
   - **Visibility:** Public (o Private si prefieres)
   - **NO** marques "Add a README file" (ya tenemos uno)
   - **NO** marques "Add .gitignore" (ya tenemos uno)

3. **Click en "Create repository"**

4. **Una vez creado, ejecuta estos comandos en la terminal:**

```bash
cd sri-consulta-masiva
git remote set-url origin https://github.com/vinochelo/sri-consulta-masiva.git
git push -u origin main
```

---

## Después de crear el repositorio

Una vez que el repositorio esté en GitHub, puedes desplegarlo en **Render**:

1. Ve a https://render.com
2. Click "New +" → "Web Service"
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `sri-consulta-masiva`
5. Configura:
   - **Name:** `sri-consulta-masiva`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. Click "Create Web Service"

¡Listo! Tu API estará disponible en:
```
https://sri-consulta-masiva.onrender.com
```
