import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

async function _logRequestError(error: any): Promise<void> {
    // Prints the failed status and its url
    let msg: string;

    // If failed response includes a message append it
    if (error.response && error.response.data && error.response.data.message) {
        msg = `:\n    "${error.response.data.message}"`;
    } else {
        msg = "";
    }

    console.log(
        `Request to \x1b[32m${error.config.url}\x1b[0m ` +
        `failed with status \x1b[33m${error.response.status}\x1b[0m${msg}`
    );
}

interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    headers?: Record<string, string>;
    body?: any;
}

interface ResponseData {
    ok: boolean;
    [key: string]: any;
}

async function makeRequest({ method, url, headers, body }: RequestOptions): Promise<ResponseData> {
    const config: AxiosRequestConfig = {
        method: method,
        url: url,
        headers: headers,
        data: body
    };

    try {
        const response: AxiosResponse = await axios(config);

        if (response.status >= 200 && response.status < 300) {
            const data: ResponseData = response.data;
            data.ok = true;
            return data;
        } else {
            await _logRequestError({ config, response });
            return { ok: false };
        }
    } catch (error) {
        console.error(error);
        await _logRequestError(error);
        return { ok: false };
    }
}

export { makeRequest };
