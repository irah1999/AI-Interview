import axiosInstance from "@/api/axiosClient";

const getInterviewer = async (interviewerId: bigint) => {
  let response: any = [];
  try {
      const result = await axiosInstance.post('/api/get-interviewer', { id: interviewerId });
      response = result?.data || [];
  } catch (error) {
      console.error("Error client side get-interviewer:", error);
  }
  return response;
};

export const InterviewerService = {
  getInterviewer,
};
