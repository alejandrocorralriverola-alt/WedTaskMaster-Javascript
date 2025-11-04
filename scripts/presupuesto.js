document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ JS cargado correctamente");

  const form = document.getElementById("form-presupuesto");
  const plan = document.getElementById("plan");
  const numPersonas = document.getElementById("numPersonas");
  const extras = Array.from(document.querySelectorAll(".extra"));
  const btnCalcular = document.getElementById("calcular");
  const btnReset = document.getElementById("resetear");
  const resultado = document.getElementById("cantidad");
  const personasDiv = document.getElementById("grupo-personas");

  // Inicial
  personasDiv.style.display = plan.value === "9" ? "flex" : "none";

  // --- UTIL: calcula total (sin validar campos) ---
  function computeTotal() {
    let total = parseFloat(plan.value) || 0;
    if (plan.value === "9") {
      const personas = parseInt(numPersonas.value) || 3;
      total *= personas;
    }
    extras.forEach(extra => {
      if (extra.checked) total += parseFloat(extra.value) || 0;
    });
    return total;
  }

  // --- VALIDACIONES ---
  function validarCamposWithFeedback() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre || !apellidos || !telefono || !email) {
      alert("⚠️ Todos los campos son obligatorios");
      return false;
    }
    if (!/^\d{9}$/.test(telefono)) {
      alert("⚠️ El teléfono debe tener 9 dígitos numéricos");
      return false;
    }
    if (!emailRegex.test(email)) {
      alert("⚠️ Introduce un email válido");
      return false;
    }
    return true;
  }

  function validarCamposSilent() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre || !apellidos || !telefono || !email) return false;
    if (!/^\d{9}$/.test(telefono)) return false;
    if (!emailRegex.test(email)) return false;
    return true;
  }

  // --- FUNCIONES DE RENDER ---
  function showResult(value, highlight = false) {
    resultado.textContent = `${value.toFixed(2)}€`;
    // resalte: aplicar clase .activo (CSS debe definir visual)
    if (highlight) {
      resultado.classList.add("activo");
      setTimeout(() => resultado.classList.remove("activo"), 700);
    }
  }

  // --- CÁLCULOS ---
  // Autocalculo silencioso (muestra estimado aunque datos contacto no completos)
  function autoCalculate() {
    const total = computeTotal();
    showResult(total, false); // sin highlight definitivo
  }

  // Cálculo al pulsar botón (requiere validación)
  function calcularConValidacion(event) {
    event && event.preventDefault();
    if (!validarCamposWithFeedback()) {
      showResult(0, true);
      return;
    }
    const total = computeTotal();
    showResult(total, true); // mostrar con highlight
  }

  // --- EVENTOS ---
  plan.addEventListener("change", () => {
    personasDiv.style.display = plan.value === "9" ? "flex" : "none";
    autoCalculate();
  });

  numPersonas.addEventListener("input", () => {
    if (numPersonas.value === "" || parseInt(numPersonas.value) < 3) {
      numPersonas.value = 3;
    }
    autoCalculate();
  });

  extras.forEach(chk => chk.addEventListener("change", () => autoCalculate()));

  // recalcular en input de contacto pero sin alertas (solo si están válidos)
  const contactoInputs = Array.from(document.querySelectorAll("#form-presupuesto input"));
  contactoInputs.forEach(input => {
    input.addEventListener("input", () => {
      input.style.border = "2px solid #e6007e";
      input.style.backgroundColor = "#fff";
      // Si los datos de contacto están completos y válidos, recalcula y resalta ligeramente
      if (validarCamposSilent()) {
        const total = computeTotal();
        showResult(total, false);
      } else {
        // si no válidos, mostramos estimado sin alertas
        autoCalculate();
      }
    });
  });

  btnCalcular.addEventListener("click", calcularConValidacion);

  btnReset.addEventListener("click", (e) => {
    e.preventDefault();
    form.reset();
    plan.value = "0";
    numPersonas.value = "3";
    personasDiv.style.display = "none";
    extras.forEach(e => e.checked = false);
    showResult(0, false);
    contactoInputs.forEach(i => {
      i.style.border = "1px solid #ccc";
      i.style.backgroundColor = "#fff";
    });
  });

  // cálculo inicial (estimado)
  autoCalculate();
});
