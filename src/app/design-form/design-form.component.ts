import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';
import { ImageUploadDialogComponent } from '../image-upload-dialog/image-upload-dialog.component';
import { DesignService } from '../design.service';
import { Design, DesignCreate } from '../../models/design';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
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
    CommonModule,
    ConfirmDialogModule,
    InputNumberModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './design-form.component.html',
  styleUrl: './design-form.component.scss',
})
export class DesignFormComponent implements OnInit {
  design?: Design;
  name: string | undefined;
  category: string | undefined;
  type: string | undefined;
  price: number | undefined;
  categories = ['Rap', 'Anime', 'Originals'];
  types: string[] = [];
  loading = false;
  image: string | undefined;
  imageSrc: string | ArrayBuffer | null = null;
  selectedFiles: File[] = [];
  uploadDialogRef?: DynamicDialogRef;

  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  designService = inject(DesignService);
  confimationService = inject(ConfirmationService);

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    if (config.data) {
      this.design = config.data.design;

      if (this.design) {
        this.name = this.design.name;
        this.category = this.design.category;
        this.imageSrc = this.design.image;
        this.type = this.design.type;
        this.price = this.design.price;
      }
    }
  }

  async ngOnInit(): Promise<void> {
    this.types = await this.designService.getTypes();
  }

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

  async updateDesign(): Promise<void> {
    if (
      !this.name ||
      !this.category ||
      this.image ||
      !this.type ||
      !this.price
    ) {
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
      this.design!.name = this.name;
      this.design!.category = this.category;
      this.design!.price = this.price;
      this.design!.type = this.type;
      const result = await this.designService.updateDesign(
        this.design!,
        this.selectedFiles[0],
        this.selectedFiles[1],
        this.selectedFiles[2]
      );

      this.loading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Design created',
        detail: `Successfully created '${this.name}' design.`,
        life: 3000,
      });
      this.ref.close(result);
    } catch (error) {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error while creating design.',
        detail: error as string,
        life: 3000,
      });
    }
  }

  async createDesign(): Promise<void> {
    if (
      !this.name ||
      !this.category ||
      this.image ||
      !this.type ||
      !this.price
    ) {
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
        type: this.type,
        price: this.price,
        createdAt: new Date().toUTCString(),
      };
      const result = await this.designService.createDesign(
        design,
        this.selectedFiles[0],
        this.selectedFiles[1],
        this.selectedFiles[2]
      );

      this.loading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Design created',
        detail: `Successfully created '${this.name}' design.`,
        life: 3000,
      });
      this.ref.close({ design: result });
    } catch (error) {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error while creating design.',
        detail: error as string,
        life: 3000,
      });
    }
  }

  async deleteDesign(event: Event): Promise<void> {
    this.confimationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this design?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: async () => {
        this.loading = true;
        await this.designService.deleteDesign(this.design!);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Design deleted',
          detail: `Successfully deleted '${this.name}' design.`,
          life: 3000,
        });
        this.ref.close({ deletedId: this.design!.id });
      },
      reject: () => {},
    });
  }
}
