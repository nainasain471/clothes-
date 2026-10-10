from flask import Blueprint, request, jsonify

from extensions import db
from models import Product

products_bp = Blueprint("products", __name__, url_prefix="/api/products")


@products_bp.get("")
def list_products():
    """
    Optional query params:
      ?gender=men|women   ?category=jeans   ?q=denim   ?min_price=1000   ?max_price=3000
    """
    query = Product.query.filter_by(status="active")

    gender = request.args.get("gender")
    category = request.args.get("category")
    q = (request.args.get("q") or "").strip()
    min_price = request.args.get("min_price", type=int)
    max_price = request.args.get("max_price", type=int)

    if gender:
        query = query.filter(Product.gender == gender)
    if category:
        query = query.filter(Product.category == category)
    if q:
        like = f"%{q}%"
        query = query.filter(
            Product.name.ilike(like) | Product.category.ilike(like)
        )
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    products = query.order_by(Product.id).all()
    return jsonify(products=[p.to_dict() for p in products])


@products_bp.get("/<int:product_id>")
def get_product(product_id):
    product = db.session.get(Product, product_id)
    if not product or product.status != "active":
        return jsonify(error="Product not found"), 404
    return jsonify(product=product.to_dict())