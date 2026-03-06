import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../dataBase/perfil/perfil-service';
import { ThemeService } from '../services/theme.service';
import { PanelModule } from 'primeng/panel';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, PanelModule, ImageModule, ButtonModule, FileUploadModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  oficinaInfo: any;
  logoUrl: string | null = null;
  isUploading = false;

  constructor(
    private perfilService: PerfilService,
    private messageService: MessageService,
    public themeService: ThemeService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadOficinaInfo();
  }

  async loadOficinaInfo(): Promise<void> {
    try {
      this.oficinaInfo = await this.perfilService.getOficinaInfo();
      console.log('Oficina Info:', this.oficinaInfo);
      
      // Load logo if exists
      if (this.oficinaInfo?.logo_path) {
        this.logoUrl = this.perfilService.getImageUrl(this.oficinaInfo.logo_path);
      }
    } catch (error) {
      console.error('Error loading oficina info:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível carregar as informações da oficina'
      });
    }
  }

  async onFileSelect(event: any): Promise<void> {
    const file = event.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, selecione apenas arquivos de imagem'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'A imagem deve ter no máximo 5MB'
      });
      return;
    }

    this.isUploading = true;

    try {
      // Delete old logo if exists
      if (this.oficinaInfo?.logo_path) {
        await this.perfilService.deleteImage(this.oficinaInfo.logo_path);
      }

      // Upload new logo
      const fileName = `logo-${this.oficinaInfo.id}`;
      const filePath = await this.perfilService.uploadImage(file, fileName);

      // Update oficina with new logo path
      this.oficinaInfo = await this.perfilService.updateOficinaImage(
        this.oficinaInfo.id,
        filePath
      );

      // Update logo URL
      this.logoUrl = this.perfilService.getImageUrl(filePath);

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Logo atualizado com sucesso!'
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível fazer upload da imagem'
      });
    } finally {
      this.isUploading = false;
    }
  }
}
