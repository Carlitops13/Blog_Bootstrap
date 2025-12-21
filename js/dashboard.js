// Verificar sesión al cargar
window.addEventListener('load', function() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    
    if (!usuarioActual) {
        alert('Debes iniciar sesión para acceder al dashboard');
        window.location.href = basePath('/login.html');
        return;
    }
    
    // Cargar información del usuario
    document.getElementById('userName').textContent = usuarioActual.nombres + ' ' + usuarioActual.apellidos;
    document.getElementById('userEmail').textContent = usuarioActual.email;
    document.getElementById('profileNombres').textContent = usuarioActual.nombres;
    document.getElementById('profileApellidos').textContent = usuarioActual.apellidos;
    document.getElementById('profileEmail').textContent = usuarioActual.email;
    document.getElementById('profileUsername').textContent = usuarioActual.username;
    
    // Cargar estadísticas
    actualizarEstadisticas();
    
    // Cargar proyectos
    cargarProyectos();
});

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Mostrar secciones
function showSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(section + '-section');
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Actualizar título
    const titles = {
        'inicio': '<i class="fas fa-chart-line"></i> Dashboard',
        'proyectos': '<i class="fas fa-briefcase"></i> Mis Proyectos',
        'agregar': '<i class="fas fa-plus-circle"></i> Agregar Proyecto',
        'perfil': '<i class="fas fa-user-circle"></i> Mi Perfil',
        'configuracion': '<i class="fas fa-cog"></i> Configuración'
    };
    document.getElementById('pageTitle').innerHTML = titles[section];
    
    // Actualizar active en sidebar
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Si el evento existe, marcar el link activo
    if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];
    document.getElementById('totalProyectos').textContent = proyectos.length;
    document.getElementById('proyectosPublicados').textContent = proyectos.length;
    document.getElementById('vistasTotal').textContent = proyectos.length * 150; // Simulado
}

// Cargar proyectos
function cargarProyectos() {
    const proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];
    const lista = document.getElementById('proyectosList');
    
    if (proyectos.length === 0) {
        lista.innerHTML = '<div class="col-12"><p style="text-align:center; color:#666;" class="lead">No tienes proyectos aún. ¡Agrega tu primer proyecto!</p></div>';
        return;
    }
    
    lista.innerHTML = '';
    proyectos.forEach((proyecto, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card h-100">
                <img src="${proyecto.imagen}" class="card-img-top" alt="${proyecto.titulo}" onerror="this.src='https://via.placeholder.com/400x300/7cbd3c/ffffff?text=${encodeURIComponent(proyecto.titulo)}'">
                <div class="card-body">
                    <h5 class="card-title">${proyecto.titulo}</h5>
                    <p class="card-text">${proyecto.descripcion}</p>
                    <div class="mb-3">
                        ${proyecto.tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`).join('')}
                    </div>
                    ${proyecto.link && proyecto.link !== '#' ? `<a href="${proyecto.link}" target="_blank" class="btn btn-sm btn-info mb-2 w-100"><i class="fas fa-link"></i> Ver Proyecto</a>` : ''}
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-success flex-fill" onclick="editarProyecto(${index})"><i class="fas fa-edit"></i> Editar</button>
                        <button class="btn btn-sm btn-danger flex-fill" onclick="eliminarProyecto(${index})"><i class="fas fa-trash"></i> Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        lista.appendChild(col);
    });
}

// Preview de imagen
document.getElementById('projectImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            previewImg.src = event.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Agregar proyecto
document.getElementById('addProjectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const imageFile = document.getElementById('projectImage').files[0];
    const editIndex = form.dataset.editIndex;
    
    // Función para guardar proyecto
    function guardarProyecto(imagenData) {
        const proyecto = {
            titulo: document.getElementById('projectTitle').value.trim(),
            descripcion: document.getElementById('projectDescription').value.trim(),
            imagen: imagenData,
            tags: document.getElementById('projectTags').value.split(',').map(tag => tag.trim()),
            link: document.getElementById('projectLink').value.trim() || '#',
            fecha: new Date().toISOString()
        };
        
        // Obtener proyectos existentes
        let proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];
        
        // Si es edición, insertar en la posición original
        if (editIndex !== undefined) {
            proyectos.splice(parseInt(editIndex), 0, proyecto);
            delete form.dataset.editIndex;
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Agregar Proyecto';
            }
            alert('¡Proyecto actualizado exitosamente!');
        } else {
            // Agregar nuevo proyecto
            proyectos.push(proyecto);
            alert('¡Proyecto agregado exitosamente!');
        }
        
        // Guardar en localStorage
        localStorage.setItem('proyectos', JSON.stringify(proyectos));
        
        // Limpiar formulario
        form.reset();
        document.getElementById('imagePreview').style.display = 'none';
        
        // Actualizar estadísticas y lista
        actualizarEstadisticas();
        cargarProyectos();
        
        // Ir a sección de proyectos
        showSection('proyectos');
    }
    
    // Si hay una imagen nueva, convertirla a base64
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            guardarProyecto(event.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else if (editIndex !== undefined) {
        // Si es edición y no hay imagen nueva, usar la imagen anterior
        const proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];
        const imagenAnterior = proyectos[editIndex].imagen;
        guardarProyecto(imagenAnterior);
    } else {
        alert('Por favor selecciona una imagen');
    }
});

// Eliminar proyecto
function eliminarProyecto(index) {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) {
        return;
    }
    
    let proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];
    proyectos.splice(index, 1);
    localStorage.setItem('proyectos', JSON.stringify(proyectos));
    
    alert('Proyecto eliminado');
    actualizarEstadisticas();
    cargarProyectos();
}

// Editar proyecto
function editarProyecto(index) {
    const proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];
    const proyecto = proyectos[index];
    
    // Llenar el formulario con los datos del proyecto
    document.getElementById('projectTitle').value = proyecto.titulo;
    document.getElementById('projectDescription').value = proyecto.descripcion;
    document.getElementById('projectTags').value = proyecto.tags.join(', ');
    document.getElementById('projectLink').value = proyecto.link;
    
    // Mostrar preview de la imagen existente
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    previewImg.src = proyecto.imagen;
    preview.style.display = 'block';
    
    // Guardar el índice para edición
    document.getElementById('addProjectForm').dataset.editIndex = index;
    
    // Ir a la sección de agregar
    showSection('agregar');
    
    // Cambiar texto del botón
    const submitBtn = document.querySelector('#addProjectForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Proyecto';
    }
    
    alert('Modifica los datos y guarda el proyecto. La imagen actual se mantendrá si no seleccionas una nueva.');
}

// Exportar datos
function exportarDatos() {
    const proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    
    const data = {
        usuario: usuario,
        proyectos: proyectos,
        fecha: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mis-datos-portafolio.json';
    link.click();
    
    alert('Datos exportados exitosamente');
}

// Limpiar proyectos
function limpiarProyectos() {
    if (!confirm('¿Estás seguro de eliminar TODOS los proyectos? Esta acción no se puede deshacer.')) {
        return;
    }
    
    if (!confirm('Confirma nuevamente: ¿Eliminar todos los proyectos?')) {
        return;
    }
    
    localStorage.removeItem('proyectos');
    alert('Todos los proyectos han sido eliminados');
    actualizarEstadisticas();
    cargarProyectos();
}

// Cerrar sesión
function cerrarSesion() {
    if (confirm('¿Deseas cerrar sesión?')) {
        const recordarme = localStorage.getItem('recordarme');
        
        if (recordarme !== 'true') {
            localStorage.removeItem('usuarioActual');
        }
        
        window.location.href = basePath('/login.html');
    }
}

// Hacer funciones accesibles globalmente
window.toggleSidebar = toggleSidebar;
window.showSection = showSection;
window.editarProyecto = editarProyecto;
window.eliminarProyecto = eliminarProyecto;
window.exportarDatos = exportarDatos;
window.limpiarProyectos = limpiarProyectos;
window.cerrarSesion = cerrarSesion;
