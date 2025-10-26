# repoAWS

Aplicación React construida con Vite y TailwindCSS para gestionar un tablero de conocimientos.

## Desarrollo local

```bash
npm install
npm run dev
```

## Despliegue en GitHub Pages

El repositorio incluye un workflow (`.github/workflows/deploy.yml`) que compila el proyecto y publica el contenido generado en GitHub Pages mediante el flujo oficial de GitHub Actions.

1. En la configuración del repositorio, sección **Pages**, selecciona **GitHub Actions** como fuente.
2. Realiza un push a la rama `main`. El workflow ejecutará `npm run build` y desplegará la carpeta `dist` en la rama de Pages.
3. La URL de tu sitio quedará disponible en la misma sección de **Pages** una vez completado el despliegue.

Gracias al ajuste dinámico en `vite.config.js`, el build utiliza automáticamente el nombre del repositorio como base al producir la versión para producción, asegurando que los assets se resuelvan correctamente en GitHub Pages.
