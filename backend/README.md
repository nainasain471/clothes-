# Backend database

The Flask app uses SQLAlchemy and creates its tables when the app starts. By
default, SQLite stores the database in `backend/instance/zelia.db`. Set
`DATABASE_URL` to use a different SQLAlchemy database URL, including a hosted
database in production.

The database stores:

- Customer accounts (passwords are stored as hashes), products and wishlists
- Signed-in customers' carts and saved shipping addresses
- Orders, shipping details for each order, and order-item snapshots
- Newsletter subscribers who explicitly submit the signup form

Guest carts stay in the customer's browser until they sign in. On sign-in, the
guest cart is merged into their saved account cart. Payment card details are
not collected or stored; checkout currently supports Cash on Delivery.

Back up the SQLite database file before replacing or moving it. For production,
configure a strong `SECRET_KEY` and `JWT_SECRET_KEY` and use a managed database
with routine backups.
