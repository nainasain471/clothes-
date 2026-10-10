from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import ShippingAddress

addresses_bp = Blueprint("addresses", __name__, url_prefix="/api/addresses")


@addresses_bp.get("")
@jwt_required()
def list_addresses():
    user_id = int(get_jwt_identity())
    addresses = (
        ShippingAddress.query.filter_by(user_id=user_id)
        .order_by(ShippingAddress.id.desc())
        .all()
    )
    return jsonify(addresses=[address.to_dict() for address in addresses])


@addresses_bp.delete("/<int:address_id>")
@jwt_required()
def delete_address(address_id):
    user_id = int(get_jwt_identity())
    address = ShippingAddress.query.filter_by(id=address_id, user_id=user_id).first()
    if not address:
        return jsonify(error="Address not found"), 404
    db.session.delete(address)
    db.session.commit()
    return jsonify(message="Address deleted")
