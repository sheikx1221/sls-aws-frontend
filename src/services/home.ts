import type { Handicrafts } from "../types/handicrafts";
import { get } from "./api";

type RESPONSE_LIST = {
    items: Handicrafts[],
    lastEvaluatedKey: string | null,
    count: number
}

type RESPONSE_GET = Handicrafts;

let lastEvaluatedKey: string | null = null;
export async function getCraftsFromAPI() {
    let url = '/handicrafts/list';
    if (lastEvaluatedKey) {
        url = url + `?exclusiveStartKey=${lastEvaluatedKey}`;
    }

    const response = await get<RESPONSE_LIST>(url);
    if (response.success && response.result) {
        lastEvaluatedKey = response.result.lastEvaluatedKey;
        return response.result.items;
    }
    else {
        return { error: response.err };
    }
}

export async function getCraftFromAPI(craftId: string) {
    let url = `/handicrafts?craftId=${craftId}`;
    const response = await get<RESPONSE_GET>(url);
    if (response.success && response.result) return response.result;
    else {
        return { error: response.err };
    }
}