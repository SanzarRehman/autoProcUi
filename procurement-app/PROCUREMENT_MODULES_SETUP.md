# Procurement Modules Setup Guide

## ✅ Completed

1. **Proxy Configuration** - Updated `proxy.conf.json` to route `/pro/*` to `http://localhost:8080`
2. **Models** - Created `procurement.model.ts` with all interfaces
3. **Services** - Created three services:
   - `inventory.service.ts` - Inventory API calls
   - `procurement.service.ts` - Purchase Orders API calls
   - `gl.service.ts` - General Ledger API calls

## 📋 Next Steps - Create Components

### 1. Inventory Module
```bash
ng generate component features/inventory/inventory-list --standalone --skip-tests
ng generate component features/inventory/inventory-detail --standalone --skip-tests
```

**Features:**
- List all inventory items in AG Grid
- Search by type/brand
- View item details
- Show inventory stats

### 2. Procurement Module
```bash
ng generate component features/procurement/order-list --standalone --skip-tests
ng generate component features/procurement/order-detail --standalone --skip-tests
```

**Features:**
- List all purchase orders
- Filter by status (PENDING, APPROVED, REJECTED, COMPLETED)
- View order details
- Show procurement stats

### 3. General Ledger Module
```bash
ng generate component features/gl/gl-list --standalone --skip-tests
ng generate component features/gl/gl-detail --standalone --skip-tests
```

**Features:**
- List all GL entries
- Filter by type (ALLOCATION, PURCHASE)
- View entry details
- Show GL stats

## 🎨 UI Components to Reuse

- Use `task-grid.component` pattern for all list views
- Use same gradient buttons and styling
- Use breadcrumb component
- Follow the modern theme (indigo-purple gradient)

## 🔗 Routes to Add

```typescript
{
  path: 'inventory',
  canActivate: [authGuard],
  children: [
    { path: '', component: InventoryListComponent },
    { path: ':id', component: InventoryDetailComponent }
  ]
},
{
  path: 'procurement',
  canActivate: [authGuard],
  children: [
    { path: '', component: OrderListComponent },
    { path: ':poNumber', component: OrderDetailComponent }
  ]
},
{
  path: 'gl',
  canActivate: [authGuard],
  children: [
    { path: '', component: GLListComponent },
    { path: ':id', component: GLDetailComponent }
  ]
}
```

## 📱 Navigation Menu Updates

Add to sidebar:
```html
<div class="nav-section-title">Procurement</div>

<a mat-list-item routerLink="/inventory" routerLinkActive="active-link">
  <mat-icon matListItemIcon>inventory</mat-icon>
  <span matListItemTitle>Inventory</span>
</a>

<a mat-list-item routerLink="/procurement" routerLinkActive="active-link">
  <mat-icon matListItemIcon>shopping_cart</mat-icon>
  <span matListItemTitle>Purchase Orders</span>
</a>

<a mat-list-item routerLink="/gl" routerLinkActive="active-link">
  <mat-icon matListItemIcon>account_balance</mat-icon>
  <span matListItemTitle>General Ledger</span>
</a>
```

## 🚀 Quick Start Commands

Run these commands to generate all components at once:

```bash
# Inventory
ng g c features/inventory/inventory-list --standalone --skip-tests
ng g c features/inventory/inventory-detail --standalone --skip-tests

# Procurement  
ng g c features/procurement/order-list --standalone --skip-tests
ng g c features/procurement/order-detail --standalone --skip-tests

# GL
ng g c features/gl/gl-list --standalone --skip-tests
ng g c features/gl/gl-detail --standalone --skip-tests
```

## 📊 Dashboard Integration

Update dashboard to show procurement stats:
- Total inventory items
- Total inventory value
- Pending purchase orders
- Recent GL entries

## 🔧 Environment Configuration

The proxy is already configured. Just ensure your backend is running on `http://localhost:8080`.

Test the proxy:
```bash
curl http://localhost:4200/pro/api/inventory
```

This should proxy to:
```bash
curl http://localhost:8080/api/inventory
```

## 📝 Implementation Priority

1. **Inventory List** - Most important, shows all items
2. **Procurement List** - Shows purchase orders
3. **GL List** - Shows ledger entries
4. **Detail pages** - Can be added later
5. **Dashboard stats** - Integrate procurement metrics

## 🎯 Key Features Per Module

### Inventory
- ✅ Service created
- ⏳ List component with AG Grid
- ⏳ Search/filter by type
- ⏳ Stats cards
- ⏳ Detail view

### Procurement
- ✅ Service created
- ⏳ List component with AG Grid
- ⏳ Filter by status
- ⏳ Stats cards
- ⏳ Detail view

### GL
- ✅ Service created
- ⏳ List component with AG Grid
- ⏳ Filter by type
- ⏳ Stats cards
- ⏳ Detail view
