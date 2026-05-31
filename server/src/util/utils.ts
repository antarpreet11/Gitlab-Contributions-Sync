import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

function _logRequestError(error: any): void {
    let msg = "";
    if (error.response?.data?.message) {
        msg = `:\n    "${error.response.data.message}"`;
    }
    const status = error.response?.status ?? 'no response';
    const url = error.config?.url ?? 'unknown url';
    console.log(`Request to \x1b[32m${url}\x1b[0m failed with status \x1b[33m${status}\x1b[0m${msg}`);
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

async function makeRequest({ method, url, headers, body }: RequestOptions): Promise<ResponseData> {
    const config: AxiosRequestConfig = {
        method,
        url,
        headers,
        data: body
    };

    try {
        const response: AxiosResponse = await axios(config);
        return response.data;
    } catch (error: any) {
        _logRequestError(error);
        const status = error.response?.status;
        const message = error.response?.data?.message ?? error.message ?? 'Unknown error';
        throw new Error(`${status ? `HTTP ${status}: ` : ''}${message}`);
    }
}

export { makeRequest };
