import axiosInstance from "@/api/axiosClient";


const getInterviewById = async (id: string) => {
  let response: any = [];
  try {
      response = await axiosInstance.post('/api/get-interview-by-id', {
          id: id,
      });
      response = response?.data || [];
      return response;
  } catch (error) {
      console.error("Error client side fetching interview by id:", error);
      return [];
  }
};

export const InterviewService = {
  getInterviewById,
};
