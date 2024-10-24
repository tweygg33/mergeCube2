
// Gibt den URL-Namen zurück
// Kamera ID wird zurückgegeben 
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

async function kameraAuswahl(){
    try {
        //Aktiviere Kamera um die Berechtigung zu erhalten
        const initialStream = await navigator.mediaDevices.getUserMedia({ video: true});
        console.log(initialStream)
        //Stoppt alle Kameras
        initialStream.getTracks().forEach(track => track.stop());
        //Liste aller Geräte intern
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices)
        //Filtern geräte nur auf Video
        let videoInputDevices = devices.filter(device => device.kind === 'videoinput');
        console.log(videoInputDevices)
        if (videoInputDevices.length === 0) {
            throw new Error('Keine Videokameras gefunden.');
        }
         // Liste der Kameras in Kamera-Select hinzufügen
        const cameraSelect = document.getElementById('camera-select');
        videoInputDevices.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Kamera ${index + 1}`;
            cameraSelect.appendChild(option);
        });

        //Die ertse RÜCKKAMERA automatisch auswählen und 
        let selectedDevice = videoInputDevices.find(device=>
            device.label.toLowerCase().includes('rear') ||
            device.label.toLocaleLowerCase().includes('back') ||
            device.label.toLocaleLowerCase().includes('rück')
        ) || videoInputDevices[0];
        cameraSelect.value = selectedDevice.deviceId;
        document.getElementById('selected-camera').textContent = `Aktive Kamera: ${selectedDevice.label || "Kein Kamera-Label vorhanden"}`;
        // Event Listener für Kamerawechsel
        cameraSelect.addEventListener('change', ()=>{
            selectedDevice = videoInputDevices.find(device => device.deviceId === cameraSelect.value);
            document.getElementById('selected-camera').textContent = `Aktive Kamera: ${selectedDevice.label || "Kein Kamera-Label vorhanden"}`;
        })

        //AR-BUTTON -AR-Starten 
        document.getElementById('start-ar-button').addEventListener('click',async()=>{
            if(selectedDevice) {
                document.getElementById('loading-indicator').style.display='block';
                try {
                      // Überschreibe getUserMedia, um die ausgewählte Kamera zu verwenden
                    overrideGetUserMedia(selectedDevice.deviceId);

                    document.getElementById('ar-container').style.display = 'block';
                    // AN DIESER STELLE KOMMEN PAAR FEATURES
                    
                    await initializeARScene();
                    // document.getElementById('ar-container').style.display = 'block';
                }catch(error){
                    console.error("Fehler beim initialisieren der AR-SZene:",error);
                    alert("Fehler beim starten der AT-Anwendung")
                }finally {
                    document.getElementById("loading-indicator").style.display = "none";
                }
            }else {
                alert("Bitte wähle eine Kamera aus");
            }
        });
    } catch(error) {
            console.error("Fehler beim Zugriff auf die Kamere:",error);
            document.getElementById("selected-camera").textContent = "Fehler beim Zugriff auf die Kamera";
    }
    
};
        // Überschreibt die getUsermieda-Methode um das ausgewählte im Select auch zu übernehmen für die Szene
        function overrideGetUserMedia(selectedDeviceId) {
            const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

            navigator.mediaDevices.getUserMedia = function(constraints) {
                if (constraints.video && selectedDeviceId) {
                    // Setze deviceId in den Video-Constraints
                    constraints.video = {
                        ...constraints.video,
                        deviceId: { exact: selectedDeviceId }
                    };
                }
                return originalGetUserMedia(constraints);
            };
        }


            async function  initializeARScene() {
                const arContainer = document.getElementById('ar-container');
    arContainer.innerHTML = `
                <a-scene embedded arjs='sourceType: webcam; detectionMode: mono;'>
                    <!-- Assets vorab laden -->
                    <a-assets>
                        <a-asset-item id="model1" src="glb/CPUgerade1.glb"></a-asset-item>
                        <a-asset-item id="model2" src="glb/combat_ninja_inspired_by_jin-roh_wolf_brigade.glb"></a-asset-item>
                        <a-asset-item id="model3" src="glb/futuristic_building(2).glb"></a-asset-item>
                        <a-asset-item id="model4" src="glb/futuristic_building(2).glb"></a-asset-item>
                        <a-asset-item id="model5" src="glb/futuristic_building(2).glb"></a-asset-item>
                        <a-asset-item id="model6" src="glb/futuristic_building(2).glb"></a-asset-item>
                    </a-assets>

                    <!-- Marker für die 6 Seiten eines Würfels -->
                    
                    <!-- Marker 1 -->
                    <a-marker type="pattern" url="pattern2/pattern-a1.patt" id="marker1">
                        <a-entity id="model-container-1"
                                  gltf-model="#model1"
                                  scale="0.1 0.1 0.1"  
                                  position="0 0 0"
                                  rotation="0 0 0" 
                                  >
                        </a-entity>
                    </a-marker>

                    <!-- Marker 2 -->
                    <a-marker type="pattern" url="pattern2/pattern-a2.patt" id="marker2">
                        <a-entity id="model-container-2"
                                  gltf-model="#model2"
                                  scale="0.06 0.06 0.06"  
                                  position="0 0 0"

>
                        </a-entity>
                    </a-marker>

                    <!-- Marker 3 -->
                    <a-marker type="pattern" url="pattern2/pattern-a3.patt" id="marker3">
                        <a-entity id="model-container-3"
                                  gltf-model="#model3"
                                  scale="0.5 0.5 0.5"  
                                  position="0 0 0"
                                  visible="false">
                        </a-entity>
                    </a-marker>

                    <!-- Marker 4 -->
                    <a-marker type="pattern" url="pattern2/pattern-a4.patt" id="marker4">
                        <a-entity id="model-container-4"
                                  gltf-model="#model4"
                                  scale="0.7 0.7 0.7" 
                                  position="0 0 0"
                                  visible="false">
                        </a-entity>
                    </a-marker>

                    <!-- Marker 5 -->
                    <a-marker type="pattern" url="pattern2/pattern-a5.patt" id="marker5">
                        <a-entity id="model-container-5"
                                  gltf-model="#model5"
                                  scale="0.6 0.6 0.6"   
                                  position="0 0 0"
                                  visible="false">
                        </a-entity>
                    </a-marker>

                    <!-- Marker 6 -->
                    <a-marker type="pattern" url="pattern2/pattern-a6.patt" id="marker6">
                        <a-entity id="model-container-6"
                                  gltf-model="#model6"
                                  scale="0.5 0.5 0.5"  
                                  position="0 0 0"
                                  visible="false">
                        </a-entity>
                    </a-marker>

                    <!-- Kamera in der Szene -->
                    <a-entity camera></a-entity>
                </a-scene>
            `;

            }
    
            window.onload = () => {
                kameraAuswahl()
            };


