/**
 * Vision Clarity Institute - Modal Preloader
 * Safely preloads modal components without affecting page rendering
 */

(function() {
  // Create a dedicated container for modals to avoid cluttering the body
  function createModalContainer() {
    let container = document.getElementById('modal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-container';
      container.className = 'modal-container-wrapper';
      document.body.appendChild(container);
    }
    return container;
  }

  // Preload modals safely
  function preloadModals() {
    console.log('Preloading modal components...');
    
    // Make sure we have a container
    const modalContainer = createModalContainer();
    
    // Define modals to preload with proper error handling
    const modalComponents = [
      'components/consultation-modal.html',
      'components/service-inquiry-modal.html'
    ];
    
    // Only load if ComponentLoader is available
    if (!window.ComponentLoader || typeof window.ComponentLoader.loadComponent !== 'function') {
      console.log('ComponentLoader not available yet, will retry later');
      setTimeout(preloadModals, 500);
      return;
    }
    
    // Load each modal component
    modalComponents.forEach(modalPath => {
      window.ComponentLoader.loadComponent(modalPath, modalContainer)
        .then(() => {
          console.log(`Successfully preloaded: ${modalPath}`);
          
          // Initialize any modal-specific functionality
          if (window.ModalManager && typeof window.ModalManager.setupEventListeners === 'function') {
            window.ModalManager.setupEventListeners();
          }
        })
        .catch(error => {
          console.error(`Error preloading modal: ${modalPath}`, error);
        });
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadModals);
  } else {
    // If DOM is already loaded, preload now
    preloadModals();
  }
})();
