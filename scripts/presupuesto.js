document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ JS cargado correctamente");

    // --- VARIABLES ---
    const form = document.getElementById("form-presupuesto");
    const plan = document.getElementById("plan");
    const numPersonas = document.getElementById("numPersonas");
    // Nuevo campo Plazo de Suscripción
    const plazoSus = document.getElementById("plazoSus"); 
    const extras = Array.from(document.querySelectorAll(".extra"));
    const chkCondiciones = document.getElementById("aceptar-condiciones");
    const btnEnviar = document.getElementById("btn-enviar");
    const btnCalcular = document.getElementById("calcular"); // Mantenemos el botón de calcular con su funcionalidad
    const btnReset = document.getElementById("resetear");
    const resultadoSpan = document.getElementById("cantidad");
    const descuentoInfo = document.getElementById("descuento-info");
    const personasDiv = document.getElementById("grupo-personas");
    const contactoInputs = Array.from(document.querySelectorAll("#datos-contacto input"));

    // Inicial: Ocultar o mostrar Personas
    personasDiv.style.display = plan.value === "9" ? "flex" : "none";
    btnEnviar.disabled = true;
    
    // --- FUNCIÓN DE VALIDACIÓN DE CONTACTO ---
    function validateInput(input) {
        const value = input.value.trim();
        const id = input.id;
        let isValid = false;

        switch (id) {
            case 'nombre':
                // Solo letras, máx. 15.
                isValid = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,15}$/.test(value);
                break;
            case 'apellidos':
                // Solo letras, máx. 40.
                isValid = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,40}$/.test(value);
                break;
            case 'telefono':
                // 9 dígitos numéricos
                isValid = /^\d{9}$/.test(value);
                break;
            case 'email':
                // Estándar de email
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                break;
            default:
                isValid = true;
        }

        // Feedback visual (rojo/verde)
        input.style.border = value.length > 0 && isValid ? "2px solid green" : (value.length > 0 ? "2px solid red" : "1px solid #ccc");
        return isValid;
    }

    // Chequea si todos los campos de contacto son válidos y la aceptación
    function validateAllContactFields(showFeedback = false) {
        let allContactValid = true;
        
        // 1. Validar inputs de contacto
        contactoInputs.forEach(input => {
            // El showFeedback se usa en el submit para forzar el feedback visual
            if (!validateInput(input) || input.value.trim().length === 0) {
                allContactValid = false;
                if (showFeedback) input.style.border = "2px solid red";
            } else if (!showFeedback) {
                input.style.border = "2px solid green";
            }
        });

        // 2. Validar aceptación de condiciones
        const condicionesAceptadas = chkCondiciones.checked;

        // 3. Controlar botón de envío
        btnEnviar.disabled = !(allContactValid && condicionesAceptadas);

        return allContactValid && condicionesAceptadas;
    }

    // --- FUNCIÓN DE CÁLCULO DE PRESUPUESTO CON DESCUENTO ---
    function computeTotal() {
        let total = parseFloat(plan.value) || 0;
        let descuento = 0;
        
        // El valor del select es el porcentaje de descuento (0, 0.05, o 0.15)
        const porcentajeDescuento = parseFloat(plazoSus.value) || 0; 
        const plazoTexto = plazoSus.options[plazoSus.selectedIndex].text; 

        // 1. Cálculo base (Plan)
        if (plan.value === "9") {
            const personas = parseInt(numPersonas.value) || 3;
            total *= personas;
        }

        // 2. Cálculo de Extras
        extras.forEach(extra => {
            if (extra.checked) total += parseFloat(extra.value) || 0;
        });

        // 3. Aplicación de Descuento por Plazo
        if (porcentajeDescuento > 0) {
            descuento = total * porcentajeDescuento;
            total -= descuento;
        }

        // 4. Mostrar información del descuento
        if (descuento > 0) {
            descuentoInfo.textContent = `¡Descuento aplicado por ${plazoTexto.replace(/\s\(.*\)/, '')}: -${descuento.toFixed(2)}€!`;
        } else {
            descuentoInfo.textContent = '';
        }

        return total;
    }

    // --- CÁLCULO DINÁMICO ---
    function autoCalculate(highlight = false) {
        // Ocultar/mostrar el input de personas basado en el plan
        personasDiv.style.display = plan.value === "9" ? "flex" : "none";

        const total = computeTotal();
        resultadoSpan.textContent = `${total.toFixed(2)}€`;

        if (highlight) {
            resultadoSpan.classList.add("activo");
            setTimeout(() => resultadoSpan.classList.remove("activo"), 700);
        }
        
        // Mantener el control del botón Enviar en cada cambio
        validateAllContactFields(); 
    }

    // --- EVENTOS DE CÁLCULO DINÁMICO ---
    plan.addEventListener("change", () => autoCalculate(true));
    plazoSus.addEventListener("change", () => autoCalculate(true)); // Nuevo listener para plazo
    
    numPersonas.addEventListener("input", () => {
        // Aseguramos que el mínimo sea 3
        const personasVal = parseInt(numPersonas.value);
        if (personasVal === "" || personasVal < 3) {
             // Si es vacío o menor a 3, forzamos a 3 para el cálculo inmediato
             numPersonas.value = 3; 
        }
        autoCalculate(true);
    });
    
    extras.forEach(chk => chk.addEventListener("change", () => autoCalculate(true)));

    // --- EVENTOS DE VALIDACIÓN Y CONTROL DE BOTÓN ---
    contactoInputs.forEach(input => {
        input.addEventListener("input", () => {
            validateInput(input);
            validateAllContactFields(); // Controla el botón de envío
        });
        input.addEventListener("blur", () => {
            validateInput(input);
        });
    });

    chkCondiciones.addEventListener("change", () => {
        validateAllContactFields(); // Controla el botón de envío
    });

    // --- EVENTOS DE BOTONES ---
    
    // El botón de Calcular solo genera el efecto confirmatorio (Requisito)
    btnCalcular.addEventListener("click", (e) => {
        e.preventDefault();
        
        // La validación interna para mostrar/no mostrar el efecto
        if (validateAllContactFields(true)) {
            autoCalculate(true); 
        } else {
             // Si falla la validación, damos feedback visual a los campos
             alert("⚠️ Por favor, complete y valide los Datos de contacto antes de confirmar.");
        }
    });

    // Envío del formulario
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Re-validación final con feedback visual
        if (validateAllContactFields(true)) {
            const totalFinal = computeTotal().toFixed(2);
            alert(`✅ ¡Plan contratado con éxito! Se ha enviado el presupuesto a su correo.\nPresupuesto final: ${totalFinal}€`);
            // Aquí iría la lógica AJAX de envío real
        } else {
            alert("❌ Por favor, revisa los Datos de contacto y acepta las condiciones para poder enviar el plan.");
        }
    });

    // Botón de Resetear
    btnReset.addEventListener("click", () => {
        form.reset();
        // Resetear valores por defecto y estilos
        plan.value = "0";
        numPersonas.value = "3";
        plazoSus.value = "0"; // Resetear el nuevo campo de plazo
        personasDiv.style.display = "none";
        contactoInputs.forEach(i => i.style.border = "1px solid #ccc");
        btnEnviar.disabled = true;
        autoCalculate(false);
        descuentoInfo.textContent = '';
    });

    // Cálculo inicial
    autoCalculate();
});