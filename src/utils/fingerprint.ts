export function interpolate(data: any, fingerprint: string | null) {
    if (!fingerprint) return data;
    if (!data) return data;
    
    if (typeof data == 'string') {
        return data.replace("{{fingerprint}}", fingerprint);
    }
    else if (typeof data == 'object') {
        if (!Array.isArray(data)) {
            for (let [key, value] of Object.entries(data)) {
                data[key] = interpolate(value, fingerprint);
            }
        }
    }
    
    return data;
}