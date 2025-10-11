# 🚀 Quick Start - Tandem Studio Website

## Cómo ver el sitio web

### Opción 1: Abrir directamente en el navegador

1. Navega a la carpeta `/Users/feder/VScode/Tandem-New/website/`
2. Haz **doble click** en `index.html`
3. Se abrirá en tu navegador predeterminado

### Opción 2: Usar un servidor local (Recomendado)

#### Con Python (si está instalado):

```bash
cd /Users/feder/VScode/Tandem-New/website
python3 -m http.server 8000
```

Luego abre: `http://localhost:8000`

#### Con Node.js (si está instalado):

```bash
# Instalar http-server globalmente
npm install -g http-server

# Correr servidor
cd /Users/feder/VScode/Tandem-New/website
http-server -p 8000
```

Luego abre: `http://localhost:8000`

#### Con VSCode Live Server:

1. Instala la extensión "Live Server" en VSCode
2. Haz click derecho en `index.html`
3. Selecciona "Open with Live Server"

## ✅ Checklist de Verificación

Una vez abierto el sitio, verifica que:

- [ ] El header se muestra correctamente con el logo de Tandem
- [ ] La navegación funciona (hover sobre "Servicios" y "Nosotros")
- [ ] El hero section muestra el texto animado rotativo (24×7, Seguros, Escalables, Confiables)
- [ ] Al hacer scroll, los elementos aparecen con animación
- [ ] Los 15 logos de clientes se muestran en escala de grises
- [ ] Al hacer hover sobre los logos, se activan (pierden el filtro gris)
- [ ] Los stats counter animan cuando llegas a esa sección
- [ ] En mobile (redimensiona la ventana < 768px), aparece el menú hamburguesa
- [ ] El footer muestra toda la información de contacto

## 🎨 Qué deberías ver

### Hero Section
- Fondo degradado azul oscuro
- Texto grande: "Servicios Gestionados Cloud [palabra animada]"
- Dos botones: "Agenda una Consultoría" (azul) y "Ver Servicios" (outline)
- Partículas flotantes en el fondo

### Valores
- 3 cards con iconos: transparency, team first, think big
- Efecto hover: elevan y muestran sombra

### Servicios
- 6 cards con servicios diferentes
- Iconos SVG personalizados
- Efecto hover: elevación + borde azul

### Stats
- Fondo azul oscuro
- 4 métricas con números grandes
- Los números deben animar contando desde 0

### Clientes
- Grid de 15 logos en escala de grises
- Hover: vuelven a color y escalan ligeramente

### Partners
- 5 logos SVG de partners (Microsoft, AWS, Veeam, Fortinet, Sophos)
- Fondo blanco en cards

### CTA Final
- Fondo azul oscuro
- Botón grande "Contactar ahora"

### Footer
- Fondo negro
- 4 columnas con información
- Información de contacto con iconos

## 🔧 Problemas Comunes

### Los logos de clientes no se ven

**Solución**: Las rutas de las imágenes apuntan a `../Logos/`. Asegúrate de que la carpeta `/Logos` esté en:
```
/Users/feder/VScode/Tandem-New/Logos/
```

Si moviste los archivos, actualiza las rutas en `index.html` línea 290-330.

### Las fuentes no cargan

**Solución**: Necesitas conexión a internet para que Google Fonts funcione. Alternativamente, descarga las fuentes y sírvelas localmente.

### Las animaciones no funcionan

**Solución**: Asegúrate de que JavaScript esté habilitado en tu navegador. Abre la consola (F12) y verifica que no haya errores.

### El menú mobile no abre

**Solución**: Redimensiona la ventana a menos de 768px de ancho. El menú hamburguesa solo aparece en mobile.

## 📱 Testing en Dispositivos

### Desktop
- Chrome
- Firefox
- Safari
- Edge

### Mobile (usa DevTools)
1. Abre Chrome DevTools (F12)
2. Click en el icono de dispositivos móviles
3. Prueba diferentes tamaños: iPhone, iPad, etc.

## 🎯 Próximos Pasos

1. **Revisa el diseño**: ¿Te gusta? ¿Necesitas ajustes?
2. **Prueba las animaciones**: ¿Son muy rápidas/lentas?
3. **Verifica el contenido**: ¿Textos correctos?
4. **Testing mobile**: ¿Se ve bien en celular?
5. **Feedback**: ¿Qué quieres cambiar?

## 💬 Feedback

Anota cualquier cosa que quieras modificar:

- Colores
- Tamaños de texto
- Velocidad de animaciones
- Contenido
- Estructura
- Etc.

---

**¿Listo para crear las páginas internas?** Una vez que apruebes el Home, continuamos con las páginas de servicios, partners, nosotros, etc.
