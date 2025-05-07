import axiosInstance from "../utils/axiosConfig";

// /chatbot/session/new
// {
//     "code": 1000,
//     "message": "New session created",
//     "result": {
//         "sessionId": "6c7910fd-f51e-4317-bff4-bbaab529c741",
//         "messages": [],
//         "createdAt": 1746587287198,
//         "lastUpdatedAt": 1746587287198
//     }
// }
export const createNewSession = async () => {
    const response = await axiosInstance.post("/chatbot/session/new");
    return response.data.result;
};

// /chatbot/chat
// {
//     "code": 1000,
//     "message": "Success",
//     "result": {
//         "response": "Câu hỏi thiếu thông tin.  Để biết còn lại bao nhiêu quả, cần biết ban đầu bạn có bao nhiêu quả.\n",
//         "sessionId": "6c7910fd-f51e-4317-bff4-bbaab529c74"
//     }
// }
export const sendMessage = async (sessionId, prompt) => {
    const response = await axiosInstance.post("/chatbot/chat", {
        sessionId,
        prompt,
    });
    return response.data.result;
}

// /chatbot/history?sessionId=b625b138-b596-4dee-bc43-a052f032c08c
// {
//     "code": 1000,
//     "message": "Success",
//     "result": [
//         {
//             "role": "user",
//             "content": "tôi cho em tôi 2 quả còn bao nhiêu",
//             "timestamp": 1746587407435
//         },
//         {
//             "role": "model",
//             "content": "Câu hỏi thiếu thông tin.  Để biết còn lại bao nhiêu quả, cần biết ban đầu bạn có bao nhiêu quả.\n",
//             "timestamp": 1746587408794
//         }
//     ]
// }
export const getHistory = async (sessionId) => {
    const response = await axiosInstance.get(`/chatbot/history?sessionId=${sessionId}`);
    return response.data.result;
}