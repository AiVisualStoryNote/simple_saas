const FILE_STORE_BASE_URL = process.env.FILE_STORE_BASE_URL;
const FILE_STORE_TOKEN = process.env.FILE_STORE_TOKEN;

interface FileInfo {
  file_key: string;
  file_url: string;
  expire_time: number;
  expire_description: string;
}

interface GetFileResponse {
  success: boolean;
  action: string;
  data: FileInfo;
  message: string;
}

export async function getFile(fileKey: string): Promise<FileInfo | null> {
  const baseUrl = process.env.FILE_STORE_BASE_URL;
  const token = process.env.FILE_STORE_TOKEN;

  if (!baseUrl || !token) {
    console.error('File Store API configuration missing:', { baseUrl: !!baseUrl, token: !!token });
    return null;
  }

  try {
    const payload = {
      action: 'get_file',
      params: JSON.stringify({ file_key: fileKey }),
    };
    console.log('File Store request:', { baseUrl, payload });

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('File Store response:', { status: response.status, data });

    if (data.response?.success && data.response?.data) {
      return data.response.data;
    }

    console.error('File Store API error:', data.message || data.error);
    return null;
  } catch (error) {
    console.error('Failed to get file from store:', error);
    return null;
  }
}