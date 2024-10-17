
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
        //Aktiviere Kamera um die Namen herauszubekommen wegen der Berechtigung
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
        const kameraliste = document.getElementById('kamerainfo');
        videoInputDevices.forEach(geraet=>{
            const para = document.createElement('p');
            para.textContent = geraet.label;
            kameraliste.appendChild(para)
        })
        
    } catch {

    }
};
kameraAuswahl()