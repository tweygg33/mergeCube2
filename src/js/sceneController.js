const sceneController = {
    // Methode zur Initialisierung der AR-Szene
    async initializeARScene() {   
        try {
            // Zeige den AR-Container und verstecke die Info
            document.getElementById('ar-container').style.display = 'block';
            document.getElementById('navbar').style.display = 'none';
            document.getElementById('hero').style.display = 'none';
            
            // Erstelle die A-Frame Szene mit <a-assets> für das Preloading
            const arContainer = document.getElementById('ar-container');
            arContainer.innerHTML = `
                <a-scene embedded arjs='patternRatio: 0.9; sourceType: webcam; detectionMode: mono;'>
                    <!-- Assets vorab laden -->
                    <a-assets>
                        <a-asset-item id="model1" src="src/img/glb/luefter.glb"></a-asset-item>
                        <a-asset-item id="model2" src="src/img/glb/laptop.glb"></a-asset-item>
                        <a-asset-item id="model3" src="src/img/glb/cpu.glb"></a-asset-item>
                        <a-asset-item id="model4" src="src/img/glb/ssd.glb"></a-asset-item>
                        <a-asset-item id="model5" src="src/img/glb/motherboard.glb"></a-asset-item>
                        <a-asset-item id="model6" src="src/img/glb/luefter.glb"></a-asset-item>
                    </a-assets>
        
                    <!-- Marker für die 6 Seiten eines Würfels -->
                   
                    <!-- Marker 1 -->
                    <a-marker type="pattern" url="src/patt-dateien/luefter.patt" id="marker1">
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
                    <a-marker type="pattern" url="src/patt-dateien/laptop.patt" id="marker2">
                        <a-entity id="model-container-2"
                                  gltf-model="#model2"
                                  animation-mixer="clip: *; loop: repeat; timeScale: 1"
                                  scale="0.05 0.05 0.05"  
                                  position="0 0 0"
                                  rotation="0 0 0"
                                  rotation-order="XYZ"
                                  visible="false">
                        </a-entity>
                    </a-marker>
        
                    <!-- Marker 3 -->
                    <a-marker type="pattern" url="src/patt-dateien/cpu.patt" id="marker3">
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
                    <a-marker type="pattern" url="src/patt-dateien/ssd.patt" id="marker4">
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
                    <a-marker type="pattern" url="src/patt-dateien/motherboard.patt" id="marker5">
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
                    <a-marker type="pattern" url="src/patt-dateien/gpu.patt" id="marker6">
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
        
        // Zugriff auf die neu erstellte Szene (falls benötigt)
        const scene = arContainer.querySelector('a-scene');
        if (scene) {
            scene.addEventListener('loaded', () => {
                console.log('Die A-Frame Szene wurde erfolgreich geladen.');
            });
        } else {
            console.error('Keine <a-scene> im AR-Container gefunden.');
        }
    
        // Samsung Check überwachen
        globale_variablen.monitorARScale();
        // Initialisiere die Marker-Events
        this.initializeMarkerEvents();
    } catch (error) {
        console.error('Fehler bei der Initialisierung der AR-Szene:', error);
        alert('Fehler bei der Initialisierung der AR-Szene.');
    }
    },

    // Methode zur Initialisierung der Marker-Events
    initializeMarkerEvents() {      
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
};
