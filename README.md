# SRI Consulta Masiva - API de Consultas de Comprobantes Electrónicos

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

API REST para consultas masivas de autorizaciones de comprobantes electrónicos del SRI Ecuador. Diseñada para verificar el estado de autorización de comprobantes electrónicos de manera eficiente y escalable.

## Características

- Consulta masiva de autorizaciones (hasta 1000 comprobantes por solicitud)
- Procesamiento en batches con concurrencia configurable
- Retry automático en caso de fallos de conexión
- Rate limiting para proteger el servicio
- Soporte para ambientes de pruebas y producción
- API RESTful fácil de integrar
- Tipado completo con TypeScript

## Requisitos

- Node.js 18 o superior
- npm o yarn

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/sri-consulta-masiva.git
cd sri-consulta-masiva

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Compilar TypeScript
npm run build

# Iniciar servidor
npm start

# O en modo desarrollo
npm run dev
```

## Configuración

Editar el archivo `.env` para ajustar los parámetros:

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `BATCH_SIZE` | Tamaño del batch | `50` |
| `MAX_CONCURRENT_REQUESTS` | Solicitudes concurrentes | `5` |
| `DELAY_BETWEEN_BATCHES` | Delay entre batches (ms) | `1000` |
| `REQUEST_TIMEOUT` | Timeout por solicitud (ms) | `30000` |
| `RATE_LIMIT_WINDOW_MS` | Ventana de rate limit (ms) | `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | Máx requests por ventana | `100` |

## API Endpoints

### Health Check
```bash
GET /api/health
```
Verifica que el servicio esté funcionando.

### Consulta Individual
```bash
GET /api/consulta/:claveAcceso?ambiente=produccion
```
Consulta el estado de un solo comprobante.

**Parámetros:**
- `claveAcceso` (path): Clave de acceso del comprobante (49 dígitos)
- `ambiente` (query, opcional): `pruebas` o `produccion` (default: produccion)

### Consulta Masiva
```bash
POST /api/consulta-masiva
Content-Type: application/json

{
  "clavesAcceso": ["clave1", "clave2"],
  "ambiente": "produccion"
}
```
Consulta múltiples comprobantes en una sola solicitud.

**Body:**
- `clavesAcceso` (required): Array de claves de acceso (máx 1000)
- `ambiente` (optional): `pruebas` o `produccion`

## Uso con cURL

### Consulta Individual
```bash
curl "http://localhost:3000/api/consulta/0503202607179210356800120050010002142270400500112?ambiente=produccion"
```

### Consulta Masiva
```bash
curl -X POST http://localhost:3000/api/consulta-masiva \
  -H "Content-Type: application/json" \
  -d '{
    "clavesAcceso": [
      "0503202607179210356800120050010002142270400500112",
      "2111202405176001321000110010010000001241234567810"
    ],
    "ambiente": "produccion"
  }'
```

## Estados de Autorización

| Estado | Descripción |
|--------|-------------|
| `AUTORIZADO` | Comprobante válido y autorizado por el SRI |
| `NO AUTORIZADO` | Comprobante rechazado (contiene errores) |
| `PENDIENTE DE ANULAR` | Comprobante pendiente de anulación |
| `ANULADO` | Comprobante anulado |
| `RECHAZADA` | Error en la consulta (fuera de rango o no existe) |

## Ejemplo de Respuesta

```json
{
  "total": 2,
  "procesados": 2,
  "errores": 0,
  "tiempoEjecucion": "401ms",
  "resultados": [
    {
      "claveAcceso": "0503202607179210356800120050010002142270400500112",
      "estado": "AUTORIZADO",
      "numeroAutorizacion": "1503202607179210356800120050010002142270400500112",
      "fechaAutorizacion": "2026-03-05T16:47:00.000Z",
      "tipoComprobante": "Comprobante de Retención",
      "rucEmisor": "1792103568001",
      "mensajes": []
    },
    {
      "claveAcceso": "2111202405176001321000110010010000001241234567810",
      "estado": "RECHAZADA",
      "mensajes": ["ERROR AL CONSULTAR DATOS DEL SERVICIO WEB - No existen datos para los parámetros ingresados"]
    }
  ]
}
```

## Despliegue

### Render (Recomendado)

1. Crear cuenta en [Render](https://render.com)
2. Nuevo Web Service → Conectar GitHub
3. Configurar:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Deploy

### Otras plataformas
Ver `DEPLOY.md` para opciones adicionales (Railway, Fly.io, Cyclic).

## WSRI Endpoints

El servicio consume los WS del SRI Ecuador:

- **Pruebas:** `https://celcer.sri.gob.ec/comprobantes-electronicos-ws/ConsultaComprobante?wsdl`
- **Producción:** `https://cel.sri.gob.ec/comprobantes-electronicos-ws/ConsultaComprobante?wsdl`

## Notas Importantes

- El SRI puede cambiar certificados SSL sin previo aviso
- Se recomienda conexión mayor a 256Kbps (según MINTEL)
- Para consultas masivas grandes, se procesan en batches de 50
- Retry automático de 2 intentos en caso de fallos de conexión
- Rate limiting: 100 solicitudes por minuto

## Licencia

MIT License - ver archivo `LICENSE` para más detalles.

## Autor

Creado para consultas masivas de comprobantes electrónicos del SRI Ecuador.
