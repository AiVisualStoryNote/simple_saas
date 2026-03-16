/**
 * External Book Data API
 * Unified API call management for external services
 */

/**
 * Generic function to call external book data API
 * @param action - API action name
 * @param params - Request parameters
 * @returns API result data
 * @throws Throws error if API config is missing or returns error
 */
export async function callExternalAPI(action: string, params: any = {}, cn_market: boolean = false) {
  const apiUrl = cn_market ? process.env.NEXT_PUBLIC_API_URL_CN : process.env.NEXT_PUBLIC_API_URL;
  const apiToken = cn_market ? process.env.API_TOKEN_CN : process.env.API_TOKEN;

  if (!apiUrl || !apiToken) {
    throw new Error('API configuration is missing');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action,
      params,
    }),
  });

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error);
  }

  return result.result;
}
