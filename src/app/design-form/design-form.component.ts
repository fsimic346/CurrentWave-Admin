import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';

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
  ],
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
  selectedFile: any | undefined;

  messageService = inject(MessageService);
  constructor(private ref: DynamicDialogRef) {}

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
      console.log(this.name, this.category);
      this.ref.close();
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

  onSelect(event: any): void {
    this.selectedFile = event.files[0];
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }
}
