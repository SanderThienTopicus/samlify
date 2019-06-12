interface ExtractorField {
    key: string;
    localPath: string[];
    attributes: string[];
    index?: string[];
    attributePath?: string[];
    context?: boolean;
}
export declare type ExtractorFields = ExtractorField[];
export declare const loginRequestFields: ExtractorFields;
export declare const loginResponseFields: ((asserion: any) => ExtractorFields);
export declare const logoutRequestFields: ExtractorFields;
export declare const logoutResponseFields: ExtractorFields;
export declare function extract(context: string, fields: any): any;
export {};
