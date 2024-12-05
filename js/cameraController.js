// cameraController.js

const cameraController = {
    selectedDeviceId: null,
    // Methode zur Initialisierung der Kameraauswahl
    async initCameraSelection() {
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
            this.selectedDeviceId = videoInputDevices.find(device =>
                device.label.toLowerCase().includes('rear') ||
                device.label.toLowerCase().includes('back') ||
                device.label.toLowerCase().includes('rück')
            )?.deviceId || videoInputDevices[0].deviceId;

            // Event Listener für "AR starten" Button
            const startButton = document.getElementById('start-ar-button');
            if (startButton) {
                startButton.addEventListener('click', async () => {
                    if (this.selectedDeviceId) {
                        document.getElementById('loading-indicator').style.display = 'block';
                        document.getElementById('main').style.display = "none";
                        try {
                            // Überschreibe getUserMedia, um die ausgewählte Kamera zu verwenden
                            this.overrideGetUserMedia(this.selectedDeviceId);
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
                        alert('Bitte wähle eine gültige Kamera aus.');
                    }
                });
            } else {
                console.error('Button mit der ID "start-ar-button" wurde nicht gefunden.');
            }
        } catch (error) {
            console.error('Fehler beim Zugriff auf die Kamera:', error);
            alert('Fehler beim Zugriff auf die Kamera. Bitte überprüfen Sie Ihre Berechtigungen.');
        }
    },

    // Methode zur Überschreibung von getUserMedia, um eine spezifische Kamera zu verwenden
    overrideGetUserMedia(selectedDeviceId) {
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = (constraints) => {
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
};
