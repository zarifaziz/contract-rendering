# React Contract UI

A React application that renders contract documents by parsing structured JSON data. This application displays a Service Agreement document with proper formatting, styling, and interactive elements.

## Features

- **JSON Document Parsing**: Parses hierarchical JSON document structure
- **Rich Text Formatting**: Supports bold, italic, and underline text formatting
- **Colored Mentions**: Displays variable placeholders with colored backgrounds
- **Mention Synchronization**: All mentions with the same `id` display synchronized values throughout the document
- **Sequential Clause Numbering**: Maintains proper clause numbering throughout the document
- **Professional Styling**: Clean, document-like appearance suitable for legal contracts
- **Responsive Design**: Works on different screen sizes

## Mention Functionality

### Variable-like Behavior
Mentions behave like programming variables:
- **Unique Identification**: Each mention is identified by its `id` attribute
- **Synchronized Values**: All instances of a mention with the same `id` display the same value
- **Centralized State**: Single source of truth for all mention values
- **Future-Ready**: Architecture supports editing functionality to be added later

### Example
In the Service Agreement, the "Contract Date" mention appears in multiple locations:
1. Description: "This Service Agreement is dated **November 17, 2021**"
2. Key Details: "Start Date: **November 17, 2021**"

Both instances have `id: "Contract Date"` and will always show the same value.


## Supported Elements

- **Headings**: `h1`, `h4`
- **Text**: `p` (paragraphs), `span` (inline text)
- **Lists**: `ul` (unordered lists), `li` (list items), `lic` (list item content)
- **Containers**: `block` (content blocks)
- **Clauses**: `clause` (numbered sections)
- **Mentions**: `mention` (colored variable placeholders with synchronization)

## Text Formatting

- **Bold**: Elements with `"bold": true`
- **Italic**: Elements with `"italic": true`
- **Underline**: Elements with `"underline": true`


### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Technologies Used

- **React** - UI library with hooks for state management
- **CSS3** - Styling and layout
- **Create React App** - Project setup and build tools

## Architecture

### Mention Management
- **Centralized State**: All mention values stored in App.js
- **Props Drilling**: Values passed down through component hierarchy
- **Memoization**: Efficient extraction and updates
- **Future-Ready**: Prepared for editing functionality

### Component Hierarchy
```
App (mention state management)
└── DocumentRenderer
    └── TextBlock
        ├── Mention (synchronized values)
        └── Clause
            └── TextBlock (recursive)
```


## Edge Cases we needed to handle:
- Keeping track of clause numbers globally
- Definition in h4, along with other text, which need to be
- PARTIES was not an ordered list. "Agreement.." clause was an unordered list. So there was a lot of different things to be managed.
