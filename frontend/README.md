# ZELIA storefront

## Run locally

Start the Flask API in one terminal:

```powershell
cd ..\backend
.\venv\Scripts\Activate.ps1
python app.py
```

Flask creates/updates its tables and seeds the starter products at startup. By
default, all store data is saved in `backend\instance\zelia.db`; set
`DATABASE_URL` in `backend\.env` only if you want to use a different database.
Keep real secrets and database credentials private.

To enable the store admin panel, create `backend\.env` before starting Flask.
There are no default admin credentials; without these values, no admin account
is configured:

```dotenv
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=use-a-unique-password-of-at-least-12-characters
```

Keep real credentials private and do not commit them. On startup, Flask creates
the configured admin if that email is new, or grants the admin role to the
matching existing account. When an existing customer account is first promoted,
its password is set to `ADMIN_PASSWORD`; after promotion, changing
`ADMIN_PASSWORD` alone does not reset it. The admin display name is
**Naina Sain**. Open `/admin/login` to sign in, then use `/admin` for the
protected admin dashboard. The admin API checks the database role on every
protected request; browser storage alone cannot grant access.

The current project persists data through SQLAlchemy (SQLite by default, or
another SQLAlchemy database URL via `DATABASE_URL`). Despite the original
request mentioning MongoDB, this integration deliberately uses the existing
store database so customer accounts, products, and orders remain connected.
Product images uploaded in the admin are stored under `backend\instance\uploads`.

Order checkout currently supports Cash on Delivery only. Revenue statistics
count delivered order values; they do not represent confirmed payment
settlement. Inventory is decremented at order placement and restored on a
valid cancellation. Refund processing is not available because no online
payment provider is configured.

Start the Vite app in a second terminal:

```powershell
npm install
npm run dev
```

Vite proxies `/api` requests to `http://127.0.0.1:5000` during development, so
keep both terminals running. Set `VITE_BACKEND_URL` in `frontend\.env` if Flask
is running at a different development address. The frontend uses the backend API and database for
products, registration/login, wishlists, signed-in carts, saved addresses,
newsletter subscriptions, and orders. Guest carts are kept in the browser and
merged into the account cart after sign-in.

For a separately hosted API, set `VITE_API_URL` to its origin (for example,
`https://api.example.com`) in the frontend environment, and set `FRONTEND_URL`
for Flask CORS to the deployed storefront origin.
