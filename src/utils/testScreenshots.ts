export class TestScreenshots {
  private static canvas: HTMLCanvasElement | null = null;
  private static context: CanvasRenderingContext2D | null = null;

  static async captureScreenshot(testId: string, description: string = ''): Promise<string> {
    try {
      // Create a simple visual representation for the test
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext('2d');
      }

      if (this.context) {
        // Clear canvas
        this.context.fillStyle = '#ffffff';
        this.context.fillRect(0, 0, 800, 600);

        // Draw test information
        this.context.fillStyle = '#000000';
        this.context.font = '20px Arial';
        this.context.fillText(`Test: ${testId}`, 20, 40);
        
        this.context.font = '16px Arial';
        this.context.fillText(`Description: ${description}`, 20, 70);
        this.context.fillText(`Timestamp: ${new Date().toISOString()}`, 20, 100);
        
        // Draw current page state representation
        this.context.fillStyle = '#f0f0f0';
        this.context.fillRect(20, 120, 760, 400);
        
        this.context.fillStyle = '#333333';
        this.context.font = '14px Arial';
        this.context.fillText('Current Page State:', 40, 150);
        this.context.fillText(`URL: ${window.location.href}`, 40, 180);
        
        // Capture current page elements (simplified)
        const forms = document.querySelectorAll('form').length;
        const buttons = document.querySelectorAll('button').length;
        const inputs = document.querySelectorAll('input').length;
        
        this.context.fillText(`Forms: ${forms}, Buttons: ${buttons}, Inputs: ${inputs}`, 40, 210);
        
        // Convert to base64
        return this.canvas.toDataURL('image/png');
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    }
    
    return '';
  }

  static async captureElementScreenshot(element: HTMLElement, testId: string): Promise<string> {
    try {
      if (!this.canvas || !this.context) {
        return this.captureScreenshot(testId, 'Element capture fallback');
      }

      // Clear canvas
      this.context.fillStyle = '#ffffff';
      this.context.fillRect(0, 0, 800, 600);

      // Draw element information
      this.context.fillStyle = '#000000';
      this.context.font = '16px Arial';
      this.context.fillText(`Element Test: ${testId}`, 20, 30);
      this.context.fillText(`Element: ${element.tagName.toLowerCase()}`, 20, 60);
      
      if (element.id) {
        this.context.fillText(`ID: ${element.id}`, 20, 90);
      }
      
      if (element.className) {
        this.context.fillText(`Classes: ${element.className}`, 20, 120);
      }

      // Draw element representation
      const rect = element.getBoundingClientRect();
      this.context.fillStyle = '#e3f2fd';
      this.context.fillRect(20, 150, Math.min(rect.width, 760), Math.min(rect.height, 400));
      
      this.context.strokeStyle = '#1976d2';
      this.context.strokeRect(20, 150, Math.min(rect.width, 760), Math.min(rect.height, 400));

      return this.canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Failed to capture element screenshot:', error);
      return this.captureScreenshot(testId, 'Element capture error');
    }
  }
}