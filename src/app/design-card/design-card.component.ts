import { Component, Input } from '@angular/core';
import { Design } from '../../models/design';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'cw-design-card',
  standalone: true,
  imports: [TagModule],
  templateUrl: './design-card.component.html',
  styleUrl: './design-card.component.scss',
})
export class DesignCardComponent {
  @Input({ required: true })
  design!: Design;
}
