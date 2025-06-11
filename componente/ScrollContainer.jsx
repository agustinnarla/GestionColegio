import React, { useEffect } from 'react';
import { ScrollView, Platform } from 'react-native';

const ScrollContainer = ({ children, style }) => {
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (isWeb) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, []);

  if (isWeb) {
    // Solo pasá height, width y padding como CSS plano
    const webStyle = {
      overflowY: 'auto',
      height: '100%',
      width: '100%'
    };
    return <div style={webStyle}>{children}</div>;
  }

  return (
    <ScrollView style={style} contentContainerStyle={{ flexGrow: 1 }}>
      {children}
    </ScrollView>
  );
};

export default ScrollContainer;