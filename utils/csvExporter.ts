import {
  AnalysisResult,
  AnalysisType,
  ProductAnalysis,
  ShopAnalysis,
  KeywordAnalysis,
} from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const escapeCsvCell = (cellData: any): string => {
  const cellString = String(cellData ?? '');
  if (/[",\n]/.test(cellString)) {
    return `"${cellString.replace(/"/g, '""')}"`;
  }
  return cellString;
};

const convertToCsv = (headers: string[], data: any[][]): string => {
  const headerRow = headers.map(escapeCsvCell).join(',');
  const dataRows = data.map(row => row.map(escapeCsvCell).join(','));
  return [headerRow, ...dataRows].join('\n');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};


const generateProductCsv = (data: ProductAnalysis[]): string => {
  const headers = [
    'Product Title', 'Monthly Sales', 'Monthly Revenue', 'Listing Age (Days)',
    'Total Views', 'Favorites', 'Summary', 'Tags'
  ];
  const rows = data.map(product => [
    product.productTitle,
    product.monthlySales,
    product.monthlyRevenue,
    product.listingAgeDays,
    product.totalViews,
    product.favorites,
    product.summary,
    product.tags.join(' | '),
  ]);
  return convertToCsv(headers, rows);
};

const generateShopCsv = (data: ShopAnalysis[]): string => {
  const headers = [
    'Shop Name', 'Total Monthly Sales', 'Total Monthly Revenue', 'Average Product Price',
    'Top Product Title', 'Product Monthly Sales', 'Product Monthly Revenue'
  ];
  const rows = data.flatMap(shop =>
    shop.topProducts.map(product => [
      shop.shopName,
      shop.totalMonthlySales,
      shop.totalMonthlyRevenue,
      shop.averageProductPrice,
      product.title,
      product.monthlySales,
      product.monthlyRevenue,
    ])
  );
  return convertToCsv(headers, rows);
};

const generateKeywordCsv = (data: KeywordAnalysis[]): string => {
  const headers = [
    'Keyword', 'Competition', 'Demand', 'Opportunity Score',
    'Top Listing Title', 'Listing Monthly Sales', 'Related Keywords'
  ];
  const rows = data.flatMap(keywordData => {
    const relatedKeywordsStr = keywordData.relatedKeywords.join(' | ');
     if (keywordData.topListings.length === 0) {
        return [[
            keywordData.keyword,
            keywordData.competition,
            keywordData.demand,
            keywordData.opportunityScore,
            '', // No listing title
            '', // No listing sales
            relatedKeywordsStr,
        ]];
    }
    return keywordData.topListings.map(listing => [
      keywordData.keyword,
      keywordData.competition,
      keywordData.demand,
      keywordData.opportunityScore,
      listing.title,
      listing.monthlySales,
      relatedKeywordsStr,
    ]);
  });
  return convertToCsv(headers, rows);
};

export const exportRelatedKeywordsToCsv = (data: KeywordAnalysis[]) => {
  const headers = ['Source Keyword', 'Related Keyword'];
  const rows = data.flatMap(keywordData =>
    keywordData.relatedKeywords.map(related => [
      keywordData.keyword,
      related,
    ])
  );
  const csvString = convertToCsv(headers, rows);
  const filename = 'busy-bee-related-keywords.csv';
  downloadFile(csvString, filename, 'text/csv;charset=utf-8;');
};

export const exportRelatedKeywordsToJson = (data: KeywordAnalysis[]) => {
  const jsonData = data.map(keywordData => ({
    keyword: keywordData.keyword,
    relatedKeywords: keywordData.relatedKeywords,
  }));
  const jsonString = JSON.stringify(jsonData, null, 2);
  const filename = 'busy-bee-related-keywords.json';
  downloadFile(jsonString, filename, 'application/json;charset=utf-8;');
};

export const exportAnalysisToCSV = (result: AnalysisResult, type: AnalysisType) => {
  if (!result || !Array.isArray(result) || result.length === 0) return;

  let csvString: string;
  let filename: string;
  const safeFilename = (name: string) => name.replace(/[^a-z0-9]/gi, '-').toLowerCase();

  switch (type) {
    case AnalysisType.PRODUCT:
      const productData = result as ProductAnalysis[];
      csvString = generateProductCsv(productData);
      const productFileName = productData[0].productTitle || "product-analysis";
      filename = `busy-bee-product-${safeFilename(productFileName)}.csv`;
      break;
    case AnalysisType.SHOP:
      const shopData = result as ShopAnalysis[];
      csvString = generateShopCsv(shopData);
      const shopFileName = shopData[0].shopName || "shop-analysis";
      filename = `busy-bee-shop-${safeFilename(shopFileName)}.csv`;
      break;
    case AnalysisType.KEYWORD:
      const keywordData = result as KeywordAnalysis[];
      csvString = generateKeywordCsv(keywordData);
      const keywordFileName = keywordData[0].keyword || "keyword-analysis";
      filename = `busy-bee-keyword-${safeFilename(keywordFileName)}.csv`;
      break;
    default:
      return;
  }

  downloadFile(csvString, filename, 'text/csv;charset=utf-8;');
};

export const exportAnalysisToJson = (result: AnalysisResult, type: AnalysisType) => {
  if (!result || !Array.isArray(result) || result.length === 0) return;

  const jsonString = JSON.stringify(result, null, 2);
  let filenamePrefix = type.toLowerCase();
  
  if (type === AnalysisType.PRODUCT && (result as ProductAnalysis[])[0]?.productTitle) {
      filenamePrefix = `product-${(result as ProductAnalysis[])[0].productTitle}`;
  } else if (type === AnalysisType.SHOP && (result as ShopAnalysis[])[0]?.shopName) {
      filenamePrefix = `shop-${(result as ShopAnalysis[])[0].shopName}`;
  } else if (type === AnalysisType.KEYWORD && (result as KeywordAnalysis[])[0]?.keyword) {
      filenamePrefix = `keyword-${(result as KeywordAnalysis[])[0].keyword}`;
  }
  const safeFilename = `busy-bee-${filenamePrefix.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;

  downloadFile(jsonString, safeFilename, 'application/json;charset=utf-8;');
};

export const exportAnalysisToPdf = (result: AnalysisResult, type: AnalysisType) => {
  if (!result || !Array.isArray(result) || result.length === 0) return;

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 15; // vertical cursor

  const addText = (text: string, size: number, style: 'normal' | 'bold' = 'normal', spacing: number = 7) => {
      if (y > pageHeight - 20) {
          doc.addPage();
          y = 15;
      }
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      // Use splitTextToSize for auto-wrapping
      const splitText = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - 28);
      doc.text(splitText, 14, y);
      y += (doc.getTextDimensions(splitText).h) + spacing - 5;
  };
  
  const addTable = (head: any[], body: any[]) => {
      if (y > pageHeight - 40) { // Check if there's enough space for a table
          doc.addPage();
          y = 15;
      }
      autoTable(doc, {
          head,
          body,
          startY: y,
          theme: 'grid',
          headStyles: { fillColor: '#1E293B' }, // gray-800
          styles: { fontSize: 8 },
          didDrawPage: (data: any) => {
              y = data.cursor?.y ? data.cursor.y + 5 : 15;
          }
      });
      y = (doc as any).lastAutoTable.finalY + 10;
  };

  addText(`Busy Bee: ${type} Analysis Report`, 18, 'bold', 10);
  
  let filename = `busy-bee-${type.toLowerCase()}-analysis.pdf`;
  const safeFilenamePart = (name: string) => name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  switch (type) {
    case AnalysisType.PRODUCT:
      const productData = result as ProductAnalysis[];
      filename = `busy-bee-product-${safeFilenamePart(productData[0].productTitle || "analysis")}.pdf`;
      productData.forEach((product, index) => {
        if (index > 0) doc.addPage();
        y = 15;
        addText(product.productTitle, 14, 'bold', 10);
        addText(`Summary: ${product.summary}`, 10);
        addText(`Sales Trend Analysis: ${product.salesTrendAnalysis}`, 10, 'normal', 10);

        addTable(
            [['Metric', 'Value']],
            [
                ['Monthly Sales', product.monthlySales.toLocaleString()],
                ['Monthly Revenue', `$${product.monthlyRevenue.toLocaleString()}`],
                ['Total Views', product.totalViews.toLocaleString()],
                ['Favorites', product.favorites.toLocaleString()],
                ['Listing Age', `${product.listingAgeDays} days`],
            ]
        );

        addTable(
            [['Month', 'Sales']],
            product.salesTrend.map(st => [st.month, st.sales])
        );

        addTable(
            [['Related Product', 'Monthly Sales']],
            product.relatedProducts.map(rp => [rp.title, rp.monthlySales])
        );
        addText(`Tags: ${product.tags.join(', ')}`, 8, 'normal', 10);
      });
      break;
    
    case AnalysisType.SHOP:
        const shopData = result as ShopAnalysis[];
        filename = `busy-bee-shop-${safeFilenamePart(shopData[0].shopName || "analysis")}.pdf`;
        shopData.forEach((shop, index) => {
            if (index > 0) doc.addPage();
            y = 15;
            addText(shop.shopName, 14, 'bold', 10);
             addTable(
                [['Metric', 'Value']],
                [
                    ['Total Monthly Sales', shop.totalMonthlySales.toLocaleString()],
                    ['Total Monthly Revenue', `$${shop.totalMonthlyRevenue.toLocaleString()}`],
                    ['Avg. Product Price', `$${shop.averageProductPrice.toFixed(2)}`],
                ]
            );
            addTable(
                [['Product Title', 'Monthly Sales', 'Monthly Revenue']],
                shop.topProducts.map(p => [p.title, p.monthlySales.toLocaleString(), `$${p.monthlyRevenue.toLocaleString()}`])
            );
        });
        break;

    case AnalysisType.KEYWORD:
      const keywordData = result as KeywordAnalysis[];
      filename = `busy-bee-keyword-${safeFilenamePart(keywordData[0].keyword || "analysis")}.pdf`;
       keywordData.forEach((kw, index) => {
            if (index > 0) doc.addPage();
            y = 15;
            addText(`Keyword: "${kw.keyword}"`, 14, 'bold', 10);
            addTable(
                [['Metric', 'Value']],
                [
                    ['Competition', kw.competition],
                    ['Demand', kw.demand],
                    ['Opportunity Score', `${kw.opportunityScore} / 100`],
                ]
            );
            addTable(
                [['Listing Title', 'Monthly Sales']],
                kw.topListings.map(l => [l.title, l.monthlySales.toLocaleString()])
            );
             addText(`Related Keywords: ${kw.relatedKeywords.join(', ')}`, 8, 'normal', 10);
        });
      break;
  }
  doc.save(filename);
};