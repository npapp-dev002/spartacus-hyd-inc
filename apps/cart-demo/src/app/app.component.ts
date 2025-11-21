import { Component, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SpartacusCartUtilsService } from '@spartacus-hyd-inc/spartacus-cart-utils';
import { CartHydrationDemoComponent } from './cart-hydration-demo/cart-hydration-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, AsyncPipe, CartHydrationDemoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cart-demo';
  private cartUtilsService = inject(SpartacusCartUtilsService);
  
  // Subject to trigger cart loading
  private loadCartTrigger = new BehaviorSubject<boolean>(false);

  // Lazy-loaded observables that only start when loadCartTrigger emits true
  cartItemsCount$: Observable<number> = this.loadCartTrigger.pipe(
    switchMap((shouldLoad) => shouldLoad ? this.cartUtilsService.getCartItemsCount() : of(0))
  );
  
  cartTotal$: Observable<string | undefined> = this.loadCartTrigger.pipe(
    switchMap((shouldLoad) => shouldLoad ? this.cartUtilsService.getCartTotal() : of(undefined))
  );
  
  isCartEmpty$: Observable<boolean> = this.loadCartTrigger.pipe(
    switchMap((shouldLoad) => shouldLoad ? this.cartUtilsService.isCartEmpty() : of(true))
  );

  loadCart() {
    this.loadCartTrigger.next(true);
  }
}
