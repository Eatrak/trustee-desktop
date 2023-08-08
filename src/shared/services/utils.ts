export class Utils {
    private static instance = new Utils();
    private locale: string;

    protected constructor() {
        this.locale =
            navigator.languages && navigator.languages.length
                ? navigator.languages[0]
                : navigator.language;
    }

    static getInstance() {
        return this.instance;
    }

    getAPIEndpoint(path: string) {
        const { VITE_APP_API_BASE_URL, VITE_APP_STAGE } = import.meta.env;

        if (!VITE_APP_API_BASE_URL || !VITE_APP_STAGE) return "";

        return VITE_APP_API_BASE_URL + VITE_APP_STAGE + path;
    }

    getFormattedAmount = (currencyCode: string, amount: number) => {
        return Intl.NumberFormat(this.locale, {
            style: "currency",
            currency: currencyCode,
        }).format(amount);
    };
}
