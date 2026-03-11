/**
 * 外部图书数据 API 接口调用
 * 统一管理所有外部 API 调用
 */

/**
 * 调用外部图书数据 API 的通用函数
 * @param action - API 动作名称
 * @param params - 请求参数
 * @returns API 返回的 result 数据
 * @throws 如果 API 配置缺失或返回错误，抛出异常
 */
export async function callExternalAPI(action: string, params: any = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiToken = process.env.API_TOKEN;

  if (!apiUrl || !apiToken) {
    throw new Error('API配置缺失');
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
