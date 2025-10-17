function abrirLogin(){
    const modal = document.getElementById("modalLogin");
    if(modal && typeof modal.showModal === "function"){
        modal.showModal();  
    } else {
        alert("Modal não suportado nesse navegador");
    }
}

function rolarParaRapido(){
    const form = document.querySelector("#formRapido");
    if(form){
        form.scrollIntoView({behavior: "smooth", block: "start"});
    }
}

(function inicializarValidacao(){
    const form = document.querySelector("#formRapido");
    if(!form) return;

    const seletorRecurso = form.querySelector("select");
    const campoData = form.querySelector('input[type="date"]');
    const campoInicio = form.querySelector('input[placeholder="Inicio"]');
    const campoFim = form.querySelector('input[placeholder="Fim"]');

    [seletorRecurso, campoData, campoInicio, campoFim].forEach(el => {
        if(!el) return;
        el.addEventListener("input", () => el.style.borderColor = "");
        el.addEventListener("change", () => el.style.borderColor = "");
    });

    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        let valido = true;

        if(seletorRecurso && seletorRecurso.selectedIndex === 0){
            seletorRecurso.style.borderColor = "red";
            valido = false;
        }
        if(campoData && !campoData.value){
            campoData.style.borderColor = "red";
            valido = false;
        }

        const hInicio = campoInicio?.value || '';
        const hFim = campoFim?.value || '';
        
        if(!hInicio) {
            campoInicio.style.borderColor = "red";
            valido = false;
        }    
        if(!hFim) {
            campoFim.style.borderColor = "red";
            valido = false;
        }
        
        if(hInicio && hFim && hFim <= hInicio){
            campoFim.style.borderColor = "red";
            alert("Horário de fim deve ser maior que horário de início");
            valido = false;
        }

        if(!valido){
            alert("Por favor, preencha todos os campos obrigatórios");
            return;
        }

        alert("Reserva simulada com sucesso! Integração real será feita nos próximos sprints");
    });
})();