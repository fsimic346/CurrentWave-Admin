import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { Design } from '../../models/design';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DesignFormComponent } from '../design-form/design-form.component';
@Component({
  selector: 'cw-design-card',
  standalone: true,
  imports: [TagModule, SkeletonModule, CommonModule],
  templateUrl: './design-card.component.html',
  styleUrl: './design-card.component.scss',
})
export class DesignCardComponent {
  @Input({ required: true })
  design!: Design;

  @Output() deletedItem = new EventEmitter<string>();

  ref: DynamicDialogRef | undefined;
  imageLoaded: boolean = false;

  dialogService = inject(DialogService);
  onImageLoad(): void {
    this.imageLoaded = true;
  }

  showForm(): void {
    this.ref = this.dialogService.open(DesignFormComponent, {
      showHeader: false,
      modal: true,
      closeOnEscape: true,
      dismissableMask: true,
      contentStyle: {
        padding: 0,
        'border-top-right-radius': '12px',
        'border-top-left-radius': '12px',
        'padding-bottom': '2rem',
      },
      data: {
        design: this.design,
      },
    });
    this.ref.onClose.subscribe((data) => {
      if (data.deletedId) this.deletedItem.emit(data.deletedId);
    });
  }
}
