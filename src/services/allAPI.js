import commonAPI from "./commonAPI";
import server_url from "./serverURL";

// register API
export const registerAPI = async (reqBody) => {
    return await commonAPI("POST", `${server_url}/register`, reqBody)
}

// login API
export const loginAPI = async (reqBody) => {
    return await commonAPI("POST", `${server_url}/login`, reqBody)
}

// search user API
export const searchAPI = async (reqBody) => {
    return await commonAPI("POST", `${server_url}/search`, reqBody)
}

// fetch messages API
export const fetchMessagesAPI = async (reqBody) => {
    return await commonAPI("POST", `${server_url}/messages`, reqBody)
}

// fetch recent contacts
export const recentContactsAPI = async (id) => {
    return await commonAPI("GET", `${server_url}/recent-contacts/${id}`)
}