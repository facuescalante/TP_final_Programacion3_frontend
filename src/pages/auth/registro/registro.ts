import type { IUser } from '../../../types/IUser';

// Selección de elementos del DOM
const registroForm = document.getElementById('registroForm') as HTMLFormElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

registroForm?.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validación básica de campos vacíos
  if (!email || !password) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Obtener la lista actual de usuarios de localStorage (o inicializar vacía)
  const existingUsersRaw = localStorage.getItem('users');
  const users: IUser[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

  // Validar que el usuario no exista previamente (evita registros duplicados)
  const isDuplicate = users.some((user) => user.email === email);
  if (isDuplicate) {
    alert('El correo electrónico ya se encuentra registrado.');
    return;
  }

  // Crear el nuevo objeto de usuario con el rol 'client' asignado por defecto
  const newUser: IUser = {
      email,
      role: 'client',
      loggedIn: false,
      password
  };

  // Agregar al array y guardar de nuevo en localStorage bajo la clave "users"
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  alert('¡Usuario registrado con éxito!');

  // Redirigir a la pantalla de Login
window.location.href = '/src/pages/auth/login/login.html';
});