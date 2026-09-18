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

  // 1. Obtener la lista de usuarios desde localStorage
  const existingUsersRaw = localStorage.getItem('users');
  const users: IUser[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

  // 2. Buscar si existe el usuario con las credenciales ingresadas
  const validUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!validUser) {
    alert('Correo o contraseña incorrectos.');
    return;
  }

  // 3. Guardar el objeto del usuario autenticado bajo la clave "userData"
  localStorage.setItem('userData', JSON.stringify(validUser));

  alert('¡Inicio de sesión exitoso!');

  // 4. Redirigir según el rol guardado en el usuario
  if (validUser.role === 'admin') {
    window.location.href = '/src/pages/admin/home/home.html';
  } else {
    window.location.href = '/src/pages/client/home/home.html';
  }
});
