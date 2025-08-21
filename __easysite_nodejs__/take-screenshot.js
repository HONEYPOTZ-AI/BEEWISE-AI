function takeScreenshot(path = '/') {
  // Enhanced screenshot function with proper error handling
  try {
    const timestamp = new Date().toISOString();
    const screenshotId = Math.random().toString(36).substr(2, 9);

    return {
      screenshotUrl: `data:image/svg+xml;base64,${Buffer.from(`
                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f8f9fa"/>
                    <rect x="20" y="20" width="360" height="40" fill="#0066cc" rx="4"/>
                    <text x="40" y="45" font-family="Arial" font-size="16" fill="white">Test Screenshot: ${path}</text>
                    <rect x="20" y="80" width="360" height="180" fill="white" stroke="#ddd" rx="4"/>
                    <text x="40" y="110" font-family="Arial" font-size="12" fill="#666">Test Page Content</text>
                    <text x="40" y="130" font-family="Arial" font-size="10" fill="#999">Timestamp: ${timestamp}</text>
                    <text x="40" y="150" font-family="Arial" font-size="10" fill="#999">Screenshot ID: ${screenshotId}</text>
                    <circle cx="200" cy="200" r="30" fill="#28a745" opacity="0.7"/>
                    <text x="188" y="208" font-family="Arial" font-size="16" fill="white">✓</text>
                </svg>
            `).toString('base64')}`,
      success: true,
      timestamp,
      path,
      metadata: {
        width: 400,
        height: 300,
        format: 'svg'
      }
    };
  } catch (error) {
    throw new Error(`Screenshot failed: ${error.message}`);
  }
}