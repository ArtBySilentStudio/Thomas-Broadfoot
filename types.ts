export enum AnalysisType {
  PRODUCT = 'Product',
  SHOP = 'Shop',
  KEYWORD = 'Keyword',
}

export interface SalesTrendData {
  month: string;
  sales: number;
}

export interface RelatedProduct {
  title: string;
  imageUrl: string;
  monthlySales: number;
}

export interface ProductAnalysis {
  productTitle: string;
  monthlySales: number;
  monthlyRevenue: number;
  listingAgeDays: number;
  totalViews: number;
  favorites: number;
  tags: string[];
  summary: string;
  salesTrend: SalesTrendData[];
  salesTrendAnalysis: string;
  relatedProducts: RelatedProduct[];
}

export interface ShopProduct {
  title: string;
  monthlySales: number;
  monthlyRevenue: number;
}

export interface ShopAnalysis {
  shopName: string;
  totalMonthlySales: number;
  totalMonthlyRevenue: number;
  averageProductPrice: number;
  topProducts: ShopProduct[];
}

export interface KeywordListing {
  title: string;
  monthlySales: number;
}

export interface KeywordAnalysis {
  keyword: string;
  competition: 'Low' | 'Medium' | 'High';
  demand: 'Low' | 'Medium' | 'High';
  opportunityScore: number;
  topListings: KeywordListing[];
  relatedKeywords: string[];
}

export interface SearchHistoryEntry {
  query: string;
  type: AnalysisType;
}

export type AnalysisResult = ProductAnalysis[] | ShopAnalysis[] | KeywordAnalysis[] | null;