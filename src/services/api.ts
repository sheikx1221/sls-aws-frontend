import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Thumbmark } from "@thumbmarkjs/thumbmarkjs";
import { interpolate } from '../utils/fingerprint';


let fingerprint: string | null = null;

export async function getFingerprint() {
    if (typeof fingerprint == 'string') return;

    const t = new Thumbmark({ api_key: (import.meta.env as any).THUMBMARK_API_KEY });
    const tm = await t.get();
    fingerprint = tm.thumbmark;
    console.log("devicefingerprint = ",fingerprint);
}

const BASE_URL = (import.meta.env as any).VITE_API_BASE_URL;

const apiService: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("BASE_URL = ",BASE_URL);

apiService.interceptors.request.use((config) => {
  try {
    const sessionId = fingerprint;
    if (sessionId) {
      config.headers = config.headers ?? {}
      ;(config.headers as any)['X-Session-Id'] = sessionId
    }
  } catch (e: any) {
    // ignore request error
  }
  return config;
})

export function setBaseURL(url: string) {
  apiService.defaults.baseURL = url
}

export async function get<Response>(url: string, config?: AxiosRequestConfig) {
    try {
        await getFingerprint();
        url = interpolate(url, fingerprint);
        const res = await apiService.get<Response>(url, config)
        return {
            success: true,
            result: res.data
        }
    }   
    catch (err: any) {
        return {
            success: false,
            err: err.message || err.code || err
        }
    }
}

export async function post<Request, Response>(url: string, body?: Request, config?: AxiosRequestConfig) {
    try {
        await getFingerprint();
        body = interpolate(body, fingerprint);
        const res = await apiService.post<Response>(url, body, config)
        return {
            success: true,
            result: res.data
        }
    }
    catch(err: any) {
        return {
            success: false,
            err: err.message || err.code || err
        }
    }
}

export async function put<Request, Response>(url: string, body?: Request, config?: AxiosRequestConfig) {
    try {
        await getFingerprint();
        body = interpolate(body, fingerprint);
        const res = await apiService.put<Response>(url, body, config)
        return {
            success: true,
            result: res.data
        }
    }
    catch(err: any) {
        return {
            success: false,
            err: err.message || err.code || err
        }
    }
}

export async function remove<Response>(url: string, config?: AxiosRequestConfig) {
    try {
        await getFingerprint();
        url = interpolate(url, fingerprint);
        const res = await apiService.delete<Response>(url, config)
        return {
            success: true,
            result: res.data
        }
    }   
    catch (err: any) {
        return {
            success: false,
            err: err.message || err.code || err
        }
    }
}