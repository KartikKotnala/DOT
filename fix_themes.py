import os
import re

css_path = 'src/style.css'
with open(css_path, 'r') as f:
    content = f.read()

# Remove the mapping block in @theme
content = re.sub(r'@theme \{.*?\}', '''@theme {
  --font-sans: "Outfit", system-ui, -apple-system, sans-serif;
  
  --color-app: #000000;
  --color-panel-glow: rgba(239, 68, 68, 0.15); 
  --color-accent: #ef4444;              
  --color-panel: rgba(15, 15, 15, 0.6);
  --color-line: rgba(255, 255, 255, 0.15);
  --color-main: #ffffff;
  --color-muted: #a1a1aa;
}''', content, flags=re.DOTALL)

# Replace all custom variables in the rest of the CSS
replacements = {
    '--bg-app': '--color-app',
    '--panel-glow': '--color-panel-glow',
    '--accent': '--color-accent',
    '--panel-bg': '--color-panel',
    '--border-color': '--color-line',
    '--text-main': '--color-main',
    '--text-muted': '--color-muted'
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Remove the redundant dark theme from :root since it's in @theme now
# We will just replace :root, [data-theme="dark"] block with [data-theme="dark"]
content = content.replace(':root, [data-theme="dark"] {', '[data-theme="dark"] {')

with open(css_path, 'w') as f:
    f.write(content)

# Now fix vue files using var(--text-main) etc.
vue_files = []
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.vue') or file.endswith('.css'):
            vue_files.append(os.path.join(root, file))

for vf in vue_files:
    if vf == 'src/style.css': continue
    with open(vf, 'r') as f:
        v_content = f.read()
    
    changed = False
    for old, new in replacements.items():
        if old in v_content:
            v_content = v_content.replace(old, new)
            changed = True
            
    if changed:
        with open(vf, 'w') as f:
            f.write(v_content)

print("Done fixing themes!")
