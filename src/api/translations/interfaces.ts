export interface FieldRequest {
  language: string;
  fields: string[];
  start: string;
  all: boolean;
}

export type TranslationFields = Record<string, string>;
