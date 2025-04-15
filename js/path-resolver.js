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
    const cssPath = this.getRootPath() + 'css/' + filename;
    console.log('CSS path resolved:', cssPath);
    return cssPath;
  },
  
  // Get path to JS files
  getJsPath: function(filename) {
    const jsPath = this.getRootPath() + 'js/' + filename;
    console.log('JS path resolved:', jsPath);
    return jsPath;
  },
  
  // Get path to components
  getComponentPath: function(filename) {
    const componentPath = this.getRootPath() + 'components/' + filename;
    console.log('Component path resolved:', componentPath);
    return componentPath;
  },
  
  // Get path to assets
  getAssetPath: function(filename) {
    const assetPath = this.getRootPath() + 'assets/' + filename;
    console.log('Asset path resolved:', assetPath);
    return assetPath;
  }
};
// Make path resolver globally available
window.PathResolver = PathResolver;
