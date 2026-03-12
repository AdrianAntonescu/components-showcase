import { Component, computed, effect, input, output } from '@angular/core';

@Component({
  selector: 't-progress',
  imports: [],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {
  readonly radius = input.required<number>();
  readonly progress = input.required<number, number>({
    transform: (value) => Math.min(100, Math.max(0, value)),
  });
  readonly color = input<string>();

  readonly complete = output<void>();

  readonly strokeWidth = computed(() => Math.max(this.radius() * 0.3, 5));
  readonly svgSize = computed(() => this.radius() * 2 + this.strokeWidth());
  readonly center = computed(() => this.svgSize() / 2);
  readonly innerRadius = computed(() => this.radius() - this.strokeWidth() / 2);
  readonly circumference = computed(() => 2 * Math.PI * this.innerRadius());
  readonly dashOffset = computed(() => {
    return this.circumference() * (1 - this.progress() / 100);
  });

  constructor() {
    effect(() => {
      if (this.progress() === 100) {
        this.complete.emit();
      }
    })
  }
}
