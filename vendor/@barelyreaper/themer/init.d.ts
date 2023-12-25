interface Init {
    onChange?: (params: {
        theme: string;
    }) => void;
    lightPref?: string;
    darkPref?: string;
}
/**
 * @description to be run as soon as possible, maybe in your entry point file
 * so the Themer can setup the needed listeners for theme changes
 * @returns a function to cleanup the listeners
 */
export declare function init({ onChange, lightPref, darkPref, }?: Init): () => void;
export {};
