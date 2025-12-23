
# DC Grid Implementation

This module implements a Zoho Projects-style Data Grid for Delivery Challans.

## Features
- **Server-Side Operations**: Pagination, Sorting, and Searching are handled via the `/api/dc` endpoint.
- **Custom Renderers**: 
  - Status Pills (In Progress, Completed, etc.)
  - Owner Avatar
  - Progress Bar
- **Custom View**: "All DC" view is the default. Supports custom view architecture (frontend prepared).
- **Responsive Layout**: Dark theme, full height, sticky columns.

## Files
- `app/api/dc/route.ts`: Mock API with server-side logic simulations.
- `components/dc-grid/dc-grid.tsx`: Main Grid Component.
- `components/dc-grid/grid-header.tsx`: Zoho-style Toolbar.
- `app/dashboard/dc/all/page.tsx`: The page hosting the grid.

## Usage
Navigate to `/dashboard/dc/all` to see the new grid.
- **Search**: Type in the top search bar (or the header search) to filter globally.
- **Sort**: Click column headers.
- **Pagination**: Use the bottom pagination bar.





# AG Grid Filtering Guide

This application uses **AG Grid** for filtering data. Here's a quick guide on how to use the filter options available in the column headers.

## 1. Filter Logic (AND / OR)

When you filter a text column (e.g., *Customer*, *Created By*, *DC Number*), you can define up to **two conditions**.

### **AND Condition**
- **Use Case:** When you want rows that match **BOTH** criteria.
- **Example:** `Customer` starts with "A" **AND** `Customer` contains "Corp".
- **Result:** Only customers like "Acme Corp" will show. "Alpha Inc" would NOT show even if it starts with "A" because it doesn't contain "Corp".

### **OR Condition**
- **Use Case:** When you want rows that match **EITHER** criteria.
- **Example:** `Customer` equals "Acme" **OR** `Customer` equals "Stark".
- **Result:** Both "Acme" rows and "Stark" rows will appear.

---

## 2. Filter Operators

You can choose different operators from the dropdown menu in the filter dialog:

| Operator | Description |
| :--- | :--- |
| **Contains** | (Default) Matches if the text exists anywhere in the cell value. |
| **Not contains** | Excludes rows where the text exists in the cell value. |
| **Equals** | Matches only if the cell value is exactly the same (case-insensitive usually). |
| **Not equal** | Excludes rows with that exact value. |
| **Starts with** | Matches only if the cell value begins with your text. |
| **Ends with** | Matches only if the cell value ends with your text. |

---

## 3. Specific Column Behaviors

- **Status / Priority**: These might use simple text filtering in this version. Type "Open" to find Open DCs.
- **Created By**: Filters by the **Name** of the person.
- **Dates**: Use the date picker (if enabled) or text filter to find items like "2025".

## 4. Global Search

The top search bar is a "Global Search". It checks all searchable columns (DC Number, Customer, Owner) at once.
- **Note:** Global search works *in addition* to specific column filters. If you global search "A" and column filter "B", you get results matching both.
