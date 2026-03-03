# Practica 5 - Task Manager Pro (React Router + Zustand + Firebase)

Este proyecto está armado siguiendo la guía que compartiste (React Router con rutas protegidas, rutas anidadas y parámetros, y estado global con Zustand). Incluye además los ejercicios complementarios: tema oscuro, búsqueda, estadísticas y toasts. 

## Requisitos
- Node.js 18+ (recomendado 20)
- Cuenta en Firebase (gratis)

## 1) Instalar y correr
1. Descomprime el zip.
2. En terminal:
   ```bash
   cd practica5
   npm install
   ```
3. Crea tu `.env`:
   - Copia `.env.example` a `.env`
   - Reemplaza con tus credenciales reales (Firebase Console → Project Settings → Your apps → Config).

4. Corre el proyecto:
   ```bash
   npm run dev
   ```

## 2) Compilar (build) y previsualizar
```bash
npm run build
npm run preview
```

## 3) Configurar Firebase (paso a paso)
En la guía se indica crear un proyecto `task-manager-pro`, registrar app web, y crear `.env` con variables `VITE_...`. También activar Auth y Firestore. (Ver sección “PARTE 2” de tu PDF.)

### Authentication
- Firebase Console → Authentication → Get started
- Habilita: Email/Password

### Firestore Database
- Firebase Console → Firestore Database → Create database
- Modo de prueba (temporalmente) y luego reemplaza reglas por estas:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;

      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

> Nota: Si te aparece un error de índice cuando cargan las tareas, Firestore te da un link para crear el índice. Dale click y “Create index”.

## 4) Qué estudiar del proyecto (mapa mental corto)
- **Ruteo**: `src/routes/AppRouter.jsx`, `src/routes/ProtectedRoute.jsx`, `src/components/layout/Layout.jsx`
- **Estado global**: `src/store/authStore.js`, `src/store/taskStore.js`, `src/store/uiStore.js`
- **Firebase**: `src/services/firebase.js`, `src/services/authService.js`, `src/services/taskService.js`
- **Suscripción en tiempo real**: `src/hooks/useTasks.js`
- **UI de tareas**: `TaskFilters`, `TaskList`, `TaskCard`, `TaskForm`, `TaskStats`
- **Detalles de tarea**: `src/pages/dashboard/TaskDetails.jsx`

## 5) Ejercicios extra (por si quieres practicar más)
- Agregar paginación o “infinite scroll”
- Agregar edición inline de título en `TaskCard`
- Agregar tags múltiples por tarea
- Agregar “archivar” tareas (soft delete)


## 6) Deploy en Netlify (para compartirlo con tu amigo)

### Opción A (recomendada): GitHub + Netlify
1. Sube este proyecto a un repo en GitHub.
2. En Netlify: **Add new site → Import an existing project**.
3. Configura:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. En Netlify: **Site settings → Environment variables**, agrega estas variables (las mismas de tu `.env`):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. En Firebase: **Authentication → Settings → Authorized domains**, agrega tu dominio:
   - `tu-sitio.netlify.app`

> Ya viene incluido `netlify.toml` + `public/_redirects` para que React Router funcione en refresh.

### Opción B: Drag & Drop (rápida, pero menos cómoda)
1. Corre `npm run build`
2. Sube la carpeta `dist` a Netlify (Deploys → manual deploy / drag&drop).

