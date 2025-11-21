import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { 
  AppRoutingModule, 
  BaseStorefrontModule, 
  defaultCmsContentProviders, 
  layoutConfigFactory, 
  mediaConfig 
} from '@spartacus/storefront';
import { CartBaseRootModule } from '@spartacus/cart/base/root';
import { CartBaseModule } from '@spartacus/cart/base';
import { cartBaseTranslationChunksConfig, cartBaseTranslationsEn } from '@spartacus/cart/base/assets';
import { CART_BASE_FEATURE } from '@spartacus/cart/base/root';
import { AuthModule } from '@spartacus/core';
import { 
  CmsConfig, 
  I18nConfig, 
  OccConfig, 
  provideConfig, 
  provideConfigFactory, 
  SiteContextConfig 
} from '@spartacus/core';
import { SpartacusCartUtilsModule } from '@spartacus-hyd-inc/spartacus-cart-utils';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideClientHydration(withEventReplay(), withNoHttpTransferCache()),
    importProvidersFrom(
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      AppRoutingModule,
      BaseStorefrontModule,
      AuthModule.forRoot(),
      CartBaseRootModule,
      CartBaseModule,
      SpartacusCartUtilsModule,
    ),
    provideConfigFactory(layoutConfigFactory),
    provideConfig(mediaConfig),
    ...defaultCmsContentProviders,
    provideConfig(<OccConfig>{
      backend: {
        occ: {
          baseUrl: 'https://40.76.109.9:9002',
        },
      },
    }),
    provideConfig(<SiteContextConfig>{
      context: {},
    }),
    provideConfig(<CmsConfig>{
      featureModules: {
        [CART_BASE_FEATURE]: {
          module: () =>
            import('@spartacus/cart/base').then((m) => m.CartBaseModule),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: { en: cartBaseTranslationsEn },
        chunks: cartBaseTranslationChunksConfig,
        fallbackLang: 'en',
      },
    }),
  ],
};
