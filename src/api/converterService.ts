import apiService from './apiService';
import axios from 'axios';
import { toast } from 'sonner';

export default class ConverterService {
  static async getUploadS3UrlForFileToConvert(
    fileName: string,
    ext: string,
    mimeType: string,
    signal?: AbortSignal
  ): Promise<{
    inputFileKey: string;
    putUrl: string;
    outputFolderKey: string;
  }> {
    return apiService
      .get('/convert/upload', {
        params: {
          fileName: fileName,
          ext,
          contentType: mimeType,
        },
        signal
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          toast.error('Something went wrong :(', { description: error?.message });
        }
      });
  }

  static async uploadFileToS3(file: File, signedUrl: string, signal?: AbortSignal): Promise<void> {
    try {
      const response = await axios.put(signedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        signal
      });

      if (response.status !== 200) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
    } catch (error: any) {
      if (error.name !== 'CanceledError') {
        console.error('Upload to S3 failed:', error);
        toast.error('Something went wrong :(', {
          description: 'Upload to S3 failed',
        });
      }
    }
  }

  static async convertTo(
    inputFileKey: string,
    outputFolder: string,
    convertTo: 'pdf' | 'png' | 'txt',
    signal?: AbortSignal
  ): Promise<{ convertedUrls: string[]; format: 'pdf' | 'png' | 'txt' }> {
    return apiService
      .post('/convert/execute', {
        inputFileKey,
        outputFolder,
        convertTo,
      }, { signal })
      .then((response) => response.data)
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          toast.error('Something went wrong :(', {
            description: error?.message,
          });
        }
      });
  }
}
