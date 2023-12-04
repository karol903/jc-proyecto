// Definir una interfaz para el usuario
interface User {
    username: string;
    password: string;
}

// Función para manejar el inicio de sesión
function login() {
    // Obtener los valores del formulario
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    // Crear un objeto de usuario
    const user: User = {
        username: usernameInput.value,
        password: passwordInput.value
    };

    // Lógica de autenticación (puedes personalizar esto según tus necesidades)
    if (authenticateUser(user)) {
        alert('Inicio de sesión exitoso');
    } else {
        alert('Nombre de usuario o contraseña incorrectos');
    }
}

// Función de ejemplo para autenticar al usuario (simulación)
function authenticateUser(user: User): boolean {
    // Aquí puedes realizar la autenticación real, por ahora, simulamos un usuario "admin" con contraseña "admin123"
    return user.username === 'admin' && user.password === 'admin123';
}
