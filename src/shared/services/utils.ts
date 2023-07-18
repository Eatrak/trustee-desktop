export class Utils {
    private static instance = new Utils();

    protected constructor() {}

    static getInstance() {
        return this.instance;
    }

    getAPIEndpoint(path: string) {
        const { VITE_APP_API_BASE_URL, VITE_APP_STAGE } = import.meta.env;

        if (!VITE_APP_API_BASE_URL || !VITE_APP_STAGE) return "";

        return VITE_APP_API_BASE_URL + VITE_APP_STAGE + path;
    }
}
