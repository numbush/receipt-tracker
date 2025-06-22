import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ReceiptAnalysisResult {
  storeName: string;
  amount: number;
  confidence: 'high' | 'medium' | 'low';
  extractedText: string;
}

export async function analyzeReceiptImage(imageBase64: string): Promise<ReceiptAnalysisResult> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: imageBase64,
            }
          },
          {
            type: "text",
            text: `Analyze this receipt image and extract the following information in JSON format:

{
  "storeName": "Name of the business/store (main business name only)",
  "amount": "Total amount as a number (final total after tax, like 12.45)",
  "confidence": "Your confidence level: high, medium, or low",
  "extractedText": "All text you can clearly read from the receipt"
}

Rules:
- Extract only the final total amount (after tax)
- Store name should be the main business name, not taglines
- Amount should be a number without currency symbols
- If the receipt is unclear, set confidence to 'low'
- Return only valid JSON format`
          }
        ]
      }]
    });

    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content found in response');
    }
    
    const result = JSON.parse(textContent.text);
    
    return {
      storeName: result.storeName || 'Unknown Store',
      amount: parseFloat(result.amount) || 0,
      confidence: result.confidence || 'low',
      extractedText: result.extractedText || ''
    };
    
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to analyze receipt with AI');
  }
}
