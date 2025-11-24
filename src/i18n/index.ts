import type { Locale } from './config';
import en from './en.json';
import es from './es.json';

export const MESSAGES: Record<Locale, Record<string, string>> = {
  en,
  es
};
