import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCounterAnimation]',
  standalone: true,
})
export class CounterAnimationDirective implements OnChanges {
  @Input() appCounterAnimation: number = 0;
  private previousValue: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appCounterAnimation'] && !changes['appCounterAnimation'].firstChange) {
      const currentValue = changes['appCounterAnimation'].currentValue;
      const previousValue = changes['appCounterAnimation'].previousValue;

      if (currentValue !== previousValue) {
        this.animateChange(previousValue, currentValue);
      }
    } else {
      this.previousValue = this.appCounterAnimation;
    }
  }

  private animateChange(from: number, to: number): void {
    const element = this.el.nativeElement;
    const direction = to > from ? 'up' : 'down';

    this.renderer.removeClass(element, 'flip-up');
    this.renderer.removeClass(element, 'flip-down');

    void element.offsetWidth;

    this.renderer.addClass(element, `flip-${direction}`);

    setTimeout(() => {
      this.renderer.removeClass(element, `flip-${direction}`);
    }, 600);
  }
}
