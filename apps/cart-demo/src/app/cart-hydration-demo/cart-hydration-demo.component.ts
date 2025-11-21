import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SpartacusCartUtilsService } from '@spartacus-hyd-inc/spartacus-cart-utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-hydration-demo',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './cart-hydration-demo.component.html',
  styleUrl: './cart-hydration-demo.component.scss',
})
export class CartHydrationDemoComponent implements OnInit {
  private cartUtilsService = inject(SpartacusCartUtilsService);
  
  // Track hydration state
  isHydrated = signal(false);
  hydrationTimestamp = signal<string | null>(null);
  interactionCount = signal(0);
  
  // Cart data observables
  cartItemsCount$: Observable<number> = this.cartUtilsService.getCartItemsCount();
  cartTotal$: Observable<string | undefined> = this.cartUtilsService.getCartTotal();
  isCartEmpty$: Observable<boolean> = this.cartUtilsService.isCartEmpty();
  
  ngOnInit() {
    // Mark as hydrated when component initializes
    this.isHydrated.set(true);
    this.hydrationTimestamp.set(new Date().toLocaleTimeString());
  }
  
  onInteraction() {
    this.interactionCount.update(count => count + 1);
  }
  
  getHydrationStatus(): string {
    return this.isHydrated() ? 'Hydrated' : 'Not Hydrated';
  }
}

