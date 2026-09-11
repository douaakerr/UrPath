import { askOllama } from "../../services/ollamaService.js";

export const generateWithOllama = async (params) => askOllama(params);
