// regressiveNavigationUtils.js - Manejo de navegación entre pantallas del test regresivo
export class RegressiveNavigationUtils {
  constructor() {}

  /* ---------- NUEVO: Navegación entre pantallas ---------- */
  showRegressiveNavigation(regressiveScreens, app, onScreenChange) {
    // Limpiar el contenido actual
    const container = document.getElementById("details-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    // Crear barra de navegación
    const navBar = document.createElement("div");
    navBar.id = "regressive-navigation-bar";
    navBar.style.cssText = `
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    `;

    const navTitle = document.createElement("h3");
    navTitle.textContent = "Navegación Test Regresivo";
    navTitle.style.margin = "0";
    navTitle.style.color = "#007bff";
    navBar.appendChild(navTitle);

    // Botones de navegación
    regressiveScreens.forEach((screen, index) => {
      const btn = document.createElement("button");
      btn.textContent = screen.screenName;
      btn.className = "regressive-nav-btn";
      btn.style.cssText = `
        padding: 8px 16px;
        background: ${index === 0 ? '#007bff' : '#6c757d'};
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      `;
      
      btn.onclick = () => {
        // Actualizar estilos de botones
        navBar.querySelectorAll(".regressive-nav-btn").forEach((b, i) => {
          b.style.background = i === index ? '#007bff' : '#6c757d';
        });
        
        // Cargar pantalla correspondiente
        this.loadScreen(screen, app, index);
        
        // Llamar al callback si se proporciona
        if (onScreenChange) {
          onScreenChange(screen, index);
        }
      };
      
      navBar.appendChild(btn);
    });

    container.appendChild(navBar);
    
    // Cargar primera pantalla por defecto
    if (regressiveScreens.length > 0) {
      this.loadScreen(regressiveScreens[0], app, 0);
    }
  }

  // Método para cargar una pantalla específica
  loadScreen(screen, app, screenIndex) {
    app.modelJson = screen.modelJson;
    app.sidebarManager.renderMainConfig(screen.modelJson);
    app.sidebarManager.renderActionsList(screen.modelJson);
    app.sidebarManager.renderRowButtonsList(screen.modelJson);
    app.currentRegressiveScreenIndex = screenIndex;
  }

  // Método para obtener la pantalla actual
  getCurrentScreen(regressiveScreens, app) {
    const currentIndex = app.currentRegressiveScreenIndex || 0;
    return regressiveScreens[currentIndex];
  }

  // Método para navegar a la siguiente pantalla
  navigateToNextScreen(regressiveScreens, app, onScreenChange) {
    const currentIndex = app.currentRegressiveScreenIndex || 0;
    const nextIndex = (currentIndex + 1) % regressiveScreens.length;
    const nextScreen = regressiveScreens[nextIndex];
    
    this.loadScreen(nextScreen, app, nextIndex);
    
    // Actualizar botones de navegación
    this.updateNavigationButtons(nextIndex);
    
    if (onScreenChange) {
      onScreenChange(nextScreen, nextIndex);
    }
  }

  // Método para navegar a la pantalla anterior
  navigateToPreviousScreen(regressiveScreens, app, onScreenChange) {
    const currentIndex = app.currentRegressiveScreenIndex || 0;
    const prevIndex = currentIndex === 0 ? regressiveScreens.length - 1 : currentIndex - 1;
    const prevScreen = regressiveScreens[prevIndex];
    
    this.loadScreen(prevScreen, app, prevIndex);
    
    // Actualizar botones de navegación
    this.updateNavigationButtons(prevIndex);
    
    if (onScreenChange) {
      onScreenChange(prevScreen, prevIndex);
    }
  }

  // Método para actualizar los botones de navegación
  updateNavigationButtons(activeIndex) {
    const navBar = document.getElementById("regressive-navigation-bar");
    if (!navBar) return;
    
    navBar.querySelectorAll(".regressive-nav-btn").forEach((btn, index) => {
      btn.style.background = index === activeIndex ? '#007bff' : '#6c757d';
    });
  }

  // Método para limpiar la navegación
  clearNavigation() {
    const navBar = document.getElementById("regressive-navigation-bar");
    if (navBar) {
      navBar.remove();
    }
  }
} 