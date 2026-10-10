"""Frontend ke products.js wale 10 products database me daalta hai."""
from extensions import db
from models import Product

PRODUCTS = [
    (1, "Essential Cotton T-Shirt", 1499, 1999, "t-shirts", "men"),
    (2, "Relaxed Fit Shirt", 2499, 2999, "shirts", "men"),
    (3, "Classic Denim Jeans", 2999, 3499, "jeans", "men"),
    (4, "Everyday Hoodie", 2799, 3299, "hoodies", "men"),
    (5, "Flowy Midi Dress", 2999, 3999, "dresses", "women"),
    (6, "Relaxed Everyday Top", 1799, 2299, "tops", "women"),
    (7, "Contemporary Kurta", 2299, 2799, "kurtas", "women"),
    (8, "Wide Leg Trousers", 2499, 2999, "trousers", "women"),
    (9, "Minimal Co-ord Set", 3499, 4299, "co-ords", "women"),
    (10, "Classic Denim Skirt", 2199, 2699, "skirts", "women"),
]


def seed_products():
    if Product.query.count() > 0:
        return 0
    for pid, name, price, old_price, category, gender in PRODUCTS:
        db.session.add(
            Product(
                id=pid,
                name=name,
                price=price,
                old_price=old_price,
                image=f"/images/products/{pid}.jpg",
                category=category,
                gender=gender,
            )
        )
    db.session.commit()
    return len(PRODUCTS)