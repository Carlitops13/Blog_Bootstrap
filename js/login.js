// Obtener el formulario
const loginForm = document.getElementById('loginForm');
const rememberCheckbox = document.getElementById('remember');

// Obtener usuarios del localStorage
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios')) || [];
}

// Toggle para mostrar/ocultar contraseña
const togglePassButton = document.querySelector('.toggle-pass');
if (togglePassButton) {
    togglePassButton.textContent = '👁️';
    togglePassButton.addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            this.textContent = '👁️';
        }
    });
}

// Verificar si hay sesión guardada al cargar la página
window.addEventListener('load', function() {
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    const recordarme = localStorage.getItem('recordarme');
    
    if (usuarioGuardado && recordarme === 'true') {
        // Redirigir al dashboard
        window.location.href = 'dashboard.html';
    }
    
    // Cargar email si fue recordado
    const emailRecordado = localStorage.getItem('emailRecordado');
    if (emailRecordado) {
        document.getElementById('email').value = emailRecordado;
        rememberCheckbox.checked = true;
    }
});

// Función para validar credenciales
function validarCredenciales(email, password) {
    const usuarios = obtenerUsuarios();
    return usuarios.find(user => user.email === email && user.password === password);
}

// Manejar el envío del formulario
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const recordar = rememberCheckbox.checked;
    
    // Validar que los campos no estén vacíos
    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Validar credenciales
    const usuario = validarCredenciales(email, password);
    
    if (usuario) {
        // Guardar sesión
        localStorage.setItem('usuarioActual', JSON.stringify({
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            email: usuario.email,
            username: usuario.username
        }));
        
        // Guardar preferencia de recordarme
        if (recordar) {
            localStorage.setItem('recordarme', 'true');
            localStorage.setItem('emailRecordado', email);
        } else {
            localStorage.removeItem('recordarme');
            localStorage.removeItem('emailRecordado');
        }
        
        // Mensaje de éxito
        alert(`¡Bienvenido ${usuario.nombres}!`);
        
        // Redirigir al dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Credenciales incorrectas
        alert('Correo electrónico o contraseña incorrectos');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
});

// Validación en tiempo real del email
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !email.includes('@')) {
        this.style.borderColor = '#ef4444';
    } else {
        this.style.borderColor = '#e6e9ef';
    }
});

// Función para cerrar sesión (puede ser usada desde otras páginas)
function cerrarSesion() {
    const recordarme = localStorage.getItem('recordarme');
    
    if (recordarme !== 'true') {
        localStorage.removeItem('usuarioActual');
    }
    
    window.location.href = 'login.html';
}

// Exportar función para uso global
window.cerrarSesion = cerrarSesion;
