# Contract Structure Analysis

## Document Structure from input.json

The service agreement document has the following structure:

### Top-Level Elements
1. **Title Block** - Contains the main heading "Service Agreement"
2. **Description Paragraph** - Contains the agreement date and basic description
3. **Parties Block** - Lists the Provider (Blackmoon) and Client (James Inc)
4. **Clause 1: Key Details** - Contains start date and term information
5. **Clause 2: Definitions** - Contains sub-definitions for Business Day and Charges
6. **Clause 3: Agreement to Provide Services** - Contains the provider's obligations

### Clause Numbering Structure

#### Expected Numbering:
- **Clause 1**: Key Details
- **Clause 2**: Definitions
  - **(a)**: Business Day definition
  - **(b)**: Charges definition  
- **Clause 3**: Agreement to Provide Services

#### Current Issue:
The sub-clauses under "Definitions" are showing as **(b)** and **(d)** instead of **(a)** and **(b)**.

### Root Cause Analysis

The issue appears to be that the sub-clause counter (`subClauseCount`) is not being reset properly between top-level clauses, or there are additional clause elements being processed that increment the counter unexpectedly.

Key points:
1. The `incrementMain()` function should reset `subClauseCount = 0` when a new top-level clause begins
2. The `incrementSub()` function should start from (a) for each new top-level clause's sub-clauses
3. There may be hidden or unexpected clause elements in the JSON that are incrementing the counter

### Next Steps
Need to investigate why the sub-clause counter is not starting fresh for each top-level clause, causing the (a), (b) sequence to become (b), (d).
