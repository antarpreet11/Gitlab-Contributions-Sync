"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRequest = makeRequest;
const axios_1 = __importDefault(require("axios"));
function _logRequestError(error) {
    return __awaiter(this, void 0, void 0, function* () {
        // Prints the failed status and its url
        let msg;
        // If failed response includes a message append it
        if (error.response && error.response.data && error.response.data.message) {
            msg = `:\n    "${error.response.data.message}"`;
        }
        else {
            msg = "";
        }
        console.log(`Request to \x1b[32m${error.config.url}\x1b[0m ` +
            `failed with status \x1b[33m${error.response.status}\x1b[0m${msg}`);
    });
}
function makeRequest(_a) {
    return __awaiter(this, arguments, void 0, function* ({ method, url, headers, body }) {
        const config = {
            method: method,
            url: url,
            headers: headers,
            data: body
        };
        try {
            const response = yield (0, axios_1.default)(config);
            if (response.status >= 200 && response.status < 300) {
                const data = response.data;
                data.ok = true;
                return data;
            }
            else {
                yield _logRequestError({ config, response });
                return { ok: false };
            }
        }
        catch (error) {
            console.error(error);
            yield _logRequestError(error);
            return { ok: false };
        }
    });
}
