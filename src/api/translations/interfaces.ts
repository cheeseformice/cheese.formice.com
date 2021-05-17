export interface FieldRequest {
    language: string;
    fields: string[];
    start: string;
    all: boolean;
}

export interface TranslationFields {
    [field: string]: string;
}
