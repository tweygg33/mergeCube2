// Initialisieren aller Touch-Funktionen
touchaktionen.rotationRegister();
touchaktionen.alleFunktionen();
// Globale Variablen initialisieren
globale_variablen.samsung_check();
window.onload = () => {
   cameraController.initCameraSelection();  
    // Verhindern von ungewollten Zoom-Interaktionen
    document.addEventListener('touchmove', function(event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, { passive: false });
    // Verhindern von Doppeltipp-Zoom
    document.addEventListener('dblclick', function(event) {
        event.preventDefault();
    }, { passive: false });
    // Verhindern von Zoom mit Strg+Mausrad
    document.addEventListener('wheel', function(event) {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, { passive: false });
};

