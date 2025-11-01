import { makeAutoObservable } from "mobx";
import { getCraftFromAPI, getCraftsFromAPI } from "../services/home";
import type { Handicrafts } from "../types/handicrafts";

class Craft {
    private crafts: Handicrafts[] = [];
    private states = {
        loading: { get: false, list: false },
        error: { get: "", list: "" }
    }

    constructor() {
        makeAutoObservable(this);
        this.listCrafts();
    }

    getStates() {
        return this.states;
    }

    getCrafts() {
        return this.crafts;
    }

    reloadCrafts () {
        this.listCrafts();
    }

    async getCraft(craftId: string) {
        const craft = this.crafts.find((craft) => craft.craftId == craftId);
        if (craft) return craft;

        this.states.loading.get = true;
        const response = await getCraftFromAPI(craftId);
        this.states.loading.get = false;

        if ('error' in response) this.states.error.get = response.error;
        else {
            this.crafts.push(response);
            return response;
        }
    }

    private async listCrafts() {
        this.states.loading.list = true;
        const response = await getCraftsFromAPI();
        this.states.loading.list = false;

        if ('error' in response) this.states.error.list = response.error;
        else {
            this.crafts.push(...response);
        }
    }
}


export const craftStore = new Craft();