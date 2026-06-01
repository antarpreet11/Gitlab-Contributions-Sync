import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

function _logRequestError(error: any): void {
    const status = error.response?.status ?? 'no response';
    const url = error.config?.url ?? 'unknown url';
    const detail = error.response?.data?.message ? ` — "${error.response.data.message}"` : '';
    console.error(`\x1b[31m[HTTP Error]\x1b[0m ${status} ${url}${detail}`);
}

interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    headers?: Record<string, string>;
    body?: any;
}

interface ResponseData {
    [key: string]: any;
}

async function makeRequest({ method, url, headers, body }: RequestOptions, retries = 3): Promise<any> {
    const config: AxiosRequestConfig = { method, url, headers, data: body };

    let lastError: any;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response: AxiosResponse = await axios(config);
            return response.data;
        } catch (error: any) {
            lastError = error;
            const status = error.response?.status;
            if (status && status >= 500 && attempt < retries) {
                const delay = Math.pow(2, attempt) * 1000;
                console.warn(`\x1b[33m[HTTP]\x1b[0m ${status} — retry ${attempt + 1}/${retries} in ${delay / 1000}s (${url})`);
                await new Promise(r => setTimeout(r, delay));
            } else {
                break;
            }
        }
    }

    _logRequestError(lastError);
    const status = lastError.response?.status;
    const message = lastError.response?.data?.message ?? lastError.message ?? 'Unknown error';
    throw new Error(`${status ? `HTTP ${status}: ` : ''}${message}`);
}

export { makeRequest };
