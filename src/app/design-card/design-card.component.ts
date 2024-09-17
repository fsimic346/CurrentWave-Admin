import { Component, Input } from '@angular/core';
import { Design } from '../../models/design';

@Component({
  selector: 'cw-design-card',
  standalone: true,
  imports: [],
  templateUrl: './design-card.component.html',
  styleUrl: './design-card.component.scss',
})
export class DesignCardComponent {
  @Input({ required: true })
  design!: Design;
}
