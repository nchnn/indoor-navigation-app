import { useEffect } from 'react';
import { Platform } from 'react-native';

const LOCKED_VIEWPORT =
  'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

/**
 * Locks browser page zoom so only the app's own zoom controls work.
 * No-op on native. Web-only:
 *  - forces the viewport meta to maximum-scale=1, user-scalable=no
 *  - blocks iOS pinch gestures (gesturestart) and ctrl+wheel zoom
 */
export function useViewportLock(active = true) {
  useEffect(() => {
    if (!active || Platform.OS !== 'web' || typeof document === 'undefined') {
      return undefined;
    }

    let meta = document.querySelector('meta[name="viewport"]');
    const prev = meta?.getAttribute('content') ?? null;
    const created = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', LOCKED_VIEWPORT);

    const stop = (e) => {
      e.preventDefault();
    };
    const stopWheel = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };

    document.addEventListener('gesturestart', stop);
    document.addEventListener('gesturechange', stop);
    document.addEventListener('gestureend', stop);
    // { passive: false } is required for preventDefault to work.
    document.addEventListener('wheel', stopWheel, { passive: false });

    return () => {
      document.removeEventListener('gesturestart', stop);
      document.removeEventListener('gesturechange', stop);
      document.removeEventListener('gestureend', stop);
      document.removeEventListener('wheel', stopWheel);
      if (created) {
        meta?.remove();
      } else if (prev != null) {
        meta?.setAttribute('content', prev);
      }
    };
  }, [active]);
}
