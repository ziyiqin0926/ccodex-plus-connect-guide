import { localHelper } from './content.js';

export function findFaqs(query, faqs) {
  const text = query.trim().toLowerCase();
  if (!text) return faqs.slice(0, 3);

  return faqs
    .map((faq) => {
      const score = faq.keywords.reduce((sum, word) => (
        text.includes(word.toLowerCase()) ? sum + 1 : sum
      ), 0);
      return { faq, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.faq);
}

export async function checkLocalHelper(fetcher = fetch, signal = AbortSignal.timeout(2000)) {
  const response = await fetcher(localHelper.healthUrl, { signal });
  if (!response.ok) throw new Error('LOCAL_HELPER_UNAVAILABLE');
  return response.json();
}
