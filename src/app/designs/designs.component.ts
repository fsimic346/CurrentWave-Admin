import { Component, inject, OnInit } from '@angular/core';
import { DesignCardComponent } from '../design-card/design-card.component';
import { Design } from '../../models/design';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DesignFormComponent } from '../design-form/design-form.component';
import { DesignService } from '../design.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'cw-designs',
  standalone: true,
  imports: [
    DesignCardComponent,
    CommonModule,
    ButtonModule,
    PaginatorModule,
    DynamicDialogModule,
  ],
  providers: [DialogService],
  templateUrl: './designs.component.html',
  styleUrl: './designs.component.scss',
})
export class DesignsComponent implements OnInit {
  ref: DynamicDialogRef | undefined;

  first: number = 0;
  rows: number = 6;

  designs: Design[] = [];
  dialogService = inject(DialogService);
  designService = inject(DesignService);

  async ngOnInit(): Promise<void> {
    this.designs = await this.designService.getDesigns();
  }

  show() {
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
    });
    this.ref.onClose.subscribe((design) => {
      if (design) this.designs.push(design);
    });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }
}
