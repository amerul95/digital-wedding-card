/**
 * Preview Renderer Script
 * 
 * This script runs in the preview page to render the template.
 * It reads the template data from window.__TEMPLATE_DATA__ and renders it.
 */

(function() {
  // Wait for React to be available (if using React)
  // For now, we'll create a simple renderer that works with the preview page
  
  if (!window.__TEMPLATE_DATA__) {
    console.error('Template data not found')
    return
  }

  const templateData = window.__TEMPLATE_DATA__
  const container = document.getElementById('preview-container')

  if (!container) {
    console.error('Preview container not found')
    return
  }

  // This is a placeholder - the actual rendering will be handled by
  // loading the preview page component
  // For now, we'll redirect to the actual preview page with the template data
  // stored in a way that the preview page can access it
  
  // Store in sessionStorage for the preview page to pick up
  sessionStorage.setItem('thumbnail-preview-data', JSON.stringify(templateData))
  
  // Redirect to the actual preview page
  // But wait, we need to render it here for the screenshot
  // So we'll need to actually render the React components here
  
  console.log('Template data loaded:', templateData)
})();
