// Network quality monitoring utility
export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private quality: 'good' | 'medium' | 'slow' = 'good';
  private listeners: ((quality: string) => void)[] = [];

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  getQuality(): string {
    return this.quality;
  }

  updateQuality(responseTime: number) {
    const oldQuality = this.quality;
    
    if (responseTime > 10000) {
      this.quality = 'slow';
    } else if (responseTime > 5000) {
      this.quality = 'medium';
    } else {
      this.quality = 'good';
    }

    if (oldQuality !== this.quality) {
      this.notifyListeners();
    }
  }

  onQualityChange(callback: (quality: string) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.quality));
  }

  getAdaptiveTimeout(): number {
    switch (this.quality) {
      case 'slow': return 60000;
      case 'medium': return 45000;
      default: return 30000;
    }
  }
}

export const networkMonitor = NetworkMonitor.getInstance();