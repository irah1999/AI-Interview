
// import {
//   XCircleIcon,
// } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "../ui/button";
// import { useResponses } from "@/contexts/responses.context";
// import Image from "next/image";
import axios from "axios";
import { RetellWebClient } from "retell-client-js-sdk";
// import MiniLoader from "../loaders/mini-loader/miniLoader";
// import { toast } from "sonner";
// import { isLightColor, testEmail } from "@/lib/utils";
import { ResponseService } from "@/service/responses.service";
import { RegisterCallService } from "@/service/register-call.service";
import { Interview } from "@/types/interview";
// import { FeedbackData } from "@/types/response";
// import { FeedbackService } from "@/services/feedback.service";
// import { FeedbackForm } from "@/components/call/feedbackForm";
import {
  TabSwitchWarning,
  useTabSwitchPrevention,
} from "./tabSwitchPrevention";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import { InterviewerService } from "@/service/interviewers.service";
// import OTPInput from '@/components/OTPInput';

// import { OTPService } from "@/services/otp.service";
import { Button } from "@/components/ui/button";

const webClient = new RetellWebClient();

type InterviewProps = {
  interview: Interview;
  onEndInterview: () => void;
  formData: {
    name: string;
    email: string;
  };
  setConfirmEndInterview: React.Dispatch<React.SetStateAction<boolean>>;
  confirmEndInterview: boolean;
  // setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

type registerCallResponseType = {
  call_id: string;
  access_token: string;
};

type transcriptType = {
  role: string;
  content: string;
};

function Call({ interview, formData, onEndInterview, setConfirmEndInterview, confirmEndInterview }: InterviewProps) {
  // const { createResponse } = useResponses();
  const [lastInterviewerResponse, setLastInterviewerResponse] =
    useState<string>("");
  const [lastUserResponse, setLastUserResponse] = useState<string>("");
  const [activeTurn, setActiveTurn] = useState<string>("");
  const [Loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [email, setEmail] = useState<string>(formData.email);
  const [name, setName] = useState<string>(formData.name);
  // const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [isOldUser, setIsOldUser] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>("");
  const { tabSwitchCount } = useTabSwitchPrevention();
  // const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [interviewerImg, setInterviewerImg] = useState("");
  const [interviewTimeDuration, setInterviewTimeDuration] =
    useState<string>("1");
  const [time, setTime] = useState(0);
  const [currentTimeDuration, setCurrentTimeDuration] = useState<string>("0");

  const lastUserResponseRef = useRef<HTMLDivElement | null>(null);

  // const [otp, setOtp] = useState('');
  // const [otpModal, setOtpModal] = useState(false);
  // const [otpComplete, setOtpComplete] = useState(false);

  // const handleFeedbackSubmit = async (
  //   formData: Omit<FeedbackData, "interview_id">,
  // ) => {
  //   try {
  //     const result = await FeedbackService.submitFeedback({
  //       ...formData,
  //       interview_id: interview.id,
  //     });

  //     if (result) {
  //       toast.success("Thank you for your feedback!");
  //       setIsFeedbackSubmitted(true);
  //       setIsDialogOpen(false);
  //     } else {
  //       toast.error("Failed to submit feedback. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting feedback:", error);
  //     toast.error("An error occurred. Please try again later.");
  //   }
  // };

  useEffect(() => {
    if (lastUserResponseRef.current) {
      const { current } = lastUserResponseRef;
      current.scrollTop = current.scrollHeight;
    }
    if (confirmEndInterview) {
      onEndCallClick();
    }
  }, [lastUserResponse, confirmEndInterview]);

  useEffect(() => {
    let intervalId: any;
    if (isCalling) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    setCurrentTimeDuration(String(Math.floor(time / 100)));
    if (Number(currentTimeDuration) == Number(interviewTimeDuration) * 60) {
      webClient.stopCall();
      setIsEnded(true);
    }

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalling, time, currentTimeDuration]);

  useEffect(() => {
    if (interview?.id) {
      // setIsValidEmail(true);
      startConversation();
    }
  }, [interview.id]);

  useEffect(() => {
    webClient.on("call_started", () => {
      console.log("Call started");
      setIsCalling(true);
    });

    webClient.on("call_ended", () => {
      console.log("Call ended");
      setIsCalling(false);
      setIsEnded(true);
    });

    webClient.on("agent_start_talking", () => {
      setActiveTurn("agent");
    });

    webClient.on("agent_stop_talking", () => {
      // Optional: Add any logic when agent stops talking
      setActiveTurn("user");
    });

    webClient.on("error", (error) => {
      console.error("An error occurred:", error);
      webClient.stopCall();
      setIsEnded(true);
      setIsCalling(false);
    });

    webClient.on("update", (update) => {
      if (update.transcript) {
        const transcripts: transcriptType[] = update.transcript;
        const roleContents: { [key: string]: string } = {};

        transcripts.forEach((transcript) => {
          roleContents[transcript?.role] = transcript?.content;
        });

        setLastInterviewerResponse(roleContents["agent"]);
        setLastUserResponse(roleContents["user"]);
      }
      //TODO: highlight the newly uttered word in the UI
    });

    return () => {
      // Clean up event listeners
      webClient.removeAllListeners();
    };
  }, []);

  const onEndCallClick = async () => {
    if (isStarted) {
      setLoading(true);
      webClient.stopCall();
      setIsEnded(true);
      setLoading(false);
    } else {
      setIsEnded(true);
    }
  };

  // const handleOTPComplete = (completedOtp: string) => {
  //   console.log('OTP completed:', completedOtp);
  //   setOtpComplete(true);
  // };

  // const handleOTPChange = (currentOtp: string) => {
  //   setOtp(currentOtp);
  //   if (currentOtp.length == 6) {
  //     setOtpComplete(true);
  //   } else {
  //     setOtpComplete(false);
  //   }
  // };

  // const submitOTP = async () => {
  //   if (otp.length < 6) {
  //     toast.error("Error", {
  //       description: 'Kindly enter a 6-digit OTP to proceed.',
  //       duration: 3000,
  //     });
  //   } else {
  //     const result = await OTPService.verifyOTPService({ email, otp });
  //     console.log("OTP Verification:", result);
  //     if (result?.success) {
  //       toast.success("OTP Verification", {
  //         description: result?.message,
  //         position: "bottom-right",
  //         duration: 3000,
  //       });
  //       startConversation();
  //     } else {
  //       toast.error("Error", {
  //         description: result?.message || 'Please try again later!',
  //         duration: 3000,
  //       });
  //     }


  //   }
  // }

  // const handleChangeEmail = async (e: any) => {
  //   setEmail(e.target.value)

  //   if (testEmail(e.target.value)) {
  //     setIsValidEmail(true);
  //   } else {
  //     setIsValidEmail(false);
  //   }
  // }

  // const generateOTP = async () => {
  //   const result = await OTPService.generateOTPService({ email, interview_id: interview.id });
  //   console.log("OTP generated:", result);
  //   if (result?.success) {
  //     setOtpModal(true);
  //     toast.success("Sent OTP", {
  //       description: result?.message,
  //       position: "bottom-right",
  //       duration: 3000,
  //     });
  //   } else {
  //     toast.error("Error", {
  //       description: result?.message || 'Please try again later!',
  //       duration: 3000,
  //     });
  //   }
  // }

  const startConversation = async () => {
    const data = {
      mins: interview?.time_duration,
      objective: interview?.objective,
      questions: interview?.questions.map((q) => q.question).join(", "),
      name: name || "not provided",
    };
    setLoading(true);

    const oldUserEmails: any = await ResponseService.getAllEmails(interview.id, email);
    // console.log("oldUserEmails=>", oldUserEmails);
    // return false;
    if (oldUserEmails.success) {
      setIsOldUser(true);
    } else {
      const responses: any = await InterviewerService.getInterviewer(interview?.interviewer_id);
      const interviewerData = responses?.data || [];
      const registerCallResponse: registerCallResponseType = await RegisterCallService.registerCall(
        { dynamic_data: data, interviewer_id: interview?.interviewer_id, agent_id: interviewerData.agent_id },
      );
      if (registerCallResponse.access_token) {
        await webClient
          .startCall({
            accessToken:
              registerCallResponse.access_token,
          })
          .catch(console.error);
        setIsCalling(true);
        setIsStarted(true);

        setCallId(registerCallResponse?.call_id);

        const response = await ResponseService.createResponse({
          interview_id: interview.id,
          call_id: registerCallResponse.call_id,
          email: email,
          name: name,
        });
      } else {
        console.log("Failed to register call");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (interview?.time_duration) {
      setInterviewTimeDuration(interview?.time_duration);
    }
  }, [interview]);

  useEffect(() => {
    const fetchInterviewer = async () => {
      const responses: any = await InterviewerService.getInterviewer(interview?.interviewer_id);
      const interviewer = responses?.data || [];
      setInterviewerImg(interviewer.image);
    };
    fetchInterviewer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview.interviewer_id]);

  useEffect(() => {
    if (isEnded) {
      const updateInterview = async () => {
        await ResponseService.saveResponse(
          { is_ended: 1, tab_switch_count: tabSwitchCount },
          callId,
        );
      };
      setConfirmEndInterview(true);
      updateInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnded]);

  return (
    <div className="flex justify-center items-center h-auto w-full">
      {isStarted && <TabSwitchWarning />}
      <div className="rounded-md w-[98%]">
        <Card className="h-[98%] rounded-lg text-xl font-bold transition-all  md:block dark:border-white ">
          <div>
            <div className="m-4 h-[15px] rounded-lg border-[1px]  border-black">
              <div
                className=" bg-orange-500 h-[15px] rounded-lg"
                style={{
                  width: isEnded
                    ? "100%"
                    : `${
                        (Number(currentTimeDuration) /
                          (Number(interviewTimeDuration) * 60)) *
                        100
                      }%`,
                }}
              />
            </div>
            <CardHeader className="items-center p-1">
              {!isEnded && (
                <CardTitle className="flex flex-row items-center text-lg md:text-xl font-bold mb-2">
                  {interview?.name}
                </CardTitle>
              )}
              {/* {!isEnded && (
                <div className="flex mt-2 flex-row">
                  <AlarmClockIcon
                    className="text-orange-500 h-[1rem] w-[1rem] rotate-0 scale-100  dark:-rotate-90 dark:scale-0 mr-2 font-bold"
                    style={{ color: interview.theme_color }}
                  />
                  <div className="text-sm font-normal">
                    Expected duration:{" "}
                    <span
                      className="font-bold"
                      style={{ color: interview.theme_color }}
                    >
                      {interviewTimeDuration} mins{" "}
                    </span>
                    or less
                  </div>
                </div>
              )} */}
            </CardHeader>
            {/* {!isStarted && !isEnded && !isOldUser && (
              <div className="w-fit min-w-[400px] max-w-[400px] mx-auto mt-2  border border-orange-300 rounded-md p-2 m-2 bg-slate-50">
                <div>
                  {interview?.logo_url && (
                    <div className="p-1 flex justify-center">
                      <Image
                        src={(interview?.logo_url && interview?.logo_url != '0') ? interview?.logo_url : '/iopex-logo.svg'}
                        alt="Logo"
                        className="h-10 w-auto"
                        width={100}
                        height={100}
                      />
                    </div>
                  )}
                  <div className="p-2 font-normal text-sm mb-4 whitespace-pre-line">
                    {interview?.description}
                    <p className="font-bold text-sm">
                      {"\n"}Ensure your volume is up and grant microphone access
                      when prompted. Additionally, please make sure you are in a
                      quiet environment.
                      {"\n\n"}Note: Tab switching will be recorded.
                    </p>
                  </div>
                  {(!interview?.is_anonymous && !otpModal) && (
                    <div className="flex flex-col gap-2 justify-center">
                      <div className="flex justify-center">
                        <input
                          value={email}
                          className="h-fit mx-auto py-2 border-2 rounded-md w-[75%] self-center px-2 border-gray-400 text-sm font-normal"
                          placeholder="Enter your email address"
                          onChange={(e) => handleChangeEmail(e)}
                          // onChange={handleChangeEmail}
                        />
                      </div>
                      <div className="flex justify-center">
                        <input
                          value={name}
                          className="h-fit mb-4 mx-auto py-2 border-2 rounded-md w-[75%] self-center px-2 border-gray-400 text-sm font-normal"
                          placeholder="Enter your first name"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {(!interview?.is_anonymous && otpModal) && (
                    <div className="flex flex-col gap-2 justify-center mb-4">
                      <div className="flex justify-center">
                        <label className="text-sm font-normal">Enter OTP</label>
                      </div>
                      <div className="flex justify-center">
                        <OTPInput
                          length={6}
                          onComplete={handleOTPComplete}
                          onChange={handleOTPChange}
                          className="justify-center"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-[80%] flex flex-row mx-auto justify-center items-center align-middle">
                  {
                    otpModal ? (
                      <Button
                        className="min-w-20 h-10 rounded-lg flex flex-row justify-center mb-8"
                        style={{
                          backgroundColor: interview.theme_color ?? "#F26F21",
                          color: isLightColor(interview.theme_color ?? "#F26F21")
                            ? "black"
                            : "white",
                        }}
                        disabled={
                          Loading ||
                          (!interview?.is_anonymous && (!otpComplete))
                        }
                        onClick={submitOTP}
                      >
                        {!Loading ? "Submit OTP" : <MiniLoader />}
                      </Button>
                    ) : (
                      <Button
                        className="min-w-20 h-10 rounded-lg flex flex-row justify-center mb-8"
                        style={{
                          backgroundColor: interview.theme_color ?? "#F26F21",
                          color: isLightColor(interview.theme_color ?? "#F26F21")
                            ? "black"
                            : "white",
                        }}
                        disabled={
                          Loading ||
                          (!interview?.is_anonymous && (!isValidEmail || !name))
                        }
                        // onClick={startConversation}
                        onClick={generateOTP}
                      >
                        {!Loading ? "Start Interview" : <MiniLoader />}
                      </Button>
                    )
                  }
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button
                        className="bg-white border ml-2 text-black min-w-15 h-10 rounded-lg flex flex-row justify-center mb-8"
                        style={{ borderColor: interview.theme_color }}
                        disabled={Loading}
                      >
                        Exit
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-orange-500 hover:bg-orange-300"
                          onClick={async () => {
                            await onEndCallClick();
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )} */}
            {isStarted && !isEnded && !isOldUser && (
              <div className="flex flex-row p-2 grow">
                <div className="border-x-2 border-grey w-[50%] my-auto min-h-[70%]">
                  <div className="flex flex-col justify-evenly">
                    <div
                      className={`text-[22px] w-[80%] md:text-[26px] mt-4 min-h-[250px] mx-auto px-6`}
                    >
                      {lastInterviewerResponse}
                    </div>
                    <div className="flex flex-col mx-auto justify-center items-center align-middle">
                      <img
                        src={interviewerImg}
                        alt="Image of the interviewer"
                        width={120}
                        height={120}
                        className={`object-cover object-center mx-auto my-auto ${
                          activeTurn === "agent"
                            ? `border-4 border-[${interview.theme_color}] rounded-full`
                            : ""
                        }`}
                      />
                      <div className="font-semibold">Interviewer</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-evenly w-[50%]">
                  <div
                    ref={lastUserResponseRef}
                    className={`text-[22px] w-[80%] md:text-[26px] mt-4 mx-auto h-[250px] px-6 overflow-y-auto`}
                  >
                    {lastUserResponse}
                  </div>
                  <div className="flex flex-col mx-auto justify-center items-center align-middle">
                    <img
                      src={`/user-icon.png`}
                      alt="Picture of the user"
                      width={120}
                      height={120}
                      className={`object-cover object-center mx-auto my-auto ${
                        activeTurn === "user"
                          ? `border-4 border-[${interview.theme_color}] rounded-full`
                          : ""
                      }`}
                    />
                    <div className="font-semibold">You</div>
                  </div>
                </div>
              </div>
            )}
            {isStarted && !isEnded && !isOldUser && (
              <div className="flex justify-center items-center p-2">
              <Button
                onClick={onEndInterview}
                variant="outline"
                className="mt-8 border-destructive text-destructive hover:bg-destructive/10"
              >
                End Interview
              </Button>
              </div>
            )}

            {/* {isEnded && !isOldUser && (
              <div className="w-fit min-w-[400px] max-w-[400px] mx-auto mt-2  border border-orange-300 rounded-md p-2 m-2 bg-slate-50  absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div>
                  <div className="p-2 font-normal text-base mb-4 whitespace-pre-line">
                    <CheckCircleIcon className="h-[2rem] w-[2rem] mx-auto my-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500 " />
                    <p className="text-lg font-semibold text-center">
                      {isStarted
                        ? `Thank you for taking the time to participate in this interview`
                        : "Thank you very much for considering."}
                    </p>
                    <p className="text-center">
                      {"\n"}
                      You can close this tab now.
                    </p>
                  </div>

                  {!isFeedbackSubmitted && (
                    <AlertDialog
                      open={isDialogOpen}
                      onOpenChange={setIsDialogOpen}
                    >
                      <AlertDialogTrigger className="w-full flex justify-center">
                        <Button
                          className="bg-orange-500 text-white h-10 mt-4 mb-4"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          Provide Feedback
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <FeedbackForm
                          email={email}
                          onSubmit={handleFeedbackSubmit}
                        />
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            )} */}
            {/* {isOldUser && (
              <div className="w-fit min-w-[400px] max-w-[400px] mx-auto mt-2  border border-orange-300 rounded-md p-2 m-2 bg-slate-50  absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div>
                  <div className="p-2 font-normal text-base mb-4 whitespace-pre-line">
                    <CheckCircleIcon className="h-[2rem] w-[2rem] mx-auto my-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500 " />
                    <p className="text-lg font-semibold text-center">
                      You have already responded in this interview or you are
                      not eligible to respond. Thank you!
                    </p>
                    <p className="text-center">
                      {"\n"}
                      You can close this tab now.
                    </p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </Card>
        {/* <a
          className="flex flex-row justify-center align-middle mt-3"
          href="https://folo-up.co/"
          target="_blank"
        >
          <div className="text-center text-md font-semibold mr-2  ">
            Powered by{" "}
            <span className="font-bold">
              Folo<span className="text-indigo-600">Up</span>
            </span>
          </div>
          <ArrowUpRightSquareIcon className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-indigo-500 " />
        </a> */}
      </div>
    </div>
  );
}

export default Call;
