import re

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError

from extensions import db
from models import NewsletterSubscriber

newsletter_bp = Blueprint("newsletter", __name__, url_prefix="/api/newsletter")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@newsletter_bp.post("")
def subscribe():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict) or not isinstance(payload.get("email"), str):
        return jsonify(error="A valid email address is required"), 400

    email = payload["email"].strip().lower()
    if len(email) > 254 or not EMAIL_RE.fullmatch(email):
        return jsonify(error="Please enter a valid email address"), 400

    if NewsletterSubscriber.query.filter_by(email=email).first():
        return jsonify(message="This email is already subscribed"), 200

    db.session.add(NewsletterSubscriber(email=email))
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        if NewsletterSubscriber.query.filter_by(email=email).first():
            return jsonify(message="This email is already subscribed"), 200
        raise

    return jsonify(message="Thanks for subscribing to ZELIA"), 201
