import type { IUser } from './types/IUser';

function guard(): void {
  const currentPath = window.location.pathname;

  // 1. Obtener los datos de la sesión activa
  const userDataRaw = localStorage.getItem('userData');
  const user: IUser | null = userDataRaw ? JSON.parse(userDataRaw) : null;

  // Identificar el tipo de ruta actual
  const isAuthPage = currentPath.includes('/pages/auth/');
  const isAdminPage = currentPath.includes('/pages/admin/');
  const isClientPage = currentPath.includes('/pages/client/');

  // 2. Sin sesión iniciada: Bloquear acceso a zonas privadas (admin / client)
  if (!user) {
    if (isAdminPage || isClientPage) {
      alert('Debes iniciar sesión para acceder a esta página.');
      window.location.href = '/src/pages/auth/login/index.html';
    }
    return;
  }

  // 3. Con sesión iniciada: Control de permisos por Rol
  if (user.role === 'client' && isAdminPage) {
    alert('Acceso denegado: No tienes permisos de administrador.');
    window.location.href = '/src/pages/client/index.html';
    return;
  }

  // Optional: Redirigir al panel si intenta volver al Login/Registro estando logueado
  if (isAuthPage) {
    const redirectUrl = user.role === 'admin' 
      ? '/src/pages/admin/index.html' 
      : '/src/pages/client/index.html';
    window.location.href = redirectUrl;
  }
}

// Ejecutar el guard al cargar la aplicación
guard();