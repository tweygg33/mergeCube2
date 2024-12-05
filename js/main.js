// Registrieren der rotation-order Komponente außerhalb von initializeARScene
AFRAME.registerComponent('rotation-order', {
    schema: { type: 'string', default: 'XYZ' },
    init: function () {
        this.el.object3D.rotation.order = this.data;
    }
});
// Initialisieren aller Touch-Funktionen
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

// Funktion zur Initialisierung der AR-Szene
// Erstellt die A-Frame AR-Szene mit definierten Markern und 3D-Modellen
// Fügt die Rotations- und Zoom-Logik hinzu


// Funktion zur Initialisierung der Marker-Events
// Verfolgt das aktuell sichtbare Marker und Modell
function initializeMarkerEvents() {      
    const markers = document.querySelectorAll('a-marker');
    let currentVisibleMarker = null;
    markers.forEach(marker => {
        marker.addEventListener('markerFound', () => {
            if (currentVisibleMarker && currentVisibleMarker !== marker) {
                // Verstecke das vorherige Modell
                const previousModel = currentVisibleMarker.querySelector('a-entity');
                if (previousModel) {
                    previousModel.setAttribute('visible', 'false');
                }
            }
            // Zeige das aktuelle Modell
            const model = marker.querySelector('a-entity');
            if (model) {
                model.setAttribute('visible', 'true');
                touchaktionen.currentModel = model; // Aktuelles Modell setzen
            }

            currentVisibleMarker = marker;
        });
        marker.addEventListener('markerLost', () => {
            // Verstecke das Modell, wenn der Marker verloren geht
            const lostModel = marker.querySelector('a-entity');
            if (lostModel) {
                lostModel.setAttribute('visible', 'false');
            }

            // Suche nach einem anderen sichtbaren Marker
            let anotherVisibleMarker = null;
            markers.forEach(m => {
                if (m.object3D.visible && m !== marker) {
                    anotherVisibleMarker = m;
                }
            });
            if (anotherVisibleMarker) {
                const anotherModel = anotherVisibleMarker.querySelector('a-entity');
                if (anotherModel) {
                    anotherModel.setAttribute('visible', 'true');
                    touchaktionen.currentModel = anotherModel; // Aktuelles Modell aktualisieren
                }
                currentVisibleMarker = anotherVisibleMarker;
            } else {
                currentVisibleMarker = null;
                touchaktionen.currentModel = null; // Kein Modell sichtbar
            }
        });
    });
}
