/**
 * Vision Clarity Institute - Path Resolver
 * Handles dynamic path resolution for assets across the site
 */

const PathResolver = {
  // Get the root path based on current page location
  getRootPath: function() {
    // Get the current path
    const path = window.location.pathname;
    
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
  },
  
  // Get path to JS files
  getJsPath: function(filename) {
    return this.getRootPath() + 'js/' + filename;
  },
  
  // Get path to components
  getComponentPath: function(filename) {
    return this.getRootPath() + 'components/' + filename;
  },
  
  // Get path to assets
  getAssetPath: function(filename) {
    return this.getRootPath() + 'assets/' + filename;
  }
};

// Make path resolver globally available
window.PathResolver = PathResolver;
