import Retell from "retell-sdk";
import { logger } from "@/lib/logger";

const retellApiKey = import.meta.env.VITE_RETELL_API_KEY || "";

const registerCall = async (payload: any) => {
    logger.info("register-call request received", payload?.agent_id);
    const retellClient = new Retell({
        apiKey: retellApiKey,
    });
    let registerCallResponse: any = [];
    try {
        registerCallResponse = await retellClient.call.createWebCall({
            agent_id: payload?.agent_id,
            retell_llm_dynamic_variables: payload.dynamic_data,
        });
        logger.info("Call registered successfully");

    } catch (error) {
        console.error("Error call registered:", error);
    }
    return registerCallResponse || null;
};


export const RegisterCallService = {
    registerCall,
};
