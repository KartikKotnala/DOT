import os

target_dir = './src'
replacements = {
    "'http://localhost:5000/api/brands'": "'/SubProductsBrand.json'",
    '"http://localhost:5000/api/brands"': "'/SubProductsBrand.json'",
    "'http://localhost:5000/api/products'": "'/SubProducts.json'",
    '"http://localhost:5000/api/products"': "'/SubProducts.json'",
    "'http://localhost:5000/api/kiosks'": "'/KioskRegistry.json'",
    '"http://localhost:5000/api/kiosks"': "'/KioskRegistry.json'"
}

for root, _, files in os.walk(target_dir):
    for file in files:
        if file.endswith('.vue'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
            
            if new_content != content:
                with open(path, 'w') as f:
                    f.write(new_content)
                print(f"Reverted {path}")
