document.addEventListener("DOMContentLoaded", () => {
    
    const tags = document.querySelectorAll(".bs-tag");
    const sensorPasos = document.getElementById("sensorPasos");
    const sensorCaidas = document.getElementById("sensorCaidas");

    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            
            tags.forEach(t => t.classList.remove("active"));
            tag.classList.add("active");

            
            const profile = tag.getAttribute("data-profile");
            if (profile === "deportivo") {
                sensorPasos.textContent = "en vivo (alta act.)";
                sensorCaidas.textContent = "vigilando";
            } else if (profile === "adulto") {
                sensorPasos.textContent = "monitoreando";
                sensorCaidas.textContent = "activo (caídas)";
            } else if (profile === "nino") {
                sensorPasos.textContent = "zona escolar";
                sensorCaidas.textContent = "seguro";
            }
        });
    });

    const btnEstoyBien = document.getElementById("btnEstoyBien");
    const statusDot = document.getElementById("phoneStatusDot");

    btnEstoyBien.addEventListener("click", () => {
        statusDot.style.background = "#2EE6A6"; 
        alert("¡Estado enviado! Tu familia ha recibido el aviso de que estás bien.");
    });

    
    const btnAyuda = document.getElementById("btnAyuda");

    btnAyuda.addEventListener("click", () => {
        statusDot.style.background = "#FF5C6C"; 
        alert("¡ALERTA ACTIVADA! Se ha enviado una señal de ayuda y ubicación a tus contactos.");
    });
});