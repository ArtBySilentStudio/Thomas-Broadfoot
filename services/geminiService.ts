import { GoogleGenAI, Type } from "@google/genai";
import { ProductAnalysis, ShopAnalysis, KeywordAnalysis } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const singleProductSchema = {
    type: Type.OBJECT,
    properties: {
        productTitle: { type: Type.STRING, description: "A plausible and engaging title for the product." },
        monthlySales: { type: Type.INTEGER, description: "Estimated number of sales per month (e.g., between 50 and 1500)." },
        monthlyRevenue: { type: Type.NUMBER, description: "Estimated monthly revenue in USD." },
        listingAgeDays: { type: Type.INTEGER, description: "The age of the listing in days (e.g., between 30 and 1000)." },
        totalViews: { type: Type.INTEGER, description: "Total number of views (e.g., between 5000 and 100000)." },
        favorites: { type: Type.INTEGER, description: "Total number of favorites (e.g., between 500 and 10000)." },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 13 relevant, high-traffic SEO tags for the product." },
        summary: { type: Type.STRING, description: "A brief 2-3 sentence analysis of the product's market position and potential." },
        salesTrend: {
            type: Type.ARRAY,
            description: "A list of estimated sales for the last 12 months.",
            items: {
                type: Type.OBJECT,
                properties: {
                    month: { type: Type.STRING, description: "The month, e.g., 'Jan'" },
                    sales: { type: Type.INTEGER, description: "Number of sales in that month." },
                },
                required: ['month', 'sales'],
            }
        },
        salesTrendAnalysis: { type: Type.STRING, description: "A 1-2 sentence analysis of the sales trend, noting seasonality, growth, or decline." },
        relatedProducts: {
            type: Type.ARRAY,
            description: "A list of 3 to 5 visually similar or complementary products.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The title of the related product." },
                    imageUrl: { type: Type.STRING, description: "A placeholder image URL, e.g., 'https://placehold.co/300x300/1E293B/94A3B8?text=Product'." },
                    monthlySales: { type: Type.INTEGER, description: "The estimated monthly sales for the related product." }
                },
                required: ['title', 'imageUrl', 'monthlySales']
            }
        }
    },
    required: ['productTitle', 'monthlySales', 'monthlyRevenue', 'listingAgeDays', 'totalViews', 'favorites', 'tags', 'summary', 'salesTrend', 'salesTrendAnalysis', 'relatedProducts'],
};

const productSchema = {
    type: Type.ARRAY,
    description: "A list of 10 fictional but realistic product analyses based on the provided description.",
    items: singleProductSchema,
};

const shopSchema = {
    type: Type.ARRAY,
    description: "A list of 10 competing shops based on the provided description.",
    items: {
        type: Type.OBJECT,
        properties: {
            shopName: { type: Type.STRING, description: "A plausible name for the Etsy shop." },
            totalMonthlySales: { type: Type.INTEGER, description: "The shop's total estimated sales across all products for one month." },
            totalMonthlyRevenue: { type: Type.NUMBER, description: "The shop's total estimated revenue in USD for one month." },
            averageProductPrice: { type: Type.NUMBER, description: "The average price of products in this shop." },
            topProducts: {
                type: Type.ARRAY,
                description: "A list of the top 5 selling products in the shop.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        monthlySales: { type: Type.INTEGER },
                        monthlyRevenue: { type: Type.NUMBER },
                    },
                    required: ['title', 'monthlySales', 'monthlyRevenue'],
                }
            }
        },
        required: ['shopName', 'totalMonthlySales', 'totalMonthlyRevenue', 'averageProductPrice', 'topProducts'],
    }
};

const singleKeywordSchema = {
    type: Type.OBJECT,
    properties: {
        keyword: { type: Type.STRING, description: "The keyword being analyzed." },
        competition: { type: Type.STRING, enum: ['Low', 'Medium', 'High'], description: "The level of competition for this keyword." },
        demand: { type: Type.STRING, enum: ['Low', 'Medium', 'High'], description: "The level of search demand for this keyword." },
        opportunityScore: { type: Type.INTEGER, description: "A score from 1-100 indicating the market opportunity (high demand, low competition is better)." },
        topListings: {
            type: Type.ARRAY,
            description: "A list of the top 5 performing listings for this keyword.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    monthlySales: { type: Type.INTEGER },
                },
                required: ['title', 'monthlySales'],
            }
        },
        relatedKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 10 related long-tail keywords." }
    },
    required: ['keyword', 'competition', 'demand', 'opportunityScore', 'topListings', 'relatedKeywords'],
};

const keywordSchema = {
    type: Type.ARRAY,
    description: "A list of 10 fictional but realistic analyses for the provided keyword and other closely related keywords.",
    items: singleKeywordSchema,
};


export const analyzeProduct = async (productDescription: string): Promise<ProductAnalysis[]> => {
    const prompt = `You are an expert e-commerce analyst. Based on the product concept "${productDescription}", generate a detailed, realistic but fictional analysis for 10 competing successful Etsy listings. The sales trend data must cover the last 12 months. For each product, provide a concise analysis of its sales trend. For each main product analysis, also generate a list of 3 to 5 visually similar or complementary products. Provide all data points requested in the JSON schema for each product.`;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: productSchema,
        },
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as ProductAnalysis[];
};

export const analyzeShop = async (shopDescription: string): Promise<ShopAnalysis[]> => {
    const prompt = `You are an expert e-commerce analyst. Based on the shop concept "${shopDescription}", generate a detailed, realistic but fictional analysis of 10 competing successful Etsy shops. Provide all data points requested in the JSON schema for each shop.`;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: shopSchema,
        },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as ShopAnalysis[];
};

export const analyzeKeyword = async (keyword: string): Promise<KeywordAnalysis[]> => {
    const prompt = `You are an expert e-commerce keyword researcher. Analyze the keyword "${keyword}" and 9 other closely related keywords for their potential on Etsy. Generate a detailed, realistic but fictional analysis for each. Provide all data points requested in the JSON schema.`;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: keywordSchema,
        },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as KeywordAnalysis[];
};