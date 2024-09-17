import { Component } from '@angular/core';
import { DesignCardComponent } from '../design-card/design-card.component';
import { Design } from '../../models/design';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'cw-designs',
  standalone: true,
  imports: [DesignCardComponent, CommonModule, ButtonModule],
  templateUrl: './designs.component.html',
  styleUrl: './designs.component.scss',
})
export class DesignsComponent {
  designs: Design[] = [
    {
      name: 'Goku (Dragon Ball)',
      image: 'assets/images/gokupost.jpg',
    },
    {
      name: 'Goku (Dragon Ball)',
      image: 'assets/images/gokupost.jpg',
    },
    {
      name: 'Goku (Dragon Ball)',
      image: 'assets/images/gokupost.jpg',
    },
    {
      name: 'Goku (Dragon Ball)',
      image: 'assets/images/gokupost.jpg',
    },
    {
      name: 'Goku (Dragon Ball)',
      image: 'assets/images/gokupost.jpg',
    },
  ];

  show(): void {}
}
