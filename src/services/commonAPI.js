import axios from 'axios'

const commonAPI = async (httpMethod, url, reqBody, options = {}) => {
    try {
        const reqConfig = {
            method: httpMethod,
            url,
            data: reqBody,
            headers: reqBody instanceof FormData
                ? { "Content-Type": "multipart/form-data" }
                : { "Content-Type": "application/json" }
        }
        const result = await axios(reqConfig);
        return result;
    } catch (err) {
        return err;
    }
}

export default commonAPI