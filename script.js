const form = document.getElementById("remisiones");
const placaInput = document.getElementById("nplaca");
const errorEl = document.getElementById("placa-error");
const dropdown = document.querySelector(".dropdown");
const toggle = document.querySelector(".dropdown-toggle");
const consulta = document.getElementById("consulta-section");
const resultsSection = document.getElementById("results");
const resultsBody = document.getElementById("results-body");
const noFinesToast = document.getElementById("no-fines-toast");
const finesSection = document.getElementById("fines-section");
const finesBody = document.getElementById("fines-body");
const totalSection = document.getElementById("total-section");
const btnBack = document.getElementById("btnBack");
const loadingModal = document.getElementById("loadingModal");

const normalizePlate = (value) => value.toUpperCase().replace(/\s+/g, "");

// Base de datos de vehículos y multas
const vehicleDatabase = {
  P726GVB: {
    placa: "P-726GVB",
    marca: "VOLKSWAGEN",
    color: "GRIS POLICROMADO",
    modelo: "2011",
    hasFines: true,
    total: "Q. 2,184.17",
    fines: [
      {
        fecha: "20-04-2018 12:37:33",
        lugar: "Atanasio_Tzul_Sur_Zona_12",
        motivo: "Exceso de Velocidad permitida, límite 70 k/h detectada 120k/h",
        imagen: "img/jetta.jpg"
      }
    ]
  },
  P165CYY: {
    placa: "P-165CYY",
    marca: "VOLKSWAGEN",
    color: "GRIS URANO",
    modelo: "2006",
    hasFines: true,
    total: "Q. 15,000.00",
    fines: [
      {
        fecha: "15-08-2020 09:15:00",
        lugar: "Calzada_Atanasio_Tzul_Zona_12",
        motivo: "Faltarle el respeto a un agente de tránsito y decir 'Yo soy ingeniero, lo que sobra es plata'",
        imagen: "img/gol.jpg"
      } ]
    },
  P066CSS: {
    placa: "P-066CSS",
    marca: "TOYOTA",
    color: "RAV4 GRIS PLATEADO",
    modelo: "2020",
    hasFines: false
  }
};

// Dropdown functionality
if (toggle && dropdown) {
  toggle.addEventListener("click", () => {
    const isOpen = dropdown.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Back button functionality
if (btnBack) {
  btnBack.addEventListener("click", () => {
    // Ocultar resultados
    resultsSection.style.display = "none";
    // Mostrar consulta
    consulta.style.display = "block";
    // Limpiar el formulario
    placaInput.value = "";
    errorEl.textContent = "";
  });
}

// Form validation and search
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const cleaned = normalizePlate(placaInput.value);
    placaInput.value = cleaned;

    if (cleaned.length < 4 || cleaned.length > 6) {
      errorEl.textContent = "Numero de placa requerida (4 a 6 caracteres)";
      placaInput.focus();
      return;
    }

    errorEl.textContent = "";
    
    // Mostrar modal de cargando
    loadingModal.classList.add("open");
    
    // Simular delay de 1.5 segundos
    setTimeout(() => {
      // Buscar vehículo en la base de datos
      const dbKey = "P" + cleaned;
      const vehicle = vehicleDatabase[dbKey];

      if (vehicle) {
        // Ocultar sección de consulta
        consulta.style.display = "none";
        
        // Mostrar resultados
        resultsBody.innerHTML = `
          <tr>
            <td>${vehicle.placa}</td>
            <td>${vehicle.marca}</td>
            <td>${vehicle.color}</td>
            <td>${vehicle.modelo}</td>
          </tr>
        `;
        resultsSection.style.display = "block";

        // Mostrar multas o toast
        if (vehicle.hasFines) {
          noFinesToast.style.display = "none";
          displayFines(vehicle.fines, vehicle.total);
        } else {
          noFinesToast.style.display = "block";
          finesSection.style.display = "none";
        }
      } else {
        // No encontrado
        consulta.style.display = "none";
        resultsBody.innerHTML = `
          <tr>
            <td colspan="4" style="text-align: center; color: #666;">No se encontraron resultados para la placa ${cleaned}</td>
          </tr>
        `;
        resultsSection.style.display = "block";
        noFinesToast.style.display = "none";
        finesSection.style.display = "none";
      }
      
      // Ocultar modal de cargando
      loadingModal.classList.remove("open");
      
      // Scroll a resultados
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1500);
  });
}

function displayFines(fines, total) {
  let finesHTML = "";
  fines.forEach((fine, index) => {
    finesHTML += `
      <tr>
        <td>${fine.fecha}</td>
        <td data-image="${fine.imagen}" data-fine-index="${index}" class="location-cell">${fine.lugar}</td>
        <td>${fine.motivo}</td>
        <td><img src="${fine.imagen}" alt="Vehicle fine"></td>
      </tr>
    `;
  });
  
  finesBody.innerHTML = finesHTML;
  totalSection.innerHTML = `Total: ${total}`;
  finesSection.style.display = "block";
  
  // Agregar event listeners a las celdas de ubicación
  attachLocationClickListeners();
}

// Modal functionality
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.querySelector(".modal-close");

function openModal(imageSrc) {
  modalImage.src = imageSrc;
  modal.classList.add("open");
}

function closeModal() {
  modal.classList.remove("open");
  modalImage.src = "";
}

function attachLocationClickListeners() {
  const locationCells = document.querySelectorAll(".location-cell");
  locationCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const imageSrc = cell.getAttribute("data-image");
      openModal(imageSrc);
    });
  });
}

// Close modal on close button
if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

// Close modal on background click
if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// Close modal on Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

