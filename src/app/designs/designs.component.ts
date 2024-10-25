import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
  ],
  providers: [DialogService],
  templateUrl: './designs.component.html',
  styleUrl: './designs.component.scss',
})
export class DesignsComponent implements OnInit {
  ref: DynamicDialogRef | undefined;

  searchTerm: string = '';
  private searchText$ = new Subject<string>();

  designs: Design[] = [];

  messageService = inject(MessageService);
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

  trackBy(index: number, design: Design) {
    return design.id;
  }

  async loadDesigns(term: string = ''): Promise<void> {
    const { designs } = await this.designService.getDesigns(this.searchTerm);

    this.designs = designs;
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
      if (data && data.design) this.designs.unshift(data.design);
    });
  }

  deletedItem(id: string) {
    this.designs = this.designs.filter((x) => x.id != id);
    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Design deleted',
    //   detail: `Successfully deleted design.`,
    //   life: 3000,
    // });
  }

  onSearch(term: string): void {
    this.designs = [];
    this.loadDesigns(term);
  }

  resetSearch() {
    this.designs = [];
    this.loadDesigns();
  }

  onSearchChange(): void {
    this.searchText$.next(this.searchTerm);
  }
}
