import { apiFetch } from '@/utils/api-client';

export interface ImageResponse {
  id: number;
  pageId: number;
  url: string;
  sourceType: string;
  altText?: string;
  publicId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const mediaService = {
  getAll: async (): Promise<ImageResponse[]> => {
    const response = await apiFetch<ApiResponse<ImageResponse[]>>('/images');
    return response.data;
  },

  getByPageId: async (pageId: number): Promise<ImageResponse[]> => {
    const response = await apiFetch<ApiResponse<ImageResponse[]>>(`/images/page/${pageId}`);
    return response.data;
  },

  upload: async (file: File): Promise<{ url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiFetch<ApiResponse<any>>('/images/upload', {
      method: 'POST',
      body: formData,
    });
    return response.data;
  },

  linkToPage: async (pageId: number, imageData: { url: string; sourceType: string; altText?: string; publicId?: string }): Promise<ImageResponse> => {
    const params = new URLSearchParams();
    params.append('url', imageData.url);
    params.append('sourceType', imageData.sourceType);
    if (imageData.altText) params.append('altText', imageData.altText);
    if (imageData.publicId) params.append('publicId', imageData.publicId);

    const response = await apiFetch<ApiResponse<ImageResponse>>(`/images/page/${pageId}?${params.toString()}`, {
      method: 'POST',
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiFetch(`/images/${id}`, {
      method: 'DELETE',
    });
  }
};
