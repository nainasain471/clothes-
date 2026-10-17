import re

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError

from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Name, email and password are required"), 400
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    name = name.strip() if isinstance(name, str) else ""
    email = email.strip().lower() if isinstance(email, str) else ""

    if not name or not email or not password:
        return jsonify(error="Name, email and password are required"), 400
    if not isinstance(password, str):
        return jsonify(error="Password must be a string"), 400
    if not EMAIL_RE.match(email):
        return jsonify(error="Please enter a valid email"), 400
    if len(name) > 100 or len(email) > 120:
        return jsonify(error="Name or email exceeds the maximum length"), 400
    if len(password) < 6:
        return jsonify(error="Password must be at least 6 characters"), 400
    if User.query.filter_by(email=email).first():
        return jsonify(error="An account with this email already exists"), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        if User.query.filter_by(email=email).first():
            return jsonify(error="An account with this email already exists"), 409
        raise

    token = create_access_token(identity=str(user.id))
    return jsonify(token=token, user=user.to_dict()), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if (
        not user
        or user.account_status != "active"
        or not user.check_password(password)
    ):
        return jsonify(error="Invalid email or password"), 401

    token = create_access_token(identity=str(user.id))
    return jsonify(token=token, user=user.to_dict())


@auth_bp.get("/me")
@jwt_required()
def me():
    user = db.session.get(User, int(get_jwt_identity()))
    if not user:
        return jsonify(error="User not found"), 404
    return jsonify(user=user.to_dict())