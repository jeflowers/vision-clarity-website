/**
 * Vision Clarity Institute - Resource Loader
 * Handles dynamic loading of CSS and JS resources with proper paths
 */

const ResourceLoader = {
  // Load a CSS file
  loadCss: function(filename) {
    const path = window.PathResolver ? window.PathResolver.getCssPath(filename) : 'css/' + filename;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;
    document.head.appendChild(link);
    return link;
  },
  
  // Load a JS file
  /* loadJs: function(filename, async = false, callback = null) {
    const path = window.PathResolver ? window.PathResolver.getJsPath(filename) : 'js/' + filename;
    const script = document.createElement('script');
    script.src = path;
    script.async = async;
    */

  loadJs: function(filename, async = false, callback = null) {
  const path = window.PathResolver ? window.PathResolver.getJsPath(filename) : 'js/' + filename;
  const script = document.createElement('script');
  script.src = path;
  script.async = async;
  
  if (callback) {
    script.onload = callback;
  }
  
  // Check if body exists, otherwise append to head
  if (document.body) {
    document.body.appendChild(script);
  } else {
    document.head.appendChild(script);
  }
  return script;
},
    
    if (callback) {
      script.onload = callback;
    }
    
    document.body.appendChild(script);
    return script;
  },
  
  // Load multiple CSS files
  loadCssFiles: function(filenames) {
    filenames.forEach(filename => this.loadCss(filename));
  },
  
  // Load multiple JS files
  loadJsFiles: function(filenames) {
    filenames.forEach(filename => this.loadJs(filename));
  },
  
  // Load JS files in sequence (waiting for each to load before loading the next)
  loadJsSequence: function(filenames, index = 0) {
    if (index >= filenames.length) {
      return; // All files loaded
    }
    
    this.loadJs(filenames[index], false, () => {
      this.loadJsSequence(filenames, index + 1);
    });
  }
};

// Make resource loader globally available
window.ResourceLoader = ResourceLoader;
