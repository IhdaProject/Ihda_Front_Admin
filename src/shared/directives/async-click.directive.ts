import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { Button, ButtonDirective } from 'primeng/button';
import { Subscription, Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}; // noop means No Operation

@Directive({
  selector: '[asyncClick]',
  standalone: true,
})
export class AsyncClickDirective implements OnDestroy {
  /**
   *
   */
  @Input()
  asyncClick!: () => any; // any Function

  @Input()
  successMessage?: string;

  @Input()
  errorMessage?: string;

  /**
   *
   */
  private subscription!: Subscription;

  /**
   *
   * @param _renderer
   * @param _elementRef
   */
  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef<Button>,
    private cd: ChangeDetectorRef,
    private button: ButtonDirective,
    private $message: MessageService,
    private $translate: TranslocoService
  ) {
  }

  /**
   *
   */
  @HostListener('click')
  onClick() {
    if (typeof this.asyncClick === 'function') {
      this.unsubscribe();
      this.subscribe(this.asyncClick());
    }
  }

  /**
   *
   */
  private disable() {
    this._renderer.setAttribute(
      this._elementRef.nativeElement,
      'disabled',
      'true'
    );
  }

  /**
   *
   */
  private enable() {
    this._renderer.removeAttribute(this._elementRef.nativeElement, 'disabled');
  }

  /**
   *
   * @param obs$
   */
  private subscribe(obs$: Observable<any>) {
    this.beforeStartingRequest();

    const afterRequstFinished = () => this.afterRequstFinished();
    if (typeof obs$.subscribe === 'function') {
      this.subscription = obs$.subscribe({
        next: () => {
            if (this.successMessage) {
                this.$message.add({
                    severity: 'success',
                    summary: this.$translate.translate(this.successMessage),
                });
            }
        },
        complete: afterRequstFinished,
        error: () => {
            if (this.errorMessage) {
                this.$message.add({
                    severity: 'error',
                    summary: this.$translate.translate(this.errorMessage),
                });
            }
            afterRequstFinished();
        },
      });
      return;
    }
  }

  /**
   *
   */
  private afterRequstFinished() {
    this.enable();
    this.startOrStopLoading(false);
    this.cd.markForCheck();
  }

  /**
   *
   */
  private beforeStartingRequest() {
    this.disable();
    this.startOrStopLoading(true);
    this.cd.markForCheck();
  }

  /**
   *
   */
  private startOrStopLoading(loading: boolean) {
    this.button.loading = loading;
  }

  /**
   *
   */
  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   *
   */
  ngOnDestroy() {
    this.unsubscribe();
  }
}
