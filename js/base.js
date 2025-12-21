// Detectar la ruta base automáticamente
// Esto funciona tanto en desarrollo local como en GitHub Pages
(function() {
    window.getBasePath = function() {
        const pathname = window.location.pathname;
        
        // Si estamos en localhost o desarrollo local, no agregar prefijo
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return '';
        }
        
        // Si la URL contiene /Blog-Bootstrap/ o /Blog_Bootstrap/, extraer la ruta
        const match = pathname.match(/^\/([^/]+\/)/);
        if (match && (match[1].toLowerCase().includes('blog'))) {
            return '/' + match[1].slice(0, -1);
        }
        
        return '';
    };
    
    window.BASE_PATH = window.getBasePath();
    
    // Función auxiliar para construir URLs
    window.basePath = function(path) {
        return window.BASE_PATH + path;
    };
})();
