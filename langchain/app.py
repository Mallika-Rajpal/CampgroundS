import csv

# Data to be written to CSV
data = [
    {
        "Category": "Clothing",
        "Mandatory Requirements": "1. Product labels must follow FTC & ASTM guidelines and include: Fibre content, Country of Origin, Manufacturer/Marketed by details, Mechanics of Labour. 2. ASTM standards must be followed during manufacturing. Guidelines include: product specifications, fabric, inflammability.",
        "Recommended Requirements": "Follow ASTM fabric inflammability standards.",
        "Applicable Products": "Trousers, Track pants, Shorts, Jeans, Overalls, Dungarees, Underwear, Jackets, Coats, Rainwear, Sherwani, Swimwear, Shirts, Sweatshirts, Sweaters, unstitched fabrics, Kurtas, Leggings, Lingerie, Suits, Vests, Traditional wear, Belts, Gloves, Socks, Caps, Ties, Mufflers, Scarves, Face masks",
        "FAQs": "1) When are the compliance requirements needed? (a) ASTM standards should be followed in manufacturing. (b) FTC & ASTM label guidelines before shipping. 2) How often are the requirements needed? All requirements are required once for every product.",
        "Reference Links": "FTC Labeling Requirements: https://www.ftc.gov/tips-advice/business-center/guidance/threading-your-way-through-labelingrequirements-under-textile"
    },
    {
        "Category": "Accessories",
        "Mandatory Requirements": "1. Product labels must follow FTC guidelines for proper labeling.",
        "Recommended Requirements": "Follow recommended aesthetic design standards.",
        "Applicable Products": "Belts, Gloves, Socks, Scarves, Caps",
        "FAQs": "1) When are compliance requirements needed? Before export.",
        "Reference Links": "Accessories Labeling Guide: https://example.com/accessories-guide"
    }
]

# Writing to CSV file
with open('compliance_data.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ["Category", "Mandatory Requirements", "Recommended Requirements", "Applicable Products", "FAQs", "Reference Links"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for row in data:
        writer.writerow(row)

print("CSV file created successfully!")
