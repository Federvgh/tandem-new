# Tandem Studio - Website

Sitio web moderno y responsive para Tandem Studio con animaciones avanzadas, diseño IT profesional y optimización de performance.

## 🚀 Características

- ✅ **Multi-página**: Estructura modular con páginas separadas para cada sección
- ✅ **Bilingüe**: Soporte para Español e Inglés
- ✅ **Responsive**: Diseño mobile-first optimizado para todos los dispositivos
- ✅ **Animaciones modernas**: Efectos visuales inspirados en Ellipsus
- ✅ **Performance optimizado**: HTML/CSS/JS vanilla sin dependencias pesadas
- ✅ **SEO-friendly**: Estructura semántica y meta tags optimizados
- ✅ **Logos monocromáticos**: Efectos hover en logos de clientes
- ✅ **Tipografías modernas**: Space Grotesk + Inter (Google Fonts)

## 📁 Estructura de Archivos

```
website/
├── index.html                          # Home page (español)
├── es/                                 # Páginas en español
│   ├── servicios/
│   │   ├── gestionados-cloud.html
│   │   ├── monitoreo-24x7.html
│   │   ├── migraciones-cloud.html
│   │   ├── backup-recuperacion.html
│   │   ├── seguridad.html
│   │   └── consultoria.html
│   ├── partners.html
│   ├── nosotros.html
│   ├── valores.html
│   ├── blog.html
│   └── contacto.html
├── en/                                 # Páginas en inglés (por crear)
│   └── ...
├── assets/
│   ├── css/
│   │   └── main.css                    # Estilos principales
│   ├── js/
│   │   └── main.js                     # JavaScript principal
│   └── images/
│       └── logos/
│           ├── clients/                # Logos de clientes
│           └── partners/               # Logos de partners (SVG)
└── README.md
```

## 🎨 Paleta de Colores

```css
--primary: #0066FF          /* Azul principal */
--primary-dark: #0052CC     /* Azul oscuro */
--accent: #00D4FF           /* Cyan tech */
--dark: #0A0E27             /* Casi negro */
--gray: #64748B             /* Gris medio */
--light: #F8FAFC            /* Gris claro */
```

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Grid, Flexbox, Custom Properties, Animations
- **JavaScript Vanilla**: Sin frameworks
- **Google Fonts**: Space Grotesk, Inter
- **SVG**: Iconos y logos vectoriales

## 📦 Deployment

### Opción 1: AWS S3 + CloudFront (Recomendado)

```bash
# 1. Crear bucket S3
aws s3 mb s3://tandemstudio-website

# 2. Subir archivos
aws s3 sync . s3://tandemstudio-website --exclude ".git/*" --exclude "node_modules/*"

# 3. Configurar como sitio web estático
aws s3 website s3://tandemstudio-website --index-document index.html

# 4. Configurar CloudFront para CDN (opcional pero recomendado)
```

### Opción 2: Hosting tradicional

1. Subir todos los archivos vía FTP/SFTP
2. Asegurarse de que el servidor web esté configurado para servir HTML estático
3. Configurar redirecciones si es necesario

### Opción 3: Netlify/Vercel (Alternativa rápida)

```bash
# Netlify CLI
netlify deploy --prod

# Vercel CLI
vercel --prod
```

## 🌐 Configuración de Idiomas

El sitio usa un switcher de idiomas en el header. Para agregar el contenido en inglés:

1. Crear la carpeta `/en/` con la misma estructura que `/es/`
2. Traducir todos los archivos HTML
3. El JavaScript ya maneja el cambio de idioma automáticamente

## 📝 Tareas Pendientes

- [ ] Crear páginas de servicios individuales (6 páginas)
- [ ] Crear páginas: Partners, Nosotros, Valores, Blog, Contacto
- [ ] Traducir todo el contenido al inglés
- [ ] Reemplazar logos SVG de partners con logos reales
- [ ] Agregar contenido al blog
- [ ] Configurar formulario de contacto con backend
- [ ] Optimizar imágenes de clientes (WebP)
- [ ] Agregar Google Analytics
- [ ] Configurar sitemap.xml
- [ ] Configurar robots.txt

## ✨ Animaciones Implementadas

1. **Hero Section**: Texto animado rotativo con cambio de colores
2. **Scroll Animations**: Elementos aparecen al hacer scroll (Intersection Observer)
3. **Stats Counter**: Números animados al entrar en viewport
4. **Logos Hover**: Transición de monocromático a color
5. **Cards Hover**: Elevación con sombra y scale
6. **Particles Background**: Partículas flotantes en hero
7. **Mobile Menu**: Animación slide-in

## 🔍 SEO

### Meta Tags Incluidos

- Title optimizado
- Description
- Viewport
- Preconnect para Google Fonts

### Por Agregar

- Open Graph tags (Facebook/LinkedIn)
- Twitter Cards
- Structured Data (JSON-LD)
- Canonical URLs

## 📱 Responsive Breakpoints

```css
Mobile: 320px - 767px
Tablet: 768px - 1023px
Desktop: 1024px - 1439px
Large: 1440px+
```

## ⚡ Performance

- **First Contentful Paint**: Target <1s
- **Time to Interactive**: Target <2s
- **Lighthouse Score**: Target 95+

### Optimizaciones Implementadas

- CSS crítico inline (por implementar)
- Lazy loading de imágenes
- Preconnect para recursos externos
- Animaciones GPU-accelerated
- Debounce en eventos scroll/resize
- Intersection Observer para animaciones

## 🐛 Debugging

Para debug en desarrollo:

```javascript
// Abre la consola del navegador
// Verás mensajes de: "🚀 Tandem Studio"
```

## 📞 Información de Contacto (del sitio)

- **Dirección**: Sierra H. 34, Córdoba, Argentina
- **Teléfono**: +54 351 387-0644
- **Email**: info@tandemstudio.cloud
- **Horario**: Lunes a Viernes, 8:00am - 6:00pm

## 🔄 Próximos Pasos

1. **Revisar el Home page**: Abrir `index.html` en el navegador
2. **Ajustar contenido**: Editar textos según necesidad
3. **Crear páginas faltantes**: Usar `index.html` como template
4. **Reemplazar logos**: Actualizar logos de partners con archivos reales
5. **Configurar hosting**: Desplegar en AWS S3 o hosting elegido
6. **Testing**: Probar en diferentes dispositivos y navegadores

## 💡 Notas Importantes

- Los logos de clientes usan **CSS filter: grayscale()** para el efecto monocromático
- El switcher de idioma redirige a `/en/` o `/` según selección
- Las animaciones usan **Intersection Observer** para mejor performance
- Mobile menu se cierra automáticamente al hacer click en un link

## 📄 Licencia

© 2025 Tandem Studio. Todos los derechos reservados.

---

**transparency | team first | think big**
