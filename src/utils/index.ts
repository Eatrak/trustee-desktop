export class Utils {
    private static instance = new Utils();

    protected constructor() { }

    static getInstance() {
        return this.instance;
    }

    getAPIEndpoint(path: string) {
        const { REACT_APP_API_BASE_URL, REACT_APP_STAGE } = process.env;

        if (!REACT_APP_API_BASE_URL || !REACT_APP_STAGE) return "";

        return REACT_APP_API_BASE_URL + REACT_APP_STAGE + path;
    }
}