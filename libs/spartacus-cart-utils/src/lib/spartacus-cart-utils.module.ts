import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpartacusCartUtilsComponent } from './spartacus-cart-utils/spartacus-cart-utils.component';
import { SpartacusCartUtilsService } from './spartacus-cart-utils.service';

@NgModule({
  imports: [CommonModule, SpartacusCartUtilsComponent],
  exports: [SpartacusCartUtilsComponent],
  providers: [SpartacusCartUtilsService],
})
export class SpartacusCartUtilsModule {}

