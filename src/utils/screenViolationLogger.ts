
interface ScreenViolationLog {
  timestamp: Date;
  candidateId: string;
  interviewId: string;
  violationType: 'extended_screen_detected' | 'screen_config_changed';
  screenDetails: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    aspectRatio: number;
    devicePixelRatio: number;
    userAgent: string;
  };
  detectionMethod: string;
  actionTaken: 'interview_terminated' | 'warning_issued';
}

export const logScreenViolation = async (
  candidateData: { interviewId: string; name: string; email?: string },
  violationType: 'extended_screen_detected' | 'screen_config_changed',
  detectionMethod: string,
  actionTaken: 'interview_terminated' | 'warning_issued' = 'interview_terminated'
): Promise<void> => {
  const violationLog: ScreenViolationLog = {
    timestamp: new Date(),
    candidateId: candidateData.email || candidateData.name,
    interviewId: candidateData.interviewId,
    violationType,
    screenDetails: {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      aspectRatio: window.screen.width / window.screen.height,
      devicePixelRatio: window.devicePixelRatio,
      userAgent: navigator.userAgent
    },
    detectionMethod,
    actionTaken
  };

  try {
    // console.log('📝 Logging screen violation to database:', violationLog);
    
    // Store to localStorage as backup
    const existingLogs = JSON.parse(localStorage.getItem('screenViolationLogs') || '[]');
    existingLogs.push(violationLog);
    // localStorage.setItem('screenViolationLogs', JSON.stringify(existingLogs));
    
    // In a real implementation, this would send to your backend API
    // For now, we'll just log it comprehensively
    // console.log('🚨 SCREEN VIOLATION LOGGED:', {
    //   candidate: candidateData.name,
    //   interview: candidateData.interviewId,
    //   violation: violationType,
    //   screen: `${violationLog.screenDetails.width}x${violationLog.screenDetails.height}`,
    //   method: detectionMethod,
    //   action: actionTaken,
    //   timestamp: violationLog.timestamp.toISOString()
    // });
    
  } catch (error) {
    console.error('❌ Error logging screen violation:', error);
  }
};

export const getScreenViolationLogs = (): ScreenViolationLog[] => {
  try {
    return JSON.parse(localStorage.getItem('screenViolationLogs') || '[]');
  } catch (error) {
    console.error('Error reading screen violation logs:', error);
    return [];
  }
};
