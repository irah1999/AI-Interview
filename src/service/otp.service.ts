import axiosInstance from "@/api/axiosClient";

const generateOTPService = async (payload: any) => {
  // const result = await OTPService.generateOTPService({ email, interview_id: interview.id });
  try {
    // const encrypted = await encryptPayload(payload);

    const response = await axiosInstance.post('/api/generate-otp', payload);
    return response?.data || [];
  } catch (error) {
    console.error("Error generating OTP:", error);
  }
};

const verifyOTPService = async (payload: any) => {
  try {
    const response = await axiosInstance.post('/api/verify-otp', payload);
    return response?.data || [];
  } catch (error) {
    console.error("Error verifying OTP:", error);
  }
};

export const OTPService = {
  generateOTPService,
  verifyOTPService
};