from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import CartItem, Order, OrderItem, Product, ShippingAddress

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

REQUIRED_FIELDS = ["firstName", "lastName", "email", "phone", "address", "city", "state", "pincode"]
VALID_SIZES = {"S", "M", "L", "XL"}


@orders_bp.post("")
@jwt_required()
def place_order():
    """
    Body:
    {
      "shipping": {firstName, lastName, email, phone, address, city, state, pincode},
      "items": [{"productId": 1, "size": "M", "quantity": 2}]
    }
    Price hamesha DB se lete hain (frontend ka price trust nahi karte).
    """
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Order details are required"), 400
    shipping = data.get("shipping")
    items = data.get("items")
    save_address = data.get("saveAddress", False)

    if not isinstance(shipping, dict) or not isinstance(items, list):
        return jsonify(error="Shipping information and order items are required"), 400
    if not isinstance(save_address, bool):
        return jsonify(error="saveAddress must be true or false"), 400

    shipping = {
        field: shipping[field].strip()
        for field in REQUIRED_FIELDS
        if isinstance(shipping.get(field), str)
    }
    missing = [field for field in REQUIRED_FIELDS if not shipping.get(field)]
    if missing:
        return jsonify(error=f"Missing fields: {', '.join(missing)}"), 400
    field_limits = {
        "firstName": 60,
        "lastName": 60,
        "email": 120,
        "phone": 20,
        "address": 255,
        "city": 60,
        "state": 60,
        "pincode": 10,
    }
    if any(len(shipping[field]) > limit for field, limit in field_limits.items()):
        return jsonify(error="One or more shipping fields exceed the maximum length"), 400
    if not items:
        return jsonify(error="Cart is empty"), 400

    pincode = str(shipping["pincode"]).strip()
    if not (pincode.isdigit() and len(pincode) == 6):
        return jsonify(error="PIN code must be 6 digits"), 400

    order_items = []
    subtotal = 0
    seen_items = set()
    stock_reservations = {}
    for entry in items:
        if not isinstance(entry, dict):
            return jsonify(error="Invalid item in cart"), 400
        product_id = entry.get("productId")
        quantity = entry.get("quantity", 1)
        if (
            isinstance(product_id, bool)
            or not isinstance(product_id, int)
            or isinstance(quantity, bool)
            or not isinstance(quantity, int)
        ):
            return jsonify(error="Invalid item in cart"), 400

        size = entry.get("size")
        if quantity < 1 or quantity > 10:
            return jsonify(error="Quantity must be between 1 and 10"), 400
        if not isinstance(size, str) or size not in VALID_SIZES:
            return jsonify(error="Please select a valid size for every item"), 400
        item_key = (product_id, size)
        if item_key in seen_items:
            return jsonify(error="Duplicate product sizes are not allowed in an order"), 400
        seen_items.add(item_key)

        product = db.session.get(Product, product_id)
        if not product or product.status != "active":
            return jsonify(error=f"Product {product_id} not found"), 404
        already_reserved = stock_reservations.get(product_id, 0)
        if product.stock_quantity - already_reserved < quantity:
            return jsonify(error=f"Not enough stock for {product.name}"), 400
        if not product.in_stock:
            return jsonify(error=f"{product.name} is out of stock"), 400
        if size not in (product.sizes or "").split(","):
            return jsonify(error=f"Size {size} is not available for {product.name}"), 400

        subtotal += product.price * quantity
        order_items.append(
            OrderItem(
                product_id=product.id,
                name=product.name,
                image=product.image,
                price=product.price,
                size=size,
                quantity=quantity,
            )
        )
        stock_reservations[product_id] = already_reserved + quantity

    for product_id, quantity in stock_reservations.items():
        product = db.session.get(Product, product_id)
        product.stock_quantity -= quantity
        product.in_stock = product.stock_quantity > 0

    shipping_cost = 0  # frontend pe "FREE" dikha rakha hai
    order = Order(
        user_id=user_id,
        first_name=shipping["firstName"],
        last_name=shipping["lastName"],
        email=shipping["email"].lower(),
        phone=shipping["phone"],
        address=shipping["address"],
        city=shipping["city"],
        state=shipping["state"],
        pincode=pincode,
        payment_method="COD",
        subtotal=subtotal,
        shipping=shipping_cost,
        total=subtotal + shipping_cost,
        stock_deducted=True,
        items=order_items,
    )
    db.session.add(order)
    if save_address:
        address_fields = {
            "first_name": order.first_name,
            "last_name": order.last_name,
            "email": order.email,
            "phone": order.phone,
            "address": order.address,
            "city": order.city,
            "state": order.state,
            "pincode": order.pincode,
        }
        existing_address = ShippingAddress.query.filter_by(
            user_id=user_id, **address_fields
        ).first()
        if not existing_address:
            db.session.add(ShippingAddress(user_id=user_id, **address_fields))
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify(order=order.to_dict()), 201


@orders_bp.get("")
@jwt_required()
def my_orders():
    user_id = int(get_jwt_identity())
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify(orders=[o.to_dict() for o in orders])


@orders_bp.get("/<int:order_id>")
@jwt_required()
def get_order(order_id):
    user_id = int(get_jwt_identity())
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify(error="Order not found"), 404
    return jsonify(order=order.to_dict())