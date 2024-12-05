globale_variablen.samsung_check();
async function initCameraSelection() {
    try {
// Erlaubnis zum Kamerazugriff einholen
const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
initialStream.getTracks().forEach(track => track.stop());  // Stream sofort stoppen, da nur die Erlaubnis benötigt wird
// Geräte auflisten
const devices = await navigator.mediaDevices.enumerateDevices();
let videoInputDevices = devices.filter(device => device.kind === 'videoinput');
if (videoInputDevices.length === 0) {
    throw new Error('Keine Videokameras gefunden.');
}
// Automatisch die erste Rückkamera auswählen, falls vorhanden
let selectedDevice = videoInputDevices.find(device =>
    device.label.toLowerCase().includes('rear') ||
    device.label.toLowerCase().includes('back') ||
    device.label.toLowerCase().includes('rück')
) || videoInputDevices[0];
// Event Listener für "AR starten" Button
document.getElementById('start-ar-button').addEventListener('click', async () => {
    const scene = document.querySelector('a-scene');
    if (selectedDevice) {
        document.getElementById('loading-indicator').style.display = 'block';
        document.getElementById('main').style.display="none";
        try {
            // Überschreibe getUserMedia, um die ausgewählte Kamera zu verwenden
            overrideGetUserMedia(selectedDevice.deviceId);
            // Initialisiere die AR-Szene
            await initializeARScene();
            // Zeige den AR-Container und verstecke die Kameraauswahl und Info
            document.getElementById('ar-container').style.display = 'block';
        } catch (error) {
            console.error('Fehler beim Initialisieren der AR-Szene:', error);
            alert('Fehler beim Starten der AR-Anwendung.');
        } finally {
            document.getElementById('loading-indicator').style.display = 'none';
        }
    } else {
        alert('Bitte wähle eine Kamera aus.');
    }
});
} catch (error) {
console.error('Fehler beim Zugriff auf die Kamera:', error);
}
}
 // Funktion zur Überschreibung von getUserMedia, um eine spezifische Kamera zu verwenden
//  selectedDeviceId - Die deviceId der ausgewählten Kamera
function overrideGetUserMedia(selectedDeviceId) {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(constraints) {
        if (constraints.video && selectedDeviceId) {
            // Setze deviceId in den Video-Constraints
            constraints.video = {
                ...constraints.video,
                deviceId: { exact: selectedDeviceId },
                width: { ideal: 1280 },
               height: { ideal: 720 }
            };  
        }
        return originalGetUserMedia(constraints);
    };
}
 // Funktion zur Initialisierung der AR-Szene
 // Erstellt die A-Frame AR-Szene mit definierten Markern und 3D-Modellen
 // Fügt die Rotations- und Zoom-Logik hinzu
