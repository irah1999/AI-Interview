
// CRITICAL: Enhanced multiple screen detection with aggressive monitoring
export const detectMultipleScreens = async (): Promise<boolean> => {
  // console.log('🔍 CRITICAL: Starting AGGRESSIVE multiple screen detection...');
  
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const availWidth = window.screen.availWidth;
  const availHeight = window.screen.availHeight;
  
  // console.log('📊 CRITICAL: Screen analysis:', {
  //   available: { width: availWidth, height: availHeight },
  //   devicePixelRatio: window.devicePixelRatio,
  //   userAgent: navigator.userAgent.substring(0, 100)
  // });

  // Method 1: Screen API detection (most reliable)
  if ('getScreenDetails' in window) {
    try {
      const screenDetails = await (window as any).getScreenDetails();
      const screenCount = screenDetails.screens ? screenDetails.screens.length : 1;
      // console.log('📺 CRITICAL: Screen API detected screens:', screenCount);
      // console.log("screen:", screenDetails);
      if (screenCount > 1) {
        // console.log('🚨 CRITICAL: EXTENDED DISPLAY DETECTED via Screen API:', screenCount, 'screens');
        return true;
      }
    } catch (error) {
      // console.log('Screen API not available, using fallback methods');
    }
  }

  // Method 2: Aggressive aspect ratio detection
  const aspectRatio = screenWidth / screenHeight;
  // console.log('📐 CRITICAL: Screen aspect ratio:', aspectRatio);
  
  // Extended displays create these ratios - be more aggressive
  if (aspectRatio > 1.8) {
    // console.log('🚨 CRITICAL: EXTENDED DISPLAY DETECTED via aspect ratio:', aspectRatio);
    return true;
  }

  // Method 3: Extended display resolution patterns (comprehensive list)
  const extendedResolutions = [
    // Common dual monitor setups
    { width: 3840, height: 1080 }, // Dual 1920x1080
    { width: 3840, height: 1200 }, // Dual 1920x1200
    { width: 2560, height: 1080 }, // 1920x1080 + 640x1080
    { width: 3200, height: 1080 }, // 1920x1080 + 1280x1024
    { width: 3520, height: 1080 }, // 1920x1080 + 1600x900
    { width: 3360, height: 1080 }, // 1920x1080 + 1440x900
    { width: 3000, height: 1080 }, // Various combinations
    { width: 3440, height: 1440 }, // Ultra-wide QHD
    { width: 5760, height: 1080 }, // Triple monitor
    { width: 4480, height: 1080 }, // Asymmetric dual
    { width: 3072, height: 1080 }, // 1920+1152 combinations
    { width: 2880, height: 1080 }, // MacBook + external
    { width: 4096, height: 1080 }, // Various wide setups
    { width: 3600, height: 1080 }, // Mixed resolution setups
    { width: 2736, height: 1080 }, // 1366x768 + 1920x1080
  ];
  
  const isExtendedResolution = extendedResolutions.some(res => 
    res.width === screenWidth && res.height === screenHeight
  );
  
  if (isExtendedResolution) {
    // console.log('🚨 CRITICAL: EXTENDED DISPLAY DETECTED via resolution patterns:', { screenWidth, screenHeight });
    return true;
  }

  // Method 4: Unusual width detection (more aggressive)
  if (screenWidth > 2560 || (screenWidth > 2048 && aspectRatio > 1.6)) {
    // console.log('🚨 CRITICAL: EXTENDED DISPLAY DETECTED via unusual width/ratio:', { screenWidth, aspectRatio });
    return true;
  }

  // Method 5: Window positioning analysis
  if (window.screenX < -100 || window.screenX >= screenWidth || 
      window.screenY < -100 || window.screenY >= screenHeight) {
    // console.log('🚨 CRITICAL: EXTENDED DISPLAY DETECTED via window positioning:', { 
    //   screenX: window.screenX, 
    //   screenY: window.screenY 
    // });
    return true;
  }

  // Method 6: Available vs total screen size discrepancies
  const widthDiff = Math.abs(screenWidth - availWidth);
  const heightDiff = Math.abs(screenHeight - availHeight);
  if (widthDiff > 200 || heightDiff > 200) {
    // console.log('🚨 CRITICAL: EXTENDED DISPLAY SUSPECTED via size discrepancies:', { widthDiff, heightDiff });
    return true;
  }

  // console.log('✅ CRITICAL: Single screen configuration verified');
  return false;
};

// CRITICAL: More aggressive continuous monitoring
export const monitorScreenChanges = (callback: (hasMultipleScreens: boolean) => void) => {
  let lastScreenConfig = {
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    screenX: window.screenX,
    screenY: window.screenY,
    devicePixelRatio: window.devicePixelRatio
  };
  
  const checkForChanges = async () => {
    const currentConfig = {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      screenX: window.screenX,
      screenY: window.screenY,
      devicePixelRatio: window.devicePixelRatio
    };
    
    const hasChanged = Object.keys(lastScreenConfig).some(
      key => lastScreenConfig[key as keyof typeof lastScreenConfig] !== 
            currentConfig[key as keyof typeof currentConfig]
    );
    
    if (hasChanged) {
      // console.log('📺 CRITICAL: Screen configuration changed during interview:', { 
      //   from: lastScreenConfig, 
      //   to: currentConfig 
      // });
      lastScreenConfig = currentConfig;
    }
    
    // Always check for extended displays - be aggressive
    const hasMultiple = await detectMultipleScreens();
    if (hasMultiple) {
      // console.log('🚨 CRITICAL: Extended display detected during monitoring - IMMEDIATE TERMINATION');
      callback(hasMultiple);
    }
  };
  
  // Check every 1 second for critical detection
  const interval = setInterval(checkForChanges, 1000);
  
  const handleResize = () => {
    // console.log('🔄 CRITICAL: Window resize detected, checking screens immediately...');
    setTimeout(checkForChanges, 50);
  };
  
  const handleOrientationChange = () => {
    // console.log('🔄 CRITICAL: Orientation change detected, checking screens...');
    setTimeout(checkForChanges, 100);
  };

  const handleFocus = () => {
    // console.log('🔄 CRITICAL: Window focus change, checking screens...');
    setTimeout(checkForChanges, 50);
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('focus', handleFocus);
  window.addEventListener('blur', handleFocus);
  
  // Initial check immediately
  setTimeout(checkForChanges, 500);
  
  return () => {
    clearInterval(interval);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('blur', handleFocus);
  };
};
