import 'leaflet';

declare module 'leaflet-gesture-handling' {
  import type { Handler } from 'leaflet';
  export const GestureHandling: typeof Handler;
}

declare module 'leaflet' {
  interface MapOptions {
    /**
     * Plugin `leaflet-gesture-handling`: en táctil exige dos dedos para mover el
     * mapa (deja el scroll de página al deslizar con uno); en escritorio, ctrl +
     * rueda para hacer zoom.
     */
    gestureHandling?: boolean;
  }

  interface MapOptions {
    /** Textos del aviso del plugin `leaflet-gesture-handling`. */
    gestureHandlingOptions?: {
      text?: { touch?: string; scroll?: string; scrollMac?: string };
      duration?: number;
    };
  }
}
