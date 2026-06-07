import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Featherless AI inference client.
 * Designed for multi-agent reasoning. Overrides the default OpenAI base URL 
 * to point to the Featherless v1 API and injects the corresponding API key.
 */
export const aiClient = new OpenAI({
  baseURL: 'https://api.featherless.ai/v1',
  apiKey: process.env.FEATHERLESS_API_KEY,
});
