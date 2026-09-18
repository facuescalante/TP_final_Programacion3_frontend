import type { IUser } from "../types/IUser";                      // Importa interfaz de Usuario
import type { Rol } from "../types/Rol";                          // Importa tipo/enum de Rol
import { getUSer, removeUser } from "./localStorage";              // Métodos de acceso a localStorage
import { navigate } from "./navigate";                            // Helper para navegación entre páginas

export const checkAuhtUser = (                                    // Valida autenticación y rol del usuario
    redireccion1: string,                                           // Ruta destino si no está autenticado
    redireccion2: string,                                           // Ruta destino si el rol es insuficiente
    rol: Rol                                                        // Rol requerido para acceder
) => {
  console.log("comienzo de checkeo");                             // Trazabilidad de inicio de verificación

  const user = getUSer();                                         // Recupera la sesión guardada

  if (!user) {
    console.log("no existe en local");                             // Log: usuario no logueado
    navigate(redireccion1);                                       // Redirige por falta de autenticación
    return;                                                       // Corta la ejecución
  } else {
    console.log("existe pero no tiene el rol necesario");         // Log: usuario encontrado en storage

    const parseUser: IUser = JSON.parse(user);                    // Deserializa la cadena JSON a IUser
    if (parseUser.role !== rol) {                                 // Compara el rol con el esperado
      navigate(redireccion2);                                     // Redirige por falta de permisos
      return;                                                     // Corta la ejecución
    }
  }
};

export const logout = () => {                                     // Cierra la sesión activa
  removeUser();                                                   // Limpia el usuario de localStorage
  navigate("/src/pages/auth/login/login.html");                 // Redirige a la pantalla de login
};