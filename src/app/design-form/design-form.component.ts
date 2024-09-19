import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';
import { ImageUploadDialogComponent } from '../image-upload-dialog/image-upload-dialog.component';
import { DesignService } from '../design.service';
import { Design, DesignCreate } from '../../models/design';

@Component({
  selector: 'cw-design-form',
  standalone: true,
  imports: [
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    RippleModule,
    DropdownModule,
    FileUploadModule,
    HttpClientModule,
    ImageUploadDialogComponent,
  ],
  providers: [DialogService],
  templateUrl: './design-form.component.html',
  styleUrl: './design-form.component.scss',
})
export class DesignFormComponent {
  name: string | undefined;
  category: string | undefined;
  categories = ['Rap', 'Anime', 'Originals'];
  loading = false;
  image: string | undefined;
  imageSrc: string | ArrayBuffer | null = null;
  selectedFiles: File[] = [];
  uploadDialogRef?: DynamicDialogRef;

  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  designService = inject(DesignService);

  constructor(private ref: DynamicDialogRef) {}

  openImageUploadDialog(): void {
    this.uploadDialogRef = this.dialogService.open(ImageUploadDialogComponent, {
      showHeader: true,
      modal: true,
      closeOnEscape: true,
      dismissableMask: true,
    });
    this.uploadDialogRef.onClose.subscribe((files) => {
      this.selectedFiles = files;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(this.selectedFiles[0]);
    });
  }

  async createDesign(): Promise<void> {
    if (!this.name || !this.category || this.image) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid data',
        detail: 'All fields are required.',
        life: 3000,
      });
      return;
    }

    this.loading = true;
    try {
      const design: DesignCreate = {
        name: this.name,
        category: this.category,
        createdAt: new Date().toUTCString(),
      };
      const result = await this.designService.createDesign(
        design,
        this.selectedFiles[0],
        this.selectedFiles[1],
        this.selectedFiles[2]
      );

      this.ref.close(result);
      this.messageService.add({
        severity: 'success',
        summary: 'Design created',
        detail: `Successfully created '${this.name}' design.`,
        life: 3000,
      });
      this.loading = false;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error while creating design.',
        detail: error as string,
        life: 3000,
      });
      this.loading = false;
    }
  }
}
