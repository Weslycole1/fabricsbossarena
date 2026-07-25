# Admin Dashboard

A production-ready admin dashboard for managing the product catalog, built on
top of the existing Supabase project — no new backend, no service role key
exposed to the client.

## One-time setup

1. **Run the SQL migration.** Open your Supabase project → SQL Editor → New
   query → paste the contents of `supabase/admin_setup.sql` → Run. This:
   - Adds `profiles.is_admin`
   - Creates a `categories` table (seeded from existing product categories)
   - Adds `stock`, `featured`, `is_available`, `created_at` to `products`
   - Enables Row Level Security with public read / admin-only write policies
   - Creates a public-read, admin-write `product-images` storage bucket

2. **Create your admin account.** Sign up normally on the storefront
   (`/signup`), or reuse an existing account. Then, back in the SQL editor:

   ```sql
   update public.profiles set is_admin = true where email = 'you@example.com';
   ```

3. **Sign in to the dashboard** at `/admin/login` with that account.

## Routes

| Route | Description |
|---|---|
| `/admin/login` | Admin sign-in (non-admin accounts are rejected) |
| `/admin` | Dashboard: totals, recent products, quick actions |
| `/admin/products` | Product table: search, edit, delete |
| `/admin/products/new` | Create a product |
| `/admin/products/edit/:id` | Edit a product |

## How authorization works

- The client still uses the same `supabase` instance and anon key as the rest
  of the app — **no service role key is ever used or shipped to the browser.**
- `AdminAuthProvider` (`src/admin/context/AdminAuthContext.tsx`) checks the
  signed-in user's session, then reads `profiles.is_admin` for that user.
- `AdminRoute` redirects anyone who isn't signed in, or isn't an admin, to
  `/admin/login`.
- Real enforcement lives in Postgres Row Level Security, not just the UI: the
  `is_admin_user()` SQL function gates all writes to `products`, `categories`,
  and the `product-images` storage bucket. Even if someone bypassed the React
  app entirely, non-admin writes are rejected by the database.

## Where things live

```
src/admin/
  api/adminProducts.ts       # all Supabase calls: CRUD, categories, image upload
  context/AdminAuthContext.tsx
  components/AdminRoute.tsx  # auth guard
  components/AdminLayout.tsx # sidebar + topbar shell
  components/ConfirmDialog.tsx
  pages/AdminLogin.tsx
  pages/AdminDashboard.tsx
  pages/AdminProductsList.tsx
  pages/AdminProductForm.tsx # shared create/edit form
supabase/admin_setup.sql     # one-time DB migration
```

No existing files were changed except `src/App.tsx` (new routes added) and
`src/types/product.ts` (new `AdminProduct`/`Category` types added alongside
the existing `Product`/`DbProduct` types — nothing removed or renamed).

## Notes & assumptions

- The storefront's `category` field is a plain text column (not a foreign
  key), so the admin form keeps that: pick an existing category or type a new
  one, which is upserted into the `categories` table for future reuse.
- `tag` (`exclusive` / `luxury` / `trending` / `budget`) already drives the
  storefront's filter badges, so it's kept as a required field on the form to
  avoid breaking existing inserts.
- Image uploads go straight to the `product-images` bucket and store the
  public URL in `products.img_url`, matching the existing `mapProduct.ts`
  fallback logic (`img_url ?? img`).
