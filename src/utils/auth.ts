export function initUserSession() {
  const userNameSpan = document.getElementById('userNameDisplay');

  // Si no hay usuario guardado, ponemos uno por defecto para que no quede vacío
  const loggedUser = localStorage.getItem('foodstore_logged_user') || 'Juan';

  if (userNameSpan) {
    const firstName = loggedUser.split(' ')[0]; // Toma "Juan" de "Juan Facundo"
    userNameSpan.textContent = firstName;
  }

  const btnLogout = document.getElementById('btnLogout');
  btnLogout?.addEventListener('click', () => {
    localStorage.removeItem('foodstore_logged_user');
    // Redirige al login principal (ajusta los puntos según dónde esté tu index.html)
    window.location.href = '../../../index.html';
  });
}