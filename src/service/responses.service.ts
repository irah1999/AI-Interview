import axiosInstance from "@/api/axiosClient";

const createResponse = async (payload: any) => {
  let response: any = [];
  try {
      const result = await axiosInstance.post('/api/create-responses', payload);
      response = result?.data || [];
  } catch (error) {
      console.error("Error client side createResponse:", error);
  }
  return response?.success || null;
};

const saveResponse = async (payload: any, call_id: string) => {
  let response: any = [];
  try {
      const result = await axiosInstance.post('/api/save-responses', { ...payload, call_id: call_id });
      response = result?.data || [];
  } catch (error) {
      console.error("Error client side saveResponse:", error);
  }
  return response?.success || null;
};

const getAllEmailAddressesForInterview = async (interviewId: string, email: string) => {
  let response: any = [];
  try {
      const result = await axiosInstance.post('/api/check-responses', { id: interviewId, email: email });
      response = result?.data || [];
  } catch (error) {
      console.error("Error client side check-response:", error);
  }
  return response
};


const updateResponse = async (payload: any, call_id: string) => {
  let response: any = [];
  try {
      const result = await axiosInstance.post('/api/updateResponse', { ...payload, call_id: call_id });
      response = result?.data || [];
  } catch (error) {
      console.error("Error client side updateResponse:", error);
  }
  return response?.success || null;
};

export const ResponseService = {
  createResponse,
  saveResponse,
  updateResponse,
  getAllEmails: getAllEmailAddressesForInterview,
};
