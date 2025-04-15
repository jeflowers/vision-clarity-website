/**
 * Vision Clarity Institute - Path Resolver
 * Handles dynamic path resolution for assets across the site
 */

const PathResolver = {
  // Get the root path based on current page location
  getRootPath: function() {
    // Get the current path
    const path = window.location.pathname;
    console.log('Current pathname:', path);
    
    // Check if we're at the root or index.html
    if (path === '/' || path === '/index.html' || path.endsWith('/index.html')) {
      return './';
    }
    
    // For all other pages (assuming they're in the /pages/ directory)
    return '../';
  },
  
  // Get path to CSS files
  getCssPath: function(filename) {
    return this.getRootPath() + 'css/' + filename;
    console.log('CSS path resolved:', cssPath);
  },
  
  // Get path to JS files
  getJsPath: function(filename) {
    return this.getRootPath() + 'js/' + filename;
    console.log('CSS path resolved:', cssPath);
  },
  
  // Get path to components
  getComponentPath: function(filename) {
    return this.getRootPath() + 'components/' + filename;
    console.log('CSS path resolved:', cssPath);
  },
  
  // Get path to assets
  getAssetPath: function(filename) {
    return this.getRootPath() + 'assets/' + filename;
    console.log('CSS path resolved:', cssPath);
  }
};

// Make path resolver globally available
window.PathResolver = PathResolver;

console.log('CSS path resolved:', cssPath);

