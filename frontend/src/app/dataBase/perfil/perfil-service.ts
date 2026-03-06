import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private readonly BUCKET_NAME = 'oficina-images';

  constructor(private supabaseService: SupabaseService) {}

  async getOficinaInfo() {
    const { data, error } = await this.supabaseService.client
      .from('oficina')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Upload an image to Supabase Storage
   * @param file - The image file to upload
   * @param fileName - Optional custom file name (will use original name if not provided)
   * @returns The path of the uploaded file
   */
  async uploadImage(file: File, fileName?: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const filePath = fileName || `${Date.now()}.${fileExt}`;

    const { data, error } = await this.supabaseService.client.storage
      .from(this.BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return data.path;
  }

  /**
   * Get the public URL for an image
   * @param filePath - The path of the file in storage
   * @returns The public URL of the image
   */
  getImageUrl(filePath: string): string {
    const { data } = this.supabaseService.client.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Delete an image from storage
   * @param filePath - The path of the file to delete
   */
  async deleteImage(filePath: string): Promise<void> {
    const { error } = await this.supabaseService.client.storage
      .from(this.BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
  }

  /**
   * Update oficina info with image path
   * @param oficinaId - The ID of the oficina
   * @param imagePath - The path of the uploaded image
   */
  async updateOficinaImage(oficinaId: string, imagePath: string) {
    const { data, error } = await this.supabaseService.client
      .from('oficina')
      .update({ logo_path: imagePath })
      .eq('id', oficinaId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
