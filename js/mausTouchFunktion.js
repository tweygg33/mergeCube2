// mausTouchFunktion.js

const touchaktionen = {
    // Skalierungsgrenzen
    MIN_SCALE: 0.5,
    MAX_SCALE: 5,

    // Zustandsvariablen
    isMouseDown: false,
    lastMouseX: 0,
    lastMouseY: 0,
    currentModel: null, // Muss initialisiert werden, wenn ein 3D-Modell geladen wird
    initialPinchDistance: null,
    initialScale: 1,

    // Event Listener für Maus- und Touch-Interaktion hinzufügen
    event_touch_interaktion() {
        // Maus-Events
        document.addEventListener('mousedown', (event) => {
            this.isMouseDown = true;
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
        });

        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });

        document.addEventListener('mousemove', (event) => {
            if (!this.isMouseDown || !this.currentModel) return; // Sicherstellen, dass das Modell geladen ist
            const deltaX = event.clientX - this.lastMouseX;
            const deltaY = event.clientY - this.lastMouseY;
            // Zugriff auf das Three.js Objekt
            let object3D = this.currentModel.object3D;
            // Rotation anpassen
            object3D.rotation.y += deltaX * 0.01;
            object3D.rotation.x += deltaY * 0.01;
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
        });

        // Touch-Events
        document.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                this.isMouseDown = true;
                this.lastMouseX = event.touches[0].clientX;
                this.lastMouseY = event.touches[0].clientY;
            } else if (event.touches.length === 2) {
                // Pinch-Zoom beginnen
                this.initialPinchDistance = this.getPinchDistance(event.touches);
                this.initialScale = this.currentModel ? this.currentModel.object3D.scale.x : 1;
            }
        });

        document.addEventListener('touchend', (event) => {
            this.isMouseDown = false;
            // Optional: Reset Pinch-Zoom-Variablen, wenn alle Finger losgelassen werden
            if (event.touches.length < 2) {
                this.initialPinchDistance = null;
                this.initialScale = this.currentModel ? this.currentModel.object3D.scale.x : 1;
            }
        });

        document.addEventListener('touchmove', (event) => {
            if (event.touches.length === 1 && this.isMouseDown && this.currentModel) {
                // Einfache Drag-Bewegung
                const deltaX = event.touches[0].clientX - this.lastMouseX;
                const deltaY = event.touches[0].clientY - this.lastMouseY;
                let object3D = this.currentModel.object3D;
                object3D.rotation.y += deltaX * 0.01;
                object3D.rotation.x += deltaY * 0.01;
                this.lastMouseX = event.touches[0].clientX;
                this.lastMouseY = event.touches[0].clientY;
            } else if (event.touches.length === 2 && this.currentModel) {
                // Pinch-Zoom
                const pinchDistance = this.getPinchDistance(event.touches);
                let scaleChange = pinchDistance / this.initialPinchDistance;
                let newScale = this.clampScale(this.initialScale * scaleChange);
                this.currentModel.object3D.scale.set(newScale, newScale, newScale);
            }
        });
    },

    // Funktion, um die Skalierung zu begrenzen (Min und Max)
    clampScale(scale) {
        return Math.min(this.MAX_SCALE, Math.max(this.MIN_SCALE, scale));
    },

    // Mausrad und Pinch-to-Zoom für Desktop und Mobile
    mausrad_pinchToZoomMobile() {
        // Mouse wheel event für Desktop-Zoom
        document.addEventListener('wheel', (event) => {
            if (this.currentModel) {
                // Skalierung basierend auf der Richtung des Mausrads anpassen
                let newScale = this.currentModel.object3D.scale.x + (event.deltaY * -0.001);
                newScale = this.clampScale(newScale);
                // Neue Skalierung auf das aktuelle Modell anwenden
                this.currentModel.object3D.scale.set(newScale, newScale, newScale);
            }
        });

        // Touch-Events für mobile Pinch-to-Zoom sind bereits in event_touch_interaktion() abgedeckt
    },

    // Berechnet die Distanz zwischen zwei Berührungspunkten
    getPinchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    },

    // Initialisiert alle Funktionen
    alleFunktionen() {
        this.event_touch_interaktion();
        this.mausrad_pinchToZoomMobile();
    }
};
