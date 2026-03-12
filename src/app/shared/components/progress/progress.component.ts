import { Component, input } from '@angular/core';

@Component({
  selector: 't-progress',
  imports: [],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent {
  readonly radius = input.required<number>();
  readonly progress = input.required<number>();
  readonly color = input<string>();
}
