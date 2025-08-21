import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { AccountService } from '../services/account.service';
import { Account } from '../types/account';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  private currentUser!: Account | null;
  private requiredPermissions: number[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.accountService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.updateView();
    });
  }

  @Input()
  set hasPermission(val: number[]) {
    this.requiredPermissions = val || [];
    this.updateView();
  }

  private updateView() {
    this.viewContainer.clear();

    if (checkPermission(this.currentUser, this.requiredPermissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}

export function checkPermission(
  currentUser: Account | null,
  permissions: number[]
): boolean {
  if (!currentUser || !currentUser.permissions) {
    return false;
  }
  return permissions.some((p) => currentUser.permissions.includes(p));
}
