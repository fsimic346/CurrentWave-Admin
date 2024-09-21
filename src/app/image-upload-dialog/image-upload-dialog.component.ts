import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'cw-image-upload-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FileUploadModule,
    ButtonModule,
    HttpClientModule,
  ],
  templateUrl: './image-upload-dialog.component.html',
  styleUrl: './image-upload-dialog.component.scss',
})
export class ImageUploadDialogComponent {
  selectedFiles: File[] = [];
  messageService = inject(MessageService);
  constructor(private config: PrimeNGConfig, private ref: DynamicDialogRef) {}

  onSelect(event: any, index: number): void {
    this.selectedFiles[index] = event.files[0];
  }

  submitImages(): void {
    this.ref.close(this.selectedFiles);
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes![0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes![i]}`;
  }
}
