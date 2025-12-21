// Script de registro cargado
console.log('Script registro.js cargado correctamente');

const registerForm = document.getElementById('registerForm');

if (!registerForm) {
    console.error('No se encontró el formulario con id "registerForm"');
}

let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
console.log('Usuarios actuales:', usuarios.length);


function validarCedula(cedula) {
    return /^\d+$/.test(cedula);
}


function validarUsername(username) {
    return /^[a-zA-Z0-9_]+$/.test(username);
}


function usuarioExiste(username, email) {
    return usuarios.some(user => user.username === username || user.email === email);
}


const togglePassButtons = document.querySelectorAll('.toggle-pass');
togglePassButtons.forEach(button => {
    button.addEventListener('click', function() {
        const passwordInput = this.previousElementSibling;
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.textContent = '';
        } else {
            passwordInput.type = 'password';
            this.textContent = '';
        }
    });
});


registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Formulario enviado - preventDefault ejecutado');
    
    
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const cedula = document.getElementById('cedula').value.trim();
    const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
    const email = document.getElementById('email').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
  
    if (!validarCedula(cedula)) {
        alert('La cédula debe contener solo números');
        return;
    }
    
    if (!validarUsername(username)) {
        alert('El nombre de usuario solo puede contener letras, números y guiones bajos');
        return;
    }
    
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Verificar si el usuario ya existe
    if (usuarioExiste(username, email)) {
        alert('El nombre de usuario o correo electrónico ya están registrados');
        return;
    }
    
  
    const nuevoUsuario = {
        nombres,
        apellidos,
        cedula,
        fechaNacimiento,
        email,
        direccion,
        username,
        password,
        fechaRegistro: new Date().toISOString()
    };
  
    usuarios.push(nuevoUsuario);
    
   
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Iniciar sesión automáticamente
    localStorage.setItem('usuarioActual', JSON.stringify({
        nombres: nuevoUsuario.nombres,
        apellidos: nuevoUsuario.apellidos,
        email: nuevoUsuario.email,
        username: nuevoUsuario.username
    }));
    
    // Limpiar formulario
    registerForm.reset();
    
    console.log('Usuario registrado exitosamente');
    
    // Mensaje de éxito
    alert('¡Registro exitoso! Bienvenido ' + nombres + '!');
    
    console.log('Redirigiendo a index.html');
    
    // Redirigir al dashboard
    window.location.href = basePath('/dashboard.html');
});


document.getElementById('cedula').addEventListener('input', function() {
    this.value = this.value.replace(/[^\d]/g, '');
});


document.getElementById('username').addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z0-9_]/g, '');
});
