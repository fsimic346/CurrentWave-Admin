import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';

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
  constructor(private ref: DynamicDialogRef) {}

  onSelect(event: any, index: number): void {
    this.selectedFiles[index - 1] = event.files[0];
  }

  submitImages(): void {
    if (this.selectedFiles.length === 3) {
      this.ref.close(this.selectedFiles);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Images',
        detail: 'All images are required.',
        life: 3000,
      });
    }
  }
}
