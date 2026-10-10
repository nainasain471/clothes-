from datetime import datetime, timezone

from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db


def utcnow():
    return datetime.now(timezone.utc)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="customer")
    account_status = db.Column(db.String(20), nullable=False, default="active")
    created_at = db.Column(db.DateTime, default=utcnow)

    orders = db.relationship("Order", backref="user", lazy=True)
    wishlist_items = db.relationship(
        "WishlistItem", backref="user", lazy=True, cascade="all, delete-orphan"
    )
    cart_items = db.relationship(
        "CartItem", backref="user", lazy=True, cascade="all, delete-orphan"
    )
    shipping_addresses = db.relationship(
        "ShippingAddress", backref="user", lazy=True, cascade="all, delete-orphan"
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    price = db.Column(db.Integer, nullable=False)          # rupees me
    old_price = db.Column(db.Integer)
    image = db.Column(db.String(500))
    category = db.Column(db.String(50), index=True)
    gender = db.Column(db.String(20), index=True)
    color = db.Column(db.String(30))
    sizes = db.Column(db.String(50), default="S,M,L,XL")   # comma separated
    in_stock = db.Column(db.Boolean, default=True)
    description = db.Column(db.String(1000), default="")
    stock_quantity = db.Column(db.Integer, nullable=False, default=1)
    status = db.Column(db.String(20), nullable=False, default="active")
    is_featured = db.Column(db.Boolean, nullable=False, default=False)
    is_bestseller = db.Column(db.Boolean, nullable=False, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "oldPrice": self.old_price,
            "image": self.image,
            "category": self.category,
            "gender": self.gender,
            "color": self.color,
            "sizes": self.sizes.split(",") if self.sizes else [],
            "inStock": self.stock_quantity > 0,
            "description": self.description or "",
            "stockQuantity": self.stock_quantity,
            "status": self.status,
            "featured": self.is_featured,
            "bestseller": self.is_bestseller,
        }


class Category(db.Model):
    __tablename__ = "categories"
    __table_args__ = (db.UniqueConstraint("name", "gender"),)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "gender": self.gender}


class WishlistItem(db.Model):
    __tablename__ = "wishlist_items"
    __table_args__ = (db.UniqueConstraint("user_id", "product_id"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)

    product = db.relationship("Product")


class CartItem(db.Model):
    __tablename__ = "cart_items"
    __table_args__ = (db.UniqueConstraint("user_id", "product_id", "size"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    size = db.Column(db.String(10), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    product = db.relationship("Product")


class ShippingAddress(db.Model):
    __tablename__ = "shipping_addresses"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    first_name = db.Column(db.String(60), nullable=False)
    last_name = db.Column(db.String(60), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(60), nullable=False)
    state = db.Column(db.String(60), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "pincode": self.pincode,
        }


class NewsletterSubscriber(db.Model):
    __tablename__ = "newsletter_subscribers"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(254), nullable=False, unique=True, index=True)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    first_name = db.Column(db.String(60), nullable=False)
    last_name = db.Column(db.String(60), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(60), nullable=False)
    state = db.Column(db.String(60), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)

    payment_method = db.Column(db.String(30), default="COD")
    status = db.Column(db.String(30), default="placed")
    stock_deducted = db.Column(db.Boolean, nullable=False, default=False)
    stock_restored = db.Column(db.Boolean, nullable=False, default=False)
    subtotal = db.Column(db.Integer, nullable=False)
    shipping = db.Column(db.Integer, default=0)
    total = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=utcnow)

    items = db.relationship(
        "OrderItem", backref="order", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
            "paymentMethod": self.payment_method,
            "paymentStatus": "not-tracked",
            "subtotal": self.subtotal,
            "shipping": self.shipping,
            "total": self.total,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "shippingAddress": {
                "firstName": self.first_name,
                "lastName": self.last_name,
                "email": self.email,
                "phone": self.phone,
                "address": self.address,
                "city": self.city,
                "state": self.state,
                "pincode": self.pincode,
            },
            "items": [item.to_dict() for item in self.items],
        }


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)

    # Order ke time ka naam/price save hota hai, taaki baad me product badle to purana order na bigde
    name = db.Column(db.String(150), nullable=False)
    image = db.Column(db.String(255))
    price = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(10))
    quantity = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "productId": self.product_id,
            "name": self.name,
            "image": self.image,
            "price": self.price,
            "size": self.size,
            "quantity": self.quantity,
        }