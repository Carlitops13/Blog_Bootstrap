// Cargar proyectos dinámicamente en la página principal
window.addEventListener('load', function() {
    cargarProyectosDinamicos();
    verificarSesion();
});

function cargarProyectosDinamicos() {
    const proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) return;
    
    // Si hay proyectos guardados, reemplazar los estáticos
    if (proyectos.length > 0) {
        projectsGrid.innerHTML = '';
        proyectos.forEach(proyecto => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${proyecto.imagen}" alt="${proyecto.titulo}" onerror="this.src='https://via.placeholder.com/300x130/0aa3a3/ffffff?text=Proyecto'">
                <h3>${proyecto.titulo}</h3>
                <p>${proyecto.descripcion}</p>
                <div class="tags">
                    ${proyecto.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }
}

function verificarSesion() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const navbar = document.querySelector('.navbar_menu');
    
    if (!navbar) return;
    
    if (usuarioActual) {
        // Usuario logueado - cambiar botones de login/registro por dashboard y logout
        const loginLink = navbar.querySelector('a[href="login.html"]');
        const registerLink = navbar.querySelector('a[href="register.html"]');
        
        if (loginLink) {
            loginLink.textContent = '📊 Dashboard';
            loginLink.href = 'dashboard.html';
        }
        
        if (registerLink) {
            registerLink.textContent = '🚪 Cerrar Sesión';
            registerLink.href = '#';
            registerLink.onclick = function(e) {
                e.preventDefault();
                cerrarSesion();
            };
        }
    }
}

function cerrarSesion() {
    if (confirm('¿Deseas cerrar sesión?')) {
        const recordarme = localStorage.getItem('recordarme');
        
        if (recordarme !== 'true') {
            localStorage.removeItem('usuarioActual');
        }
        
        window.location.reload();
    }
}
