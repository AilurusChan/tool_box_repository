import sys
import re

def main():
    if len(sys.argv) != 3:
        print("Usage: python field_repetition.py <folder_path or file_path> <field_name>")
        return
    else:
        target = sys.argv[1]
        field_name = sys.argv[2]
        if target.endswith('.json'):
            process_file(target, field_name)
        else:
            process_folder(target, field_name)


def process_file(file_path, field_name):
    print(f"\n=== Processing file: {file_path} ===")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    regex = rf'"{field_name}"\s*:\s*"([^"]+)"'
    matches = re.findall(regex, content)
    seen = set()
    duplicates = set()
    for item in matches:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)
    if duplicates:
        print(f'  Repetitions found for field "{field_name}"')
        print('  Duplicates:')
        for dup in duplicates:
            print(f'    - {dup}')
    else:
        print('  No repetitions found.')

def process_folder(folder_path, field_name):
    import os
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                relative_path = os.path.join(folder_path, os.path.relpath(file_path, folder_path))
                process_file(relative_path, field_name)
            

        

if __name__ == "__main__":
    main()