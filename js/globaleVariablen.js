
const globale_variablen = {
    //Globale Variablen für Samsung Check
    samsung_check() {
        let zoomFoto = document.createElement("div");
        zoomFoto.setAttribute("id","zoomFoto");
        let button = document.createElement("button");  
        button.setAttribute("class", "start-button");
        button.setAttribute("id","start-ar-button");
        button.textContent = "Starten";         
 if (localStorage.getItem("zoomActive") === "true") {
        document.querySelectorAll('.hero-content').forEach(e=>{
            e.innerHTML="";
        }) 
        document.querySelector(".hero-content").style.background ="none";
        document.querySelector(".hero-content").style.boxShadow = "none";
        document.querySelector(".cube-container").style.display= "none";
        document.querySelector(".hero-content").insertAdjacentElement("afterbegin",zoomFoto);
        zoomFoto.insertAdjacentElement("afterend",button);          
 } else {
        document.querySelectorAll('.hero-content').forEach(e=>{
            e.innerHTML="";
        }) 
        let h1 = document.createElement("h1");
        h1.textContent = "Erlebe Erweiterte Realität";
        let p = document.createElement("p");
        p.setAttribute("class","description");
        p.textContent = "Interagiere mit 3D-Objekten";
        document.querySelector(".hero-content").insertAdjacentElement("afterbegin",h1);
        h1.insertAdjacentElement("afterend",p);
        p.insertAdjacentElement("afterend",button)
 };
    },

     // Funktion, um den User-Agent zu prüfen und den Text anzuzeigen
    //SAMSUNG BROWSER
    monitorARScale() {
        // Prüfen, ob der Samsung-Browser genutzt wird
        if (!window.navigator.userAgent.includes("SamsungBrowser")) return;
    
        const scene = document.querySelector('a-scene');
        if (!scene) return; // Keine Szene vorhanden
    
        // Ursprüngliche Maße der Szene speichern (außerhalb des Intervalls)
        const initialRect = scene.getBoundingClientRect();
    
        // Intervall zur Überwachung der Skalierung
        setInterval(() => {
            // Aktuelle Maße der Szene abrufen
            const currentRect = scene.getBoundingClientRect();
    
            // Vergleich der aktuellen Größe mit der ursprünglichen
            const isZoomed =
                Math.abs(currentRect.width - initialRect.width) > 5 ||
                Math.abs(currentRect.height - initialRect.height) > 5;
    
            if (isZoomed) {
                localStorage.setItem("zoomActive", "true");
                location.reload();
            } else {
                localStorage.setItem("zoomActive", "false");
                // Blende Warntext aus, wenn Zoom zurückgesetzt wurde
            }
        }, 500); // Überprüfung alle 500 ms
    },
};