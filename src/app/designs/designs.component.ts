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
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

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
    InputTextModule,
  ],
  providers: [DialogService],
  templateUrl: './designs.component.html',
  styleUrl: './designs.component.scss',
})
export class DesignsComponent implements OnInit {
  ref: DynamicDialogRef | undefined;

  first: number = 0;
  rows: number = 6;
  totalRecords: number = 0;
  searchTerm: string = '';
  private searchText$ = new Subject<string>();

  designs: Design[] = [];
  lastDoc: any = null;

  dialogService = inject(DialogService);
  designService = inject(DesignService);

  async ngOnInit(): Promise<void> {
    await this.loadDesigns();
    this.searchText$.pipe(debounceTime(300)).subscribe((term) => {
      if (term.trim() !== '') {
        this.onSearch(term);
      } else {
        this.resetSearch();
      }
    });
  }

  async loadDesigns(term: string = ''): Promise<void> {
    const { designs, lastDoc } = await this.designService.getDesigns(
      this.rows,
      this.lastDoc,
      this.searchTerm
    );

    this.designs = designs;
    this.lastDoc = lastDoc;
    this.totalRecords += designs.length;
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
    this.ref.onClose.subscribe((data) => {
      if (data.design) this.designs.unshift(data.design);
    });
  }

  deletedItem(id: string) {
    this.designs = this.designs.filter((x) => x.id != id);
    console.log(this.designs.length);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;

    this.loadDesigns();
  }

  onSearch(term: string): void {
    this.first = 0;
    this.designs = [];
    this.totalRecords = 0;
    this.lastDoc = null;
    this.loadDesigns(term);
  }

  resetSearch() {
    this.first = 0;
    this.designs = [];
    this.totalRecords = 0;
    this.lastDoc = null;
    this.loadDesigns();
  }

  onSearchChange(): void {
    this.searchText$.next(this.searchTerm);
  }
}
