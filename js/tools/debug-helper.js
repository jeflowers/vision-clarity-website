/**
 * Vision Clarity Institute - Debug Helper
 * Utility to help diagnose website issues
 */

const DebugHelper = {
  // Initialize debug helper
  init: function() {
    console.log('Debug Helper Initialized');
    this.checkEnvironment();
    this.monitorComponentLoading();
    this.checkStylesheets();
    this.checkScripts();
  },
  
  // Check environment details
  checkEnvironment: function() {
    console.group('Environment Information');
    console.log('URL:', window.location.href);
    console.log('Path:', window.location.pathname);
    console.log('User Agent:', navigator.userAgent);
    console.log('Window dimensions:', window.innerWidth + 'x' + window.innerHeight);
    console.log('Device Pixel Ratio:', window.devicePixelRatio);
    console.groupEnd();
  },
  
  // Monitor component loading
  monitorComponentLoading: function() {
    document.addEventListener('componentLoaded', function(event) {
      console.log('Component loaded:', event.detail.component);
    });
    
    document.addEventListener('allComponentsLoaded', function() {
      console.log('All components have loaded successfully');
    });
  },
  
  // Check if stylesheets are loaded
  checkStylesheets: function() {
    console.group('Stylesheet Information');
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    console.log('Total stylesheets:', stylesheets.length);
    
    stylesheets.forEach((sheet, index) => {
      console.log(`[${index}] ${sheet.href}`);
    });
    
    console.groupEnd();
  },
  
  // Check if scripts are loaded
  checkScripts: function() {
    console.group('Script Information');
    const scripts = document.querySelectorAll('script[src]');
    console.log('Total scripts:', scripts.length);
    
    scripts.forEach((script, index) => {
      console.log(`[${index}] ${script.src}`);
    });
    
    console.groupEnd();
  }
};

// Initialize debug helper
DebugHelper.init();

// Make debug helper globally available
window.DebugHelper = DebugHelper;
