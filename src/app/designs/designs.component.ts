import { Component, inject } from '@angular/core';
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
export class DesignsComponent {
  ref: DynamicDialogRef | undefined;

  first: number = 0;
  rows: number = 6;

  designs: Design[] = [
    {
      name: 'Goku (Dragon Ball)',
      image: 'assets/images/gokupost.jpg',
      category: 'Anime',
    },
    {
      name: 'Goku (Dragon Ball)',
      image: 'assets/images/gokupost.jpg',
      category: 'Anime',
    },
    {
      name: 'Goku (Dragon Ball)',
      image: 'assets/images/gokupost.jpg',
      category: 'Anime',
    },
    {
      name: 'Goku (Dragon Ball)',
      image: 'assets/images/gokupost.jpg',
      category: 'Anime',
    },
    {
      name: 'Goku (Dragon Ball)',
      image: 'assets/images/gokupost.jpg',
      category: 'Anime',
    },
  ];
  dialogService = inject(DialogService);

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
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }
}
