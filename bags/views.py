from django.shortcuts import render
from django.http import JsonResponse
import json


BAGS = [
    {
        "id": 1,
        "name": "Classic Leather Tote",
        "price": 89.99,
        "category": "Totes",
        "description": "Timeless Italian leather tote perfect for everyday use. Spacious interior with magnetic snap closure.",
        "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
        "badge": "Bestseller",
    },
    {
        "id": 2,
        "name": "Designer Handbag",
        "price": 149.99,
        "category": "Handbags",
        "description": "Elegant designer handbag with gold-tone hardware. Features a detachable shoulder strap.",
        "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
        "badge": "New",
    },
    {
        "id": 3,
        "name": "Urban Backpack",
        "price": 69.99,
        "category": "Backpacks",
        "description": "Stylish yet functional backpack with padded laptop compartment. Perfect for work or travel.",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
        "badge": "",
    },
    {
        "id": 4,
        "name": "Evening Clutch",
        "price": 45.99,
        "category": "Clutches",
        "description": "Glamorous satin clutch with crystal embellishments. Includes a detachable chain strap.",
        "image": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80",
        "badge": "Sale",
    },
    {
        "id": 5,
        "name": "Crossbody Bag",
        "price": 59.99,
        "category": "Crossbody",
        "description": "Compact crossbody bag with adjustable strap. Multiple zip pockets keep you organized.",
        "image": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
        "badge": "",
    },
    {
        "id": 6,
        "name": "Weekend Duffel",
        "price": 99.99,
        "category": "Travel",
        "description": "Premium canvas duffel with leather trim. Fits carry-on requirements for most airlines.",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a45?w=600&q=80",
        "badge": "",
    },
    {
        "id": 7,
        "name": "Mini Bucket Bag",
        "price": 54.99,
        "category": "Handbags",
        "description": "Trendy drawstring bucket bag in soft pebbled leather. Comes with a pouch insert.",
        "image": "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80",
        "badge": "Trending",
    },
    {
        "id": 8,
        "name": "Structured Satchel",
        "price": 119.99,
        "category": "Totes",
        "description": "Professional structured satchel with top handles and a zip-top closure. Great for the office.",
        "image": "https://images.unsplash.com/photo-1519242220831-09410926fbff?w=600&q=80",
        "badge": "",
    },
]


def home(request):
    categories = sorted(set(bag["category"] for bag in BAGS))
    return render(request, "home.html", {
        "bags": BAGS,
        "categories": categories,
        "bags_json": json.dumps(BAGS),
    })


def contact(request):
    if request.method == "POST":
        data = json.loads(request.body)
        # In a real app you'd send an email or save to DB
        return JsonResponse({"status": "ok", "message": "Thank you! We'll be in touch soon."})
    return render(request, "contact.html")