from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Product, WishlistItem

wishlist_bp = Blueprint("wishlist", __name__, url_prefix="/api/wishlist")


@wishlist_bp.get("")
@jwt_required()
def get_wishlist():
    user_id = int(get_jwt_identity())
    items = WishlistItem.query.filter_by(user_id=user_id).all()
    return jsonify(wishlist=[i.product.to_dict() for i in items])


@wishlist_bp.post("/<int:product_id>")
@jwt_required()
def add_to_wishlist(product_id):
    user_id = int(get_jwt_identity())
    if not db.session.get(Product, product_id):
        return jsonify(error="Product not found"), 404

    exists = WishlistItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not exists:
        db.session.add(WishlistItem(user_id=user_id, product_id=product_id))
        db.session.commit()
    return jsonify(message="Added to wishlist"), 201


@wishlist_bp.delete("/<int:product_id>")
@jwt_required()
def remove_from_wishlist(product_id):
    user_id = int(get_jwt_identity())
    item = WishlistItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if item:
        db.session.delete(item)
        db.session.commit()
    return jsonify(message="Removed from wishlist")