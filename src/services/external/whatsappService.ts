import axios from 'axios';
import FormData from 'form-data';
import { environment } from '../../environment/environment';

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  apiVersion?: string;
}

type WhatsAppMessageType = 'text' | 'template' | 'image' | 'document' | 'interactive';

interface WhatsAppMessageBase {
  to: string;
  type: WhatsAppMessageType;
  preview_url?: boolean;
  messaging_product: 'whatsapp';
}

interface TextMessage extends WhatsAppMessageBase {
  type: 'text';
  text: {
    body: string;
  };
}

interface TemplateMessage extends WhatsAppMessageBase {
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: 'header' | 'body' | 'button';
      parameters: Array<{
        type: 'text' | 'currency' | 'date_time' | 'document' | 'image';
        text?: string;
        [key: string]: any;
      }>;
    }>;
  };
}

interface MediaMessage extends WhatsAppMessageBase {
  type: 'image' | 'document';
  [key: string]: any;
}

type WhatsAppMessage = TextMessage | TemplateMessage | MediaMessage;

interface MediaUploadResponse {
  id: string;
}

export class WhatsAppService {
  private static instance: WhatsAppService;
  private config: WhatsAppConfig;
  private baseUrl: string;

  private constructor(config: WhatsAppConfig) {
    this.config = {
      apiVersion: 'v17.0',
      ...config
    };
    this.baseUrl = `https://graph.facebook.com/${this.config.apiVersion}`;
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      if (!environment.whatsapp) {
        throw new Error('WhatsApp configuration is missing in environment variables');
      }
      
      WhatsAppService.instance = new WhatsAppService({
        phoneNumberId: environment.whatsapp.phoneNumberId,
        accessToken: environment.whatsapp.accessToken,
      });
    }
    return WhatsAppService.instance;
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      throw new Error(`WhatsApp API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  public async sendMessage(message: WhatsAppMessage) {
    const endpoint = `${this.config.phoneNumberId}/messages`;
    return this.makeRequest(endpoint, 'POST', message);
  }

  public async sendTextMessage(to: string, text: string, previewUrl: boolean = false) {
    const message: TextMessage = {
      to,
      type: 'text',
      text: { body: text },
      preview_url: previewUrl,
      messaging_product: 'whatsapp'
    };
    return this.sendMessage(message);
  }

  public async sendTemplateMessage(
    to: string, 
    templateName: string, 
    languageCode: string = 'es', 
    components?: any[]
  ) {
    const message: TemplateMessage = {
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components
      },
      messaging_product: 'whatsapp'
    };
    return this.sendMessage(message);
  }

  public async uploadMedia(file: Buffer | Blob, type: 'image' | 'document', filename: string = 'file') {
    const formData = new FormData();
    formData.append('file', file, { filename });
    formData.append('type', type);
    formData.append('messaging_product', 'whatsapp');

    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.config.phoneNumberId}/media`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${this.config.accessToken}`
          }
        }
      );
      return response.data as MediaUploadResponse;
    } catch (error: any) {
      console.error('Error uploading media:', error.response?.data || error.message);
      throw new Error(`Failed to upload media: ${error.message}`);
    }
  }

  public async getMediaUrl(mediaId: string) {
    return this.makeRequest(mediaId);
  }

  public async downloadMedia(mediaId: string) {
    const mediaInfo = await this.getMediaUrl(mediaId);
    const response = await axios.get(mediaInfo.url, {
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`
      },
      responseType: 'arraybuffer'
    });
    return response.data;
  }

  public async getTemplateList() {
    return this.makeRequest(`${this.config.phoneNumberId}/message_templates`);
  }
}

export default WhatsAppService;
