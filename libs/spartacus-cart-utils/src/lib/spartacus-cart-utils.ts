import { Injectable, inject } from '@angular/core';
import { ActiveCartFacade, MultiCartFacade, Cart } from '@spartacus/cart/base/root';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Utility service for working with Spartacus cart functionality
 */
@Injectable({
  providedIn: 'root',
})
export class SpartacusCartUtils {
  private activeCartFacade = inject(ActiveCartFacade);
  private multiCartFacade = inject(MultiCartFacade);

  /**
   * Get the active cart
   */
  getActiveCart(): Observable<Cart> {
    return this.activeCartFacade.getActive();
  }

  /**
   * Get the total items count in the active cart
   */
  getCartItemsCount(): Observable<number> {
    return this.getActiveCart().pipe(
      map((cart) => cart?.totalItems ?? 0)
    );
  }

  /**
   * Get the total price of the active cart
   */
  getCartTotal(): Observable<string | undefined> {
    return this.getActiveCart().pipe(
      map((cart) => cart?.totalPrice?.formattedValue)
    );
  }

  /**
   * Check if cart is empty
   */
  isCartEmpty(): Observable<boolean> {
    return this.getCartItemsCount().pipe(
      map((count) => count === 0)
    );
  }

  /**
   * Get cart entries count
   */
  getCartEntriesCount(): Observable<number> {
    return this.getActiveCart().pipe(
      map((cart) => cart?.entries?.length ?? 0)
    );
  }
}
