import os
import re
from flask import Flask, jsonify, send_from_directory
from sqlalchemy import inspect, text

from config import Config
from extensions import db, jwt, cors
from models import User


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024
    app.config["UPLOAD_FOLDER"] = os.path.join(app.instance_path, "uploads")

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": [app.config["FRONTEND_URL"]]}})

    from routes.auth import auth_bp
    from routes.addresses import addresses_bp
    from routes.cart import cart_bp
    from routes.newsletter import newsletter_bp
    from routes.products import products_bp
    from routes.wishlist import wishlist_bp
    from routes.orders import orders_bp
    from routes.admin import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(addresses_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(newsletter_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(wishlist_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(admin_bp)

    @app.get("/api/health")
    def health():
        return jsonify(status="ok")

    # JWT errors ko clean JSON me return karo
    @jwt.unauthorized_loader
    def missing_token(reason):
        return jsonify(error="Please sign in first"), 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify(error="Invalid session, please sign in again"), 401

    @jwt.expired_token_loader
    def expired_token(header, payload):
        return jsonify(error="Session expired, please sign in again"), 401

    @jwt.token_in_blocklist_loader
    def inactive_account(header, payload):
        identity = payload.get("sub")
        try:
            user = db.session.get(User, int(identity))
        except (TypeError, ValueError):
            return True
        return not user or user.account_status != "active"

    @app.get("/uploads/<path:filename>")
    def uploaded_image(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # Tables + seed data (pehli baar run pe)
    with app.app_context():
        import models  # noqa: F401
        from seed import seed_products

        db.create_all()
        migrations = {
            "users": {
                "role": "VARCHAR(20) NOT NULL DEFAULT 'customer'",
                "account_status": "VARCHAR(20) NOT NULL DEFAULT 'active'",
            },
            "products": {
                "description": "VARCHAR(1000) NOT NULL DEFAULT ''",
                "stock_quantity": "INTEGER NOT NULL DEFAULT 0",
                "status": "VARCHAR(20) NOT NULL DEFAULT 'active'",
                "is_featured": "BOOLEAN NOT NULL DEFAULT FALSE",
                "is_bestseller": "BOOLEAN NOT NULL DEFAULT FALSE",
            },
            "orders": {
                "stock_deducted": "BOOLEAN NOT NULL DEFAULT FALSE",
                "stock_restored": "BOOLEAN NOT NULL DEFAULT FALSE",
            },
        }
        stock_quantity_was_added = False
        for table, columns in migrations.items():
            existing = {
                column["name"] for column in inspect(db.engine).get_columns(table)
            }
            for column, definition in columns.items():
                if column not in existing:
                    if table == "products" and column == "stock_quantity":
                        stock_quantity_was_added = True
                    db.session.execute(
                        text(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
                    )
        if stock_quantity_was_added:
            db.session.execute(
                text(
                    "UPDATE products SET stock_quantity = "
                    "CASE WHEN in_stock THEN 1 ELSE 0 END "
                    "WHERE stock_quantity = 0 AND in_stock = TRUE"
                )
            )
        db.session.commit()
        seed_products()
        admin_email = app.config["ADMIN_EMAIL"]
        admin_password = app.config["ADMIN_PASSWORD"]
        if bool(admin_email) != bool(admin_password):
            raise RuntimeError("Set both ADMIN_EMAIL and ADMIN_PASSWORD to configure an admin")
        if admin_email:
            if len(admin_password) < 8:
                raise RuntimeError("ADMIN_PASSWORD must be at least 8 characters")
            admin_email = admin_email.strip().lower()
            if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", admin_email):
                raise RuntimeError("ADMIN_EMAIL must be a valid email address")
            admin = User.query.filter_by(email=admin_email).first()
            if admin is None:
                admin = User(name="Naina Sain", email=admin_email, role="admin")
                admin.set_password(admin_password)
                db.session.add(admin)
                db.session.commit()
            elif admin.role != "admin":
                admin.role = "admin"
                admin.name = "Naina Sain"
                admin.set_password(admin_password)
                db.session.commit()
            elif admin.name != "Naina Sain":
                admin.name = "Naina Sain"
                db.session.commit()
        os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)