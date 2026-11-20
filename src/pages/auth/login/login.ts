import type { IUser } from '../../../types/IUser';

const loginForm = document.getElementById('form') as HTMLFormElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

loginForm?.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // CASO ESPECIAL: Si es el correo del Administrador por defecto
  if (email === 'admin@foodstore.com' && password === 'admin123') {
    const adminUser: IUser = {
      // Ajusta las propiedades según tu interfaz IUser (id, nombre, email, password, role)
      id: 999,
      nombre: 'Administrador',
      email: email,
      password: password,
      role: 'admin'
    };

    localStorage.setItem('userData', JSON.stringify(adminUser));
    localStorage.setItem('foodstore_logged_user', 'Admin');
    localStorage.setItem('foodstore_logged_email', email);

    alert('¡Inicio de sesión como Administrador exitoso!');
    window.location.href = '/src/pages/admin/home/index.html';
    return;
  }

  // Lógica normal para los demás usuarios
  const existingUsersRaw = localStorage.getItem('users');
  const users: IUser[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

  const validUser = users.find(
      (user) => user.email === email && user.password === password
  );

  if (!validUser) {
    alert('Correo o contraseña incorrectos.');
    return;
  }

  localStorage.setItem('userData', JSON.stringify(validUser));

  const nombreParaHeader = validUser.role === 'admin' ? 'Admin' : (validUser.nombre || email.split('@')[0]);
  localStorage.setItem('foodstore_logged_user', nombreParaHeader);
  localStorage.setItem('foodstore_logged_email', validUser.email);

  alert('¡Inicio de sesión exitoso!');

  if (validUser.role === 'admin') {
    window.location.href = '/src/pages/admin/home/dashboard.html';
  } else {
    window.location.href = '/src/pages/client/home/home.html';
  }
});