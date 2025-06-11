import { useEffect } from 'react';
import { Platform, Dimensions } from 'react-native';

export default function ScrollContainer({ desktopMinWidth = 768 }) {
  useEffect(() => {
    const { width } = Dimensions.get('window');
    const isWeb = Platform.OS === 'web';
    const isDesktop = width >= desktopMinWidth;

    if (isWeb) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }

    // Limpieza al desmontar
    return () => {
      if (isWeb) document.body.style.overflow = '';
    };
  }, [desktopMinWidth]);

  return null;
}
