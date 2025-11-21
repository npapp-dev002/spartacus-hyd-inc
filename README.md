# SpartacusHydInc

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Spartacus Hydration Demo - Angular Standalone Components with SSR ✨

This workspace demonstrates Angular hydration features with SAP Spartacus storefront, built using standalone components and server-side rendering (SSR).

## 🎯 Project Overview

This Nx monorepo contains:

- **cart-demo**: A demo application showcasing Angular hydration with Spartacus cart features
- **spartacus-cart-utils**: A utility library for working with Spartacus cart functionality
- **test-spartacus-inc-hyd**: Additional test application

### Key Features

#### 🔥 Angular Hydration

The cart-demo application demonstrates advanced Angular hydration capabilities:

- **Client Hydration** with Event Replay and No HTTP Transfer Cache
- **Incremental Hydration** using `@defer` blocks
- **Lazy Loading** with interaction-based triggers
- **Hydration on Viewport** for components that scroll into view

#### 🛒 Spartacus Integration

- Full integration with SAP Spartacus storefront
- Cart management using Spartacus facades (`ActiveCartFacade`, `MultiCartFacade`)
- Real-time cart data display with hydration

#### 🎨 Standalone Components Architecture

All components are built using Angular standalone components:

- `AppComponent` - Main application component
- `CartHydrationDemoComponent` - Demonstrates hydration features
- No NgModules required (except for legacy Spartacus compatibility)

### Hydration Demo Features

The `cart-demo` application includes:

1. **Deferred Cart Loading**

   - Cart information loads only on user interaction
   - Uses `@defer (on interaction)` with `hydrate on interaction`
   - Displays loading and placeholder states

2. **Viewport-Based Hydration**

   - Demo component hydrates when scrolled into view
   - Uses `@defer (on viewport)` directive
   - Tracks hydration state and timestamp

3. **Hydration Metrics**
   - Real-time hydration status tracking
   - Interaction counter
   - Timestamp recording
   - Visual indicators for hydration state

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created.

## 🚀 Getting Started

### Run the Cart Demo Application

**Build all projects:**

```sh
npm run build:all
```

**Server-side rendering (SSR) mode:**

```sh
npm run serve:ssr:cart-demo
```

Then open http://localhost:4000

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

## 🏗️ Architecture & Implementation

### Application Configuration

The cart-demo uses standalone component bootstrapping:

```typescript
// main.ts - Client-side bootstrap
bootstrapApplication(AppComponent, appConfig);

// main.server.ts - SSR bootstrap
const bootstrap = () => bootstrapApplication(AppComponent, config);
```

### Hydration Configuration

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideClientHydration(
      withEventReplay(), // Replays user events after hydration
      withNoHttpTransferCache() // Prevents HTTP request duplication
    ),
    // ... Spartacus providers
  ],
};
```

### Deferred Loading Example

```typescript
@defer (on interaction(trigger); hydrate on interaction) {
  <div class="cart-info">
    <p>Items in cart: {{ cartItemsCount$ | async }}</p>
    <p>Cart total: {{ (cartTotal$ | async) ?? 'N/A' }}</p>
  </div>
} @placeholder {
  <button #trigger (click)="loadCart()">Click to load cart</button>
} @loading (minimum 500ms) {
  <p>Loading cart...</p>
}
```

### Spartacus Cart Utils Library

The `spartacus-cart-utils` library provides a clean interface for Spartacus cart operations:

```typescript
@Injectable({ providedIn: 'root' })
export class SpartacusCartUtilsService {
  private activeCartFacade = inject(ActiveCartFacade);

  getActiveCart(): Observable<Cart>;
  getCartItemsCount(): Observable<number>;
  getCartTotal(): Observable<string | undefined>;
  isCartEmpty(): Observable<boolean>;
}
```

**Key Implementation Details:**

- Uses Spartacus public facades (`ActiveCartFacade`, `MultiCartFacade`)
- Imports from `@spartacus/cart/base/root` (public API)
- Avoids internal services for better stability

## 📝 Known Limitations

### SSR Cyclic Dependency Issue

The application has a known NG0401 (Cyclic Dependency) error during SSR rendering. This is a limitation when using standalone components with Spartacus modules that have complex interdependencies:

- **Client-side rendering**: ✅ Works perfectly
- **SSR rendering**: ⚠️ Has cyclic dependency error (seems to be Spartacus limitation according to Claude Sonnet)
- **Bootstraping error**: Might not be even related to incremental hydration. It is thrown for ssr execution.
- **Impact**: Initial server render fails, but client-side hydration works correctly
