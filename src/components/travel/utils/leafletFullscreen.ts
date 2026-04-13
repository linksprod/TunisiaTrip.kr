
import * as L from 'leaflet';

export class FullscreenControl extends L.Control {
  private map?: L.Map;
  private isFullscreen = false;

  constructor(options?: L.ControlOptions) {
    super(options);
  }

  onAdd(map: L.Map): HTMLElement {
    this.map = map;
    
    const container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar');
    const button = L.DomUtil.create('a', '', container);
    
    button.innerHTML = '⛶';
    button.href = '#';
    button.title = 'Fullscreen';
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', 'Toggle fullscreen');
    
    // Style the button
    button.style.width = '26px';
    button.style.height = '26px';
    button.style.lineHeight = '26px';
    button.style.display = 'block';
    button.style.textAlign = 'center';
    button.style.textDecoration = 'none';
    button.style.color = 'black';
    button.style.fontSize = '18px';
    button.style.backgroundColor = 'white';
    button.style.borderRadius = '4px';
    
    L.DomEvent.on(button, 'click', this.toggleFullscreen, this);
    L.DomEvent.disableClickPropagation(container);
    
    return container;
  }

  private toggleFullscreen = (e: Event) => {
    e.preventDefault();
    
    if (!this.map) return;
    
    const mapContainer = this.map.getContainer();
    
    if (!this.isFullscreen) {
      // Enter fullscreen
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullscreen = false;
    }
    
    // Invalidate map size after fullscreen change
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);
  };
}
