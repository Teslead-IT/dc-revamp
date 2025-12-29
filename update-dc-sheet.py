import re

# Read the file
with open('components/dc-grid/new-dc-sheet.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
content = content.replace(
    'import { useQueryClient } from "@tanstack/react-query"',
    'import { useQueryClient } from "@tanstack/react-query"\nimport { AddItemsModal } from "./add-items-modal"'
)

# 2. Add modal state and change items initial state
old_items_state = r'''    // Items state
    const \[enableWeight, setEnableWeight\] = useState\(true\)
    const \[enableSqft, setEnableSqft\] = useState\(true\)
    const \[items, setItems\] = useState<ItemRow\[\]>\(\[
        \{
            id: 1,
            itemName: "",
            description: "",
            projectName: "",
            projectIncharge: "",
            quantity: "",
            uom: "",
            weightPerUnit: "",
            totalWeight: "",
            sqftPerUnit: "",
            totalSqft: "",
            rate: "",
            remarks: "",
            notes: "",
        \},
    \]\)'''

new_items_state = '''    // Items state
    const [enableWeight, setEnableWeight] = useState(true)
    const [enableSqft, setEnableSqft] = useState(true)
    const [showAddItemsModal, setShowAddItemsModal] = useState(false)
    const [items, setItems] = useState<ItemRow[]>([])'''

content = re.sub(old_items_state, new_items_state, content)

# 3. Replace addItem, removeItem, and updateItem functions
old_functions = r'''    const addItem = \(\) => \{[\s\S]*?\}\)
    \}

    const removeItem = \(id: number\) => \{[\s\S]*?\}
    \}

    const updateItem = \(id: number, field: keyof ItemRow, value: string\) => \{[\s\S]*?\}\)\)
    \}'''

new_functions = '''    const removeItem = (id: number) => {
        setItems(items.filter((item) => item.id !== id))
    }

    const handleItemsConfirm = (newItems: ItemRow[]) => {
        // Append new items from modal to existing items
        setItems([...items, ...newItems])
    }'''

content = re.sub(old_functions, new_functions, content, flags=re.MULTILINE)

# 4. Read the new section content
with open('components/dc-grid/items-section-temp.txt', 'r', encoding='utf-8') as f:
    new_section = f.read()

# 5. Replace the entire items table section
# Find from "Line Items Section - ORIGINAL" to just before "Additional Info Section"
pattern = r'\{/\* Line Items Section - ORIGINAL TABLE DESIGN \*/\}[\s\S]*?\{/\* Additional Info Section - ORIGINAL DESIGN \*/\}'
replacement = new_section.rstrip() + '\n\n                            {/* Additional Info Section - ORIGINAL DESIGN */'

content = re.sub(pattern, replacement, content)

# 6. Add the modal component before the final closing of NewDCSheet (before CreateSupplierModal closing)
# Find the location just before the final </> of NewDCSheet
pattern = r'(\s+</>\s+\)\s+\}\s+interface CreateSupplierModalProps)'
replacement = r'''
            {/* Add Items Modal */}
            <AddItemsModal
                open={showAddItemsModal}
                onOpenChange={setShowAddItemsModal}
                onConfirm={handleItemsConfirm}
                enableWeight={enableWeight}
                enableSqft={enableSqft}
            />\1'''

content = re.sub(pattern, replacement, content)

# Write back
with open('components/dc-grid/new-dc-sheet.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully updated new-dc-sheet.tsx!")