async function initializeARScene() {   
//  if (window.navigator.userAgent.includes("SamsungBrowser")) {
  
    // Zeige den AR-Container und verstecke die Info
    document.getElementById('ar-container').style.display = 'block';
    document.getElementById('navbar').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
    // Erstelle die A-Frame Szene mit <a-assets> für das Preloading
    const arContainer = document.getElementById('ar-container');
    arContainer.innerHTML = `
        <a-scene  embedded arjs='patternRatio: 0.9; sourceType: webcam; detectionMode: mono;'>
            <!-- Assets vorab laden -->
            <a-assets>
                <a-asset-item id="model1" src="glb/2.0 Lüfter_Ventilator.glb"></a-asset-item>
                <a-asset-item id="model2" src="glb/CPU mit animation kleiner.glb"></a-asset-item>
                <a-asset-item id="model3" src="glb/2.0 Lüfter_Ventilator.glb"></a-asset-item>
                <a-asset-item id="model4" src="glb/2.0 Lüfter_Ventilator.glb"></a-asset-item>
                <a-asset-item id="model5" src="glb/2.0 Lüfter_Ventilator.glb"></a-asset-item>
                <a-asset-item id="model6" src="glb/2.0 Lüfter_Ventilator.glb"></a-asset-item>
            </a-assets>

            <!-- Marker für die 6 Seiten eines Würfels -->
           
            <!-- Marker 1 -->
            <a-marker type="pattern" url="pattern2/pattern-CPU-final.patt" id="marker1">
                <a-entity id="model-container-1"
                          gltf-model="#model1"
                          animation-mixer="clip: *; loop: repeat; timeScale: 1"
                          scale="0.4 0.4 0.4"  
                          position="0 0 0"
                          rotation="-90 0 0"
                          rotation-order="XYZ"
                          visible="false">
                </a-entity>
            </a-marker>

            <!-- Marker 2 -->
            <a-marker type="pattern" url="whiteImages/gpu.patt" id="marker2">
                <a-entity id="model-container-2"
                          gltf-model="#model2"
                          animation-mixer="clip: *; loop: repeat; timeScale: 1"
                          scale="0.1 0.1 0.1"  
                          position="0 0 0"
                          rotation="0 0 0"
                          rotation-order="XYZ"
                          visible="false">
                </a-entity>
            </a-marker>

            <!-- Marker 3 -->
            <a-marker type="pattern" url="whiteImages/luefter.patt" id="marker3">
                <a-entity id="model-container-3"
                          gltf-model="#model3"
                          animation-mixer="clip: *; loop: repeat; timeScale: 1"
                          scale="0.4 0.4 0.4"  
                          position="0 0 0"
                          rotation="-90 0 0"
                          rotation-order="XYZ"
                          visible="false">
                </a-entity>
            </a-marker>

            <!-- Marker 4 -->
            <a-marker type="pattern" url="pattern2/pattern-motherboard 2.patt" id="marker4">
                <a-entity id="model-container-4"
                          gltf-model="#model4"
                          animation-mixer="clip: *; loop: repeat; timeScale: 1"
                          scale="0.4 0.4 0.4"  
                          position="0 0 0"
                          rotation="-90 0 0"
                          rotation-order="XYZ"
                          visible="false">
                </a-entity>
            </a-marker>

            <!-- Marker 5 -->
            <a-marker type="pattern" url="whiteImages/mouse.patt" id="marker5">
                <a-entity id="model-container-5"
                          gltf-model="#model5"
                          animation-mixer="clip: *; loop: repeat; timeScale: 1"
                          scale="0.4 0.4 0.4"  
                          position="0 0 0"
                          rotation="-90 0 0"
                          rotation-order="XYZ"
                          visible="false">
                </a-entity>
            </a-marker>

            <!-- Marker 6 -->
            <a-marker type="pattern" url="pattern2/pattern-SSD 2.patt" id="marker6">
                <a-entity id="model-container-6"
                          gltf-model="#model6"
                          animation-mixer="clip: *; loop: repeat; timeScale: 1" 
                          scale="0.4 0.4 0.4"  
                          position="0 0 0"
                          rotation="-90 0 0"
                          rotation-order="XYZ"
                          visible="false">
                </a-entity>
            </a-marker>

            <!-- Kamera in der Szene -->
            <a-entity camera></a-entity>
        </a-scene>
    `; 
    // globaleVariablen.js (Samsung Check)
    globale_variablen.monitorARScale();
    // Rotation Order Komponente hinzufügen
    AFRAME.registerComponent('rotation-order', {
        schema: { type: 'string', default: 'XYZ' },
        init: function () {
            this.el.object3D.rotation.order = this.data;
        }
    });
    initializeMarkerEvents();
};
 
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
                currentModel = model; // Aktuelles Modell setzen
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
                    currentModel = anotherModel; // Aktuelles Modell aktualisieren
                }
                currentVisibleMarker = anotherVisibleMarker;
            } else {
                currentVisibleMarker = null;
                currentModel = null; // Kein Modell sichtbar
            }
        });
    });
} 
touchaktionen.alleFunktionen();
window.onload = () => {
    initCameraSelection();
    
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