from datetime import date, datetime, time, timezone
from functools import wraps
import os
import uuid

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename

from extensions import db
from models import (
    CartItem,
    Category,
    Order,
    OrderItem,
    Product,
    ShippingAddress,
    User,
    WishlistItem,
)

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")
VALID_GENDERS = {"men", "women"}
VALID_ORDER_STATUSES = {
    "placed",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
}
VALID_SIZES = {"S", "M", "L", "XL"}
ORDER_TRANSITIONS = {
    "placed": {"confirmed", "processing", "cancelled"},
    "confirmed": {"processing", "cancelled"},
    "processing": {"shipped", "cancelled"},
    "shipped": {"delivered"},
    "delivered": {"returned"},
    "cancelled": set(),
    "returned": set(),
}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def admin_required(function):
    @wraps(function)
    def decorated(*args, **kwargs):
        try:
            user_id = int(get_jwt_identity())
        except (TypeError, ValueError):
            return jsonify(error="Admin access required"), 403
        user = db.session.get(User, user_id)
        if not user or user.role != "admin" or user.account_status != "active":
            return jsonify(error="Admin access required"), 403
        return function(*args, **kwargs)

    return decorated


def parse_product(data):
    name = str(data.get("name") or "").strip()
    category = str(data.get("category") or "").strip().lower()
    gender = str(data.get("gender") or "").strip().lower()
    image = str(data.get("image") or "").strip()
    color = str(data.get("color") or "").strip()
    description = str(data.get("description") or "").strip()
    status = str(data.get("status") or "active").strip().lower()
    price_value = data.get("price")
    old_price_value = data.get("oldPrice")
    stock_value = data.get(
        "stockQuantity", 1 if data.get("inStock", True) else 0
    )

    def is_integer(value):
        return (
            not isinstance(value, bool)
            and (
                isinstance(value, int)
                or (isinstance(value, str) and value.isdigit())
            )
        )

    if not is_integer(price_value) or (
        old_price_value not in (None, "") and not is_integer(old_price_value)
    ) or not is_integer(stock_value):
        return None, "Price and stock quantity must be whole numbers"
    price = int(price_value)
    old_price = int(old_price_value) if old_price_value not in (None, "") else None
    stock_quantity = int(stock_value)

    sizes = data.get("sizes", ["S", "M", "L", "XL"])
    if isinstance(sizes, str):
        sizes = sizes.split(",")
    if not isinstance(sizes, list):
        return None, "Sizes must be a list"
    sizes = [str(size).strip().upper() for size in sizes if str(size).strip()]
    if not name or not category or gender not in VALID_GENDERS:
        return None, "Name, category and a valid gender are required"
    if status not in {"active", "inactive"}:
        return None, "Status must be active or inactive"
    if len(name) > 150 or len(category) > 50 or len(image) > 500:
        return None, "One or more product fields exceed the maximum length"
    if len(color) > 30 or len(description) > 1000:
        return None, "One or more product fields exceed the maximum length"
    if price < 1 or price > 2147483647 or (
        old_price is not None and (old_price < 1 or old_price > 2147483647)
    ):
        return None, "Prices must be greater than zero"
    if stock_quantity < 0 or stock_quantity > 2147483647:
        return None, "Stock quantity must be zero or greater"
    if not sizes or any(size not in VALID_SIZES for size in sizes):
        return None, "Choose one or more valid sizes: S, M, L, XL"
    for field in ("featured", "bestseller"):
        if field in data and not isinstance(data[field], bool):
            return None, f"{field.capitalize()} must be true or false"

    return {
        "name": name,
        "category": category,
        "gender": gender,
        "image": image or None,
        "color": color or None,
        "price": price,
        "old_price": old_price,
        "sizes": ",".join(dict.fromkeys(sizes)),
        "in_stock": stock_quantity > 0,
        "description": description,
        "stock_quantity": stock_quantity,
        "status": status,
        "is_featured": data.get("featured", False),
        "is_bestseller": data.get("bestseller", False),
    }, None


def _find_customer(user_id):
    customer = db.session.get(User, user_id)
    if not customer or customer.role != "customer":
        return None
    return customer


def _sync_categories():
    for gender, name in (
        db.session.query(Product.gender, Product.category)
        .filter(Product.gender.isnot(None), Product.category.isnot(None))
        .distinct()
        .all()
    ):
        if not Category.query.filter_by(gender=gender, name=name).first():
            db.session.add(Category(gender=gender, name=name))
    db.session.commit()


@admin_bp.post("/login")
def admin_login():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify(error="Email and password are required"), 400
    email = str(payload.get("email") or "").strip().lower()
    password = payload.get("password")
    if not email or not isinstance(password, str):
        return jsonify(error="Email and password are required"), 400
    user = User.query.filter_by(email=email).first()
    if (
        not user
        or user.role != "admin"
        or user.account_status != "active"
        or not user.check_password(password)
    ):
        return jsonify(error="Invalid administrator credentials"), 401
    return jsonify(
        token=create_access_token(identity=str(user.id)),
        user=user.to_dict(),
    )


@admin_bp.get("/dashboard")
@jwt_required()
@admin_required
def dashboard():
    customers = User.query.filter_by(role="customer").count()
    delivered_orders = Order.query.filter_by(status="delivered").all()
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(8).all()
    recent_customers = (
        User.query.filter_by(role="customer")
        .order_by(User.created_at.desc())
        .limit(8)
        .all()
    )
    return jsonify(
        stats={
            "totalProducts": Product.query.count(),
            "totalCustomers": customers,
            "totalOrders": Order.query.count(),
            "pendingOrders": Order.query.filter(
                Order.status.in_(["placed", "confirmed", "processing"])
            ).count(),
            "completedOrders": Order.query.filter_by(status="delivered").count(),
            "revenue": sum(order.total for order in delivered_orders),
            "lowStockProducts": Product.query.filter(
                Product.stock_quantity <= 5,
                Product.status == "active",
            ).count(),
        },
        recentOrders=[
            _order_with_customer(order) for order in recent_orders
        ],
        recentCustomers=[_customer_summary(customer) for customer in recent_customers],
    )


@admin_bp.get("/products")
@jwt_required()
@admin_required
def list_products():
    query = Product.query
    search = (request.args.get("q") or "").strip()
    gender = (request.args.get("gender") or "").strip().lower()
    category = (request.args.get("category") or "").strip().lower()
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            Product.name.ilike(pattern) | Product.category.ilike(pattern)
        )
    if gender in VALID_GENDERS:
        query = query.filter_by(gender=gender)
    if category:
        query = query.filter_by(category=category)
    return jsonify(products=[
        product.to_dict() for product in query.order_by(Product.id.desc()).all()
    ])


@admin_bp.post("/products")
@jwt_required()
@admin_required
def create_product():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify(error="A product object is required"), 400
    data, error = parse_product(payload)
    if error:
        return jsonify(error=error), 400
    product = Product(**data)
    db.session.add(product)
    db.session.flush()
    category = Category.query.filter_by(
        name=product.category, gender=product.gender
    ).first()
    if not category:
        db.session.add(Category(name=product.category, gender=product.gender))
    db.session.commit()
    return jsonify(product=product.to_dict()), 201


@admin_bp.put("/products/<int:product_id>")
@jwt_required()
@admin_required
def update_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify(error="Product not found"), 404
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify(error="A product object is required"), 400
    data, error = parse_product(payload)
    if error:
        return jsonify(error=error), 400
    for key, value in data.items():
        setattr(product, key, value)
    category = Category.query.filter_by(
        name=product.category, gender=product.gender
    ).first()
    if not category:
        db.session.add(Category(name=product.category, gender=product.gender))
    for cart_item in CartItem.query.filter_by(product_id=product_id).all():
        if cart_item.size not in product.sizes.split(",") or product.stock_quantity == 0:
            db.session.delete(cart_item)
    db.session.commit()
    return jsonify(product=product.to_dict())


@admin_bp.delete("/products/<int:product_id>")
@jwt_required()
@admin_required
def delete_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify(error="Product not found"), 404
    has_order_history = OrderItem.query.filter_by(product_id=product_id).first()
    WishlistItem.query.filter_by(product_id=product_id).delete()
    CartItem.query.filter_by(product_id=product_id).delete()
    if has_order_history:
        product.status = "inactive"
        product.stock_quantity = 0
        product.in_stock = False
        db.session.commit()
        return jsonify(
            message="Product removed from the storefront; existing order history was kept",
            archived=True,
            product=product.to_dict(),
        )
    db.session.delete(product)
    db.session.commit()
    return jsonify(message="Product deleted", archived=False)


@admin_bp.get("/categories")
@jwt_required()
@admin_required
def list_categories():
    _sync_categories()
    categories = Category.query.order_by(Category.gender, Category.name).all()
    return jsonify(categories=[
        {
            **category.to_dict(),
            "productCount": Product.query.filter_by(
                gender=category.gender, category=category.name
            ).count(),
        }
        for category in categories
    ])


@admin_bp.post("/categories")
@jwt_required()
@admin_required
def create_category():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify(error="Category details are required"), 400
    name = str(payload.get("name") or "").strip().lower()
    gender = str(payload.get("gender") or "").strip().lower()
    if not name or len(name) > 50 or gender not in VALID_GENDERS:
        return jsonify(error="A category name and valid collection are required"), 400
    if Category.query.filter_by(name=name, gender=gender).first():
        return jsonify(error="This category already exists"), 409
    category = Category(name=name, gender=gender)
    db.session.add(category)
    db.session.commit()
    return jsonify(category=category.to_dict(), productCount=0), 201


@admin_bp.put("/categories/<int:category_id>")
@jwt_required()
@admin_required
def update_category(category_id):
    category = db.session.get(Category, category_id)
    if not category:
        return jsonify(error="Category not found"), 404
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify(error="Category details are required"), 400
    name = str(payload.get("name") or "").strip().lower()
    gender = str(payload.get("gender") or "").strip().lower()
    if not name or len(name) > 50 or gender not in VALID_GENDERS:
        return jsonify(error="A category name and valid collection are required"), 400
    duplicate = Category.query.filter(
        Category.id != category_id,
        Category.name == name,
        Category.gender == gender,
    ).first()
    if duplicate:
        return jsonify(error="This category already exists"), 409
    Product.query.filter_by(
        category=category.name, gender=category.gender
    ).update({"category": name, "gender": gender})
    category.name = name
    category.gender = gender
    db.session.commit()
    return jsonify(category=category.to_dict())


@admin_bp.delete("/categories/<int:category_id>")
@jwt_required()
@admin_required
def delete_category(category_id):
    category = db.session.get(Category, category_id)
    if not category:
        return jsonify(error="Category not found"), 404
    if Product.query.filter_by(
        category=category.name, gender=category.gender
    ).first():
        return jsonify(error="Reassign or remove this category's products first"), 409
    db.session.delete(category)
    db.session.commit()
    return jsonify(message="Category deleted")


@admin_bp.get("/customers")
@jwt_required()
@admin_required
def list_customers():
    query = User.query.filter_by(role="customer")
    search = (request.args.get("q") or "").strip()
    status = (request.args.get("status") or "").strip().lower()
    if search:
        pattern = f"%{search}%"
        query = query.filter(User.name.ilike(pattern) | User.email.ilike(pattern))
    if status in {"active", "inactive"}:
        query = query.filter_by(account_status=status)
    customers = query.order_by(User.created_at.desc()).all()
    return jsonify(customers=[_customer_summary(customer) for customer in customers])


@admin_bp.get("/customers/<int:customer_id>")
@jwt_required()
@admin_required
def customer_details(customer_id):
    customer = _find_customer(customer_id)
    if not customer:
        return jsonify(error="Customer not found"), 404
    data = _customer_summary(customer)
    data["savedAddresses"] = [
        address.to_dict() for address in customer.shipping_addresses
    ]
    data["orderHistory"] = [
        order.to_dict()
        for order in Order.query.filter_by(user_id=customer.id)
        .order_by(Order.created_at.desc())
        .all()
    ]
    return jsonify(customer=data)


@admin_bp.patch("/customers/<int:customer_id>")
@jwt_required()
@admin_required
def update_customer_status(customer_id):
    customer = _find_customer(customer_id)
    if not customer:
        return jsonify(error="Customer not found"), 404
    payload = request.get_json(silent=True)
    status = payload.get("status") if isinstance(payload, dict) else None
    if not isinstance(status, str) or status not in {"active", "inactive"}:
        return jsonify(error="Status must be active or inactive"), 400
    customer.account_status = status
    db.session.commit()
    return jsonify(customer=_customer_summary(customer))


@admin_bp.get("/orders")
@jwt_required()
@admin_required
def list_orders():
    query = Order.query
    status = (request.args.get("status") or "").strip().lower()
    search = (request.args.get("q") or "").strip()
    from_date = request.args.get("from")
    to_date = request.args.get("to")
    if status in VALID_ORDER_STATUSES:
        query = query.filter_by(status=status)
    if search:
        pattern = f"%{search}%"
        query = query.join(User, Order.user_id == User.id).filter(
            User.name.ilike(pattern)
            | User.email.ilike(pattern)
            | Order.email.ilike(pattern)
        )
    try:
        if from_date:
            query = query.filter(
                Order.created_at >= datetime.combine(
                    date.fromisoformat(from_date), time.min, tzinfo=timezone.utc
                )
            )
        if to_date:
            query = query.filter(
                Order.created_at <= datetime.combine(
                    date.fromisoformat(to_date), time.max, tzinfo=timezone.utc
                )
            )
    except ValueError:
        return jsonify(error="Dates must use YYYY-MM-DD format"), 400
    orders = query.order_by(Order.created_at.desc()).all()
    return jsonify(orders=[_order_with_customer(order) for order in orders])


@admin_bp.patch("/orders/<int:order_id>")
@jwt_required()
@admin_required
def update_order_status(order_id):
    order = db.session.get(Order, order_id)
    if not order:
        return jsonify(error="Order not found"), 404
    payload = request.get_json(silent=True)
    status = payload.get("status") if isinstance(payload, dict) else None
    if not isinstance(status, str) or status not in VALID_ORDER_STATUSES:
        return jsonify(error="Invalid order status"), 400
    if status == order.status:
        return jsonify(order=_order_with_customer(order))
    if status not in ORDER_TRANSITIONS.get(order.status, set()):
        return jsonify(error=f"Cannot change an order from {order.status} to {status}"), 409
    if status == "cancelled" and order.stock_deducted and not order.stock_restored:
        for item in order.items:
            product = db.session.get(Product, item.product_id)
            if product:
                product.stock_quantity += item.quantity
                product.in_stock = product.stock_quantity > 0
        order.stock_restored = True
    order.status = status
    db.session.commit()
    return jsonify(order=_order_with_customer(order))


@admin_bp.post("/uploads")
@jwt_required()
@admin_required
def upload_product_image():
    image = request.files.get("image")
    if not image or not image.filename:
        return jsonify(error="Choose an image to upload"), 400
    extension = os.path.splitext(secure_filename(image.filename))[1].lower()
    if extension not in IMAGE_EXTENSIONS:
        return jsonify(error="Use a JPG, PNG or WebP image"), 400
    if image.mimetype not in {"image/jpeg", "image/png", "image/webp"}:
        return jsonify(error="Unsupported image content type"), 400
    filename = f"{uuid.uuid4().hex}{extension}"
    image.save(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))
    return jsonify(image=f"{request.url_root.rstrip('/')}/uploads/{filename}"), 201


def _customer_summary(customer):
    orders = Order.query.filter_by(user_id=customer.id).all()
    completed_spend = sum(
        order.total for order in orders if order.status not in {"cancelled", "returned"}
    )
    addresses = customer.shipping_addresses
    return {
        "id": customer.id,
        "name": customer.name,
        "email": customer.email,
        "phone": addresses[0].phone if addresses else None,
        "createdAt": customer.created_at.isoformat() if customer.created_at else None,
        "accountStatus": customer.account_status,
        "orders": len(orders),
        "totalSpent": completed_spend,
        "lastOrder": max(
            (order.created_at.isoformat() for order in orders if order.created_at),
            default=None,
        ),
    }


def _order_with_customer(order):
    data = order.to_dict()
    data["customer"] = {
        "id": order.user.id,
        "name": order.user.name,
        "email": order.user.email,
    }
    return data
