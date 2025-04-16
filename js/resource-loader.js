/**
 * Vision Clarity Institute - Resource Loader
 * Handles dynamic loading of CSS and JS resources with proper paths
 */
const ResourceLoader = {
  // Debug mode - set to false by default
  debug: false,
  
  // Enable/disable debug logging
  setDebug: function(enabled) {
    this.debug = enabled;
  },
  
  // Log function that only outputs when debug is enabled
  log: function(message) {
    if (this.debug) {
      console.log(message);
    }
  },
  
  // Load a CSS file
  loadCss: function(filename) {
    const path = window.PathResolver ? window.PathResolver.getCssPath(filename) : 'css/' + filename;
    this.log('Loading CSS: ' + path);
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;
    document.head.appendChild(link);
    return link;
  },
  
  // Fix: Load a JS file
loadJs: function(filename, async = false, callback = null) {
  const path = window.PathResolver ? window.PathResolver.getJsPath(filename) : "/js/" + filename;
  this.log("Loading JS: " + path);
  
  const script = document.createElement('script');
  script.src = path;
  script.async = async;
  
  // Only set the callback for the onload event, not execute immediately
  if (callback) {
    script.onload = callback;
  }
  
  // Add error handling
  script.onerror = function(e) {
    console.error('Failed to load script:', path, e);
    // Optionally call callback with error parameter
    if (callback) callback(new Error(`Failed to load ${path}`));
  };
  
  // Fixing the document.head instead of document.body to avoid potential null issues
  (document.head || document.getElementsByTagName('head')[0]).appendChild(script);
  
  return script;
},
  
  // Load multiple CSS files
  loadCssFiles: function(filenames) {
    this.log('Loading CSS files: ' + filenames.join(', '));
    filenames.forEach(filename => this.loadCss(filename));
  },
  
  // Load multiple JS files
  loadJsFiles: function(filenames) {
    this.log('Loading JS files: ' + filenames.join(', '));
    filenames.forEach(filename => this.loadJs(filename));
  },
  
  // Load JS files in sequence (waiting for each to load before loading the next)
  loadJsSequence: function(filenames, index = 0) {
    if (index >= filenames.length) {
      this.log('All JS files loaded in sequence');
      return; // All files loaded
    }
    
    this.log('Loading JS file in sequence: ' + filenames[index] + ' (' + (index + 1) + '/' + filenames.length + ')');
    this.loadJs(filenames[index], false, () => {
      this.loadJsSequence(filenames, index + 1);
    });
  }
};

// Make resource loader globally available
window.ResourceLoader = ResourceLoader;
