import os

file_path = r"c:\Users\javie\Desktop\Automatizar_Historias\Libro_Best-seller.md"

def audit_file():
    print(f"Auditing {file_path} for invalid characters...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        issues = []
        
        # Check for BOM at the very start (if opened as utf-8, python handles it, but let's check raw bytes effectively by looking for \ufeff if it slipped in)
        if content.startswith('\ufeff'):
            issues.append("Found BOM (Byte Order Mark) at start of file.")
            
        # Check for Replacement Character
        if '\ufffd' in content:
            count = content.count('\ufffd')
            issues.append(f"Found {count} Replacement Characters () - Encoding error indicator.")
            
        # Check for Zero Width Space
        if '\u200b' in content:
            count = content.count('\u200b')
            issues.append(f"Found {count} Zero Width Spaces (U+200B).")

        # Check for other control chars (excluding \n, \r, \t)
        for i, char in enumerate(content):
            if ord(char) < 32 and char not in ('\n', '\r', '\t'):
                issues.append(f"Found illegal control character {repr(char)} at position {i}")
                if len(issues) > 10: 
                    issues.append("... stopping audit after 10 errors.")
                    break
        
        if not issues:
            print("SUCCESS: No invalid characters found. File is clean UTF-8.")
        else:
            print("WARNING: Found the following issues:")
            for issue in issues:
                print(f"- {issue}")
                
    except UnicodeDecodeError as e:
        print(f"CRITICAL: File is valid UTF-8. Error: {e}")
    except Exception as e:
        print(f"Error reading file: {e}")

if __name__ == "__main__":
    audit_file()
