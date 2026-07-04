import os

IGNORE = {
    "node_modules",
    "dist",
    ".git",
    ".DS_Store",
    "__pycache__",
    ".vscode"
}

def tree(path=".", prefix=""):
    entries = sorted(
        [e for e in os.listdir(path) if e not in IGNORE]
    )

    for i, entry in enumerate(entries):
        connector = "└── " if i == len(entries) - 1 else "├── "
        print(prefix + connector + entry)

        full_path = os.path.join(path, entry)

        if os.path.isdir(full_path):
            extension = "    " if i == len(entries) - 1 else "│   "
            tree(full_path, prefix + extension)

tree(".")