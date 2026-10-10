from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import CartItem, Product

cart_bp = Blueprint("cart", __name__, url_prefix="/api/cart")


@cart_bp.get("")
@jwt_required()
def get_cart():
    user_id = int(get_jwt_identity())
    items = CartItem.query.filter_by(user_id=user_id).order_by(CartItem.id).all()
    return jsonify(
        items=[
            {
                **item.product.to_dict(),
                "selectedSize": item.size,
                "quantity": item.quantity,
            }
            for item in items
        ]
    )


@cart_bp.put("")
@jwt_required()
def replace_cart():
    user_id = int(get_jwt_identity())
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict) or not isinstance(payload.get("items"), list):
        return jsonify(error="Cart items must be provided as a list"), 400
    if len(payload["items"]) > 100:
        return jsonify(error="A cart cannot contain more than 100 items"), 400

    items = []
    seen = set()
    for entry in payload["items"]:
        if not isinstance(entry, dict):
            return jsonify(error="Invalid item in cart"), 400
        product_id = entry.get("productId")
        quantity = entry.get("quantity")
        if (
            isinstance(product_id, bool)
            or not isinstance(product_id, int)
            or isinstance(quantity, bool)
            or not isinstance(quantity, int)
        ):
            return jsonify(error="Invalid item in cart"), 400

        size = entry.get("size")
        if not isinstance(size, str) or quantity < 1 or quantity > 10:
            return jsonify(error="Each item needs a valid size and quantity from 1 to 10"), 400
        key = (product_id, size)
        if key in seen:
            return jsonify(error="Duplicate product sizes are not allowed in the cart"), 400
        seen.add(key)

        product = db.session.get(Product, product_id)
        if not product:
            return jsonify(error=f"Product {product_id} not found"), 404
        if not product.in_stock:
            return jsonify(error=f"{product.name} is out of stock"), 400
        if size not in (product.sizes or "").split(","):
            return jsonify(error=f"Size {size} is not available for {product.name}"), 400
        items.append(
            CartItem(
                user_id=user_id,
                product_id=product.id,
                size=size,
                quantity=quantity,
            )
        )

    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.add_all(items)
    db.session.commit()
    return jsonify(message="Cart saved")
