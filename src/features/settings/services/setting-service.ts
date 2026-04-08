import { apiFetch } from '@/utils/api-client';

const ENDPOINT = '/admin/settings';

interface SettingRecord {
  settingKey: string;
  settingValue: string;
  description?: string;
}

interface ApiResponse<T> {
  data: T;
}

export const settingService = {
  getSetting: async (key: string): Promise<SettingRecord> => {
    const response = await apiFetch<ApiResponse<SettingRecord>>(`${ENDPOINT}/${key}`);
    return response.data;
  },

  updateSetting: async (key: string, value: string, description?: string): Promise<SettingRecord> => {
    const response = await apiFetch<ApiResponse<SettingRecord>>(`${ENDPOINT}/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value, description }),
    });
    return response.data;
  }
};
