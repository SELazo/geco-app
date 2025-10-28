# 🎨 Configuración de Generación de Imágenes con IA (DALL-E)

## 📋 Requisitos

Para usar la funcionalidad de **"Imagen inteligente"** en la creación de publicidades, necesitas:

1. Una cuenta de OpenAI
2. API Key de OpenAI con acceso a DALL-E 3
3. Créditos en tu cuenta de OpenAI

---

## 🔑 Paso 1: Obtener API Key de OpenAI

### 1. Crear cuenta en OpenAI

Ve a [https://platform.openai.com/signup](https://platform.openai.com/signup)

### 2. Agregar método de pago

- Ve a [https://platform.openai.com/account/billing/overview](https://platform.openai.com/account/billing/overview)
- Agrega una tarjeta de crédito/débito
- OpenAI cobra por uso (pay-as-you-go)

### 3. Crear API Key

1. Ve a [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Haz clic en **"Create new secret key"**
3. Copia la key (empieza con `sk-...`)
4. **⚠️ IMPORTANTE:** Guárdala en un lugar seguro, no podrás verla de nuevo

---

## ⚙️ Paso 2: Configurar la API Key en el Proyecto

### Opción A: Variables de Entorno (Recomendado)

1. **Crea un archivo `.env` en la raíz del proyecto:**

```bash
cd c:\GECO
```

2. **Copia el contenido de `.env.example`:**

```bash
cp .env.example .env
```

3. **Edita el archivo `.env` y agrega tu API Key:**

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-tu-api-key-aqui-completa
```

4. **Reinicia el servidor de desarrollo:**

```bash
npm run dev
```

### Opción B: Variables de Sistema (Producción)

Para el servidor de producción, configura la variable de entorno:

**Windows (PowerShell):**
```powershell
$env:VITE_OPENAI_API_KEY="sk-tu-api-key-aqui"
```

**Linux/Mac:**
```bash
export VITE_OPENAI_API_KEY="sk-tu-api-key-aqui"
```

---

## 💰 Costos de DALL-E 3

### Precios (actualizados 2024)

| Tamaño | Calidad | Precio por imagen |
|--------|---------|-------------------|
| 1024×1024 | Standard | $0.040 |
| 1024×1024 | HD | $0.080 |
| 1024×1792 | Standard | $0.080 |
| 1024×1792 | HD | $0.120 |
| 1792×1024 | Standard | $0.080 |
| 1792×1024 | HD | $0.120 |

**Configuración actual del proyecto:**
- ✅ Calidad: `standard` (más económico)
- ✅ Tamaño: Adaptado al tamaño de la publicidad seleccionada

**Ejemplo de uso:**
- Si generas 100 imágenes al mes (1024×1024 standard): **$4.00 USD/mes**
- Si generas 500 imágenes al mes: **$20.00 USD/mes**

---

## 🚀 Uso de la Funcionalidad

### 1. Crear una publicidad

1. Ve a **"Crear publicidad"**
2. Selecciona **tamaño**
3. Selecciona **contenido**
4. Elige **"Imagen inteligente"** ✨

### 2. Generar imagen con IA

1. **Escribe un prompt descriptivo:**
   - Ejemplo: *"Un gato con gafas de sol bebiendo café en una playa al atardecer, estilo fotográfico profesional"*
   
2. **Haz clic en "🎨 Generar imagen"**

3. **Espera 10-30 segundos** (DALL-E está generando tu imagen)

4. **Revisa el resultado:**
   - Si te gusta: Haz clic en **"✅ Usar esta imagen"**
   - Si no: Haz clic en **"🔄 Generar otra imagen"** con un nuevo prompt

### 3. Continuar con la publicidad

Una vez que uses la imagen, continuarás con los pasos normales:
- Seleccionar patrón
- Seleccionar colores
- Generar publicidad
- Guardar

---

## 💡 Tips para Prompts Efectivos

### ✅ Buenos prompts:

```
"Producto de café premium sobre una mesa de madera con granos de café, 
iluminación cálida y profesional"

"Perro Golden Retriever feliz corriendo en un parque verde con 
flores, fotografía profesional de alta calidad"

"Auto deportivo rojo en una carretera de montaña al amanecer, 
vista dinámica, cielo colorido"

"Plato de comida gourmet elegantemente presentado en un restaurante, 
fotografía de comida profesional, iluminación suave"
```

### ❌ Prompts menos efectivos:

```
"Un gato" → Muy genérico
"Algo bonito" → Muy vago
"Lo que sea" → Sin dirección
```

### 📝 Elementos clave de un buen prompt:

1. **Sujeto principal:** ¿Qué es lo central?
2. **Contexto/Ambiente:** ¿Dónde está? ¿Qué lo rodea?
3. **Estilo:** Fotográfico, artístico, profesional, etc.
4. **Iluminación:** Natural, cálida, dramática, etc.
5. **Detalles específicos:** Colores, emociones, acción

---

## 🔒 Seguridad

### ⚠️ NUNCA compartas tu API Key

- No la subas a GitHub
- No la compartas en capturas de pantalla
- No la envíes por email/chat
- No la agregues al código fuente

### ✅ Buenas prácticas

1. **Usa variables de entorno** (`.env`)
2. **Agrega `.env` al `.gitignore`:**
   ```gitignore
   # .gitignore
   .env
   .env.local
   .env.*.local
   ```
3. **Rota tu API Key periódicamente**
4. **Configura límites de uso** en OpenAI Dashboard

---

## 🛠️ Troubleshooting

### Error: "API Key de OpenAI no configurada"

**Solución:**
1. Verifica que el archivo `.env` existe
2. Verifica que la variable se llama exactamente: `VITE_OPENAI_API_KEY`
3. Reinicia el servidor de desarrollo

### Error: "Error al generar imagen"

**Posibles causas:**
1. **API Key inválida:** Verifica que copiaste la key correctamente
2. **Sin créditos:** Verifica tu saldo en [OpenAI Dashboard](https://platform.openai.com/account/billing/overview)
3. **Prompt rechazado:** DALL-E rechaza prompts con contenido inapropiado
4. **Límite de rate:** Has generado muchas imágenes muy rápido

### La imagen tarda mucho en generarse

**Normal:** DALL-E 3 puede tardar 10-30 segundos en generar imágenes de alta calidad.

**Si tarda más de 1 minuto:**
1. Verifica tu conexión a internet
2. Revisa el estado de OpenAI: [https://status.openai.com/](https://status.openai.com/)

---

## 📊 Monitoreo de Uso

### Ver tu uso y gastos:

1. Ve a [OpenAI Usage Dashboard](https://platform.openai.com/account/usage)
2. Revisa:
   - Número de imágenes generadas
   - Costo total
   - Uso por día/mes

### Configurar alertas de gasto:

1. Ve a [Billing Settings](https://platform.openai.com/account/billing/limits)
2. Configura un **límite de gasto mensual**
3. Activa **notificaciones por email** cuando alcances el 75% del límite

---

## 🆘 Soporte

### Documentación oficial:

- [OpenAI API Reference](https://platform.openai.com/docs/api-reference/images)
- [DALL-E 3 Guide](https://platform.openai.com/docs/guides/images)
- [Best Practices](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-openai-api)

### Contacto:

- OpenAI Support: [https://help.openai.com/](https://help.openai.com/)
- GECO Support: [Tu email de soporte]

---

## ✨ Características Implementadas

- ✅ Generación de imágenes con DALL-E 3
- ✅ Conversión automática a base64 para Firestore
- ✅ Adaptación de tamaño según la publicidad
- ✅ Mejora automática de prompts
- ✅ Manejo de errores con mensajes claros
- ✅ Opción de regenerar con nuevo prompt
- ✅ Integración completa con flujo de creación

---

## 🎯 Próximas Mejoras (Opcional)

- [ ] Historial de imágenes generadas
- [ ] Galería de prompts sugeridos
- [ ] Modo HD (calidad premium)
- [ ] Múltiples variaciones de una misma imagen
- [ ] Edición de imágenes generadas

---

**¡Listo! Ahora puedes generar imágenes profesionales con IA para tus publicidades.** 🚀
