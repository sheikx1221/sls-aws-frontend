import type { Handicrafts } from "../types/handicrafts";
import { get } from "./api";

type RESPONSE_LIST = {
    items: Handicrafts[],
    lastEvaluatedKey: string | null,
    count: number
}

let lastEvaluatedKey: string | null = null;
export async function getCraftsFromAPI() {
    let url = '/handicrafts';
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