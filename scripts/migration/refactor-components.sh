#!/bin/bash

# =============================================================================
# COMPONENT ARCHITECTURE MIGRATION TOOL
# =============================================================================
# Automatically refactors existing components to atomic design principles
# Usage: ./refactor-components.sh [component-path]
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SOURCE_DIR="../current/src"
TARGET_DIR="./src"
REFACTOR_LOG="./component-refactor.log"

echo -e "${BLUE}🧩 Component Architecture Migration Tool${NC}"
echo -e "${BLUE}=====================================${NC}"

# =============================================================================
# Utility Functions
# =============================================================================

log_action() {
    echo "$(date): $1" >> "$REFACTOR_LOG"
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo "$(date): WARNING - $1" >> "$REFACTOR_LOG"
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo "$(date): ERROR - $1" >> "$REFACTOR_LOG"
    echo -e "${RED}❌ $1${NC}"
}

# =============================================================================
# Component Analysis Functions
# =============================================================================

analyze_component_complexity() {
    local file="$1"
    local lines=$(wc -l < "$file")
    local hooks=$(grep -c "use[A-Z]" "$file" 2>/dev/null || echo 0)
    local jsx_elements=$(grep -c "<[A-Z]" "$file" 2>/dev/null || echo 0)
    local props=$(grep -c "props\." "$file" 2>/dev/null || echo 0)
    
    # Determine component type based on complexity
    if [ "$lines" -lt 50 ] && [ "$hooks" -lt 2 ] && [ "$jsx_elements" -lt 5 ]; then
        echo "atom"
    elif [ "$lines" -lt 100 ] && [ "$hooks" -lt 4 ] && [ "$jsx_elements" -lt 10 ]; then
        echo "molecule"
    else
        echo "organism"
    fi
}

extract_imports() {
    local file="$1"
    grep "^import" "$file" 2>/dev/null || echo ""
}

extract_exports() {
    local file="$1"
    grep -E "^export|export default" "$file" 2>/dev/null || echo ""
}

# =============================================================================
# Component Refactoring Functions
# =============================================================================

refactor_to_atomic_structure() {
    local source_file="$1"
    local component_name=$(basename "$source_file" .tsx)
    local component_type=$(analyze_component_complexity "$source_file")
    
    log_action "Refactoring $component_name as $component_type"
    
    # Create target directory
    local target_dir="$TARGET_DIR/components/ui/$component_type"
    mkdir -p "$target_dir"
    
    # Copy and enhance component
    local target_file="$target_dir/$component_name.tsx"
    
    # Generate enhanced component with proper structure
    cat > "$target_file" << EOF
import React from 'react'
import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'

$(extract_imports "$source_file" | grep -v "import React")

// Component variants for consistency
const ${component_name,,}Variants = cva(
  // Base styles
  "",
  {
    variants: {
      variant: {
        default: "",
        // Add variants based on original component
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ${component_name}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${component_name,,}Variants> {
  // Add specific props here
}

export const $component_name = React.forwardRef<
  HTMLDivElement,
  ${component_name}Props
>(({ className, variant, size, ...props }, ref) => {
  return (
    <div
      className={cn(${component_name,,}Variants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})

$component_name.displayName = "$component_name"

export default $component_name
EOF

    # Extract original component logic and adapt it
    if [ -f "$source_file" ]; then
        # Extract main component logic (simplified)
        local main_logic=$(sed -n '/export.*function\|const.*=.*=>/,/^}/p' "$source_file")
        
        # Append adapted logic to new component
        echo "" >> "$target_file"
        echo "// Original component logic (needs manual review and adaptation):" >> "$target_file"
        echo "/*" >> "$target_file"
        echo "$main_logic" >> "$target_file"
        echo "*/" >> "$target_file"
    fi
    
    log_action "Created $component_type component: $target_file"
}

# =============================================================================
# Hook Extraction Functions
# =============================================================================

extract_business_logic_to_hooks() {
    local source_file="$1"
    local component_name=$(basename "$source_file" .tsx)
    
    # Create hooks directory
    mkdir -p "$TARGET_DIR/hooks/business"
    
    local hook_file="$TARGET_DIR/hooks/business/use${component_name}.ts"
    
    # Extract useState, useEffect, and other business logic
    cat > "$hook_file" << EOF
import { useState, useEffect, useCallback } from 'react'

// Business logic extracted from $component_name component
export function use$component_name() {
  // TODO: Extract and adapt business logic from original component
  
  // Example structure:
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const handleAction = useCallback(() => {
    // Business logic here
  }, [])
  
  useEffect(() => {
    // Side effects here
  }, [])
  
  return {
    state,
    loading,
    error,
    handleAction,
  }
}
EOF

    log_action "Created business logic hook: $hook_file"
}

# =============================================================================
# Component Story Generation
# =============================================================================

generate_storybook_story() {
    local component_name="$1"
    local component_type="$2"
    
    mkdir -p "$TARGET_DIR/stories/$component_type"
    
    local story_file="$TARGET_DIR/stories/$component_type/$component_name.stories.tsx"
    
    cat > "$story_file" << EOF
import type { Meta, StoryObj } from '@storybook/react'
import { $component_name } from '@/components/ui/$component_type/$component_name'

const meta: Meta<typeof $component_name> = {
  title: 'UI/$component_type/$component_name',
  component: $component_name,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Define argTypes here
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Default args
  },
}

export const Variant: Story = {
  args: {
    variant: 'default',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}
EOF

    log_action "Created Storybook story: $story_file"
}

# =============================================================================
# TypeScript Type Generation
# =============================================================================

generate_component_types() {
    local component_name="$1"
    local component_type="$2"
    
    mkdir -p "$TARGET_DIR/types/components"
    
    local types_file="$TARGET_DIR/types/components/$component_type.ts"
    
    # Append to existing types file or create new one
    cat >> "$types_file" << EOF

// Types for $component_name ($component_type)
export interface ${component_name}Props {
  // TODO: Define proper types based on original component
  className?: string
  children?: React.ReactNode
}

export interface ${component_name}State {
  // TODO: Define state types if needed
}

export interface ${component_name}Actions {
  // TODO: Define action types if needed
}
EOF

    log_action "Updated types file: $types_file"
}

# =============================================================================
# Main Refactoring Process
# =============================================================================

refactor_single_component() {
    local component_file="$1"
    
    if [ ! -f "$component_file" ]; then
        log_error "Component file not found: $component_file"
        return 1
    fi
    
    local component_name=$(basename "$component_file" .tsx)
    local component_type=$(analyze_component_complexity "$component_file")
    
    echo -e "\n${BLUE}Refactoring: $component_name${NC}"
    echo "Type: $component_type"
    
    # Main refactoring steps
    refactor_to_atomic_structure "$component_file"
    extract_business_logic_to_hooks "$component_file"
    generate_component_types "$component_name" "$component_type"
    generate_storybook_story "$component_name" "$component_type"
    
    log_action "Completed refactoring of $component_name"
}

refactor_all_components() {
    echo -e "\n${YELLOW}Starting mass component refactoring...${NC}"
    
    # Find all React component files
    local component_files=$(find "$SOURCE_DIR" -name "*.tsx" -type f | grep -E "(component|page)" | head -20)
    
    for file in $component_files; do
        refactor_single_component "$file"
    done
    
    log_action "Completed mass component refactoring"
}

# =============================================================================
# Migration Report Generation
# =============================================================================

generate_migration_report() {
    local report_file="./COMPONENT_MIGRATION_REPORT.md"
    
    cat > "$report_file" << EOF
# Component Migration Report

Generated on: $(date)

## Migration Summary

### Components Refactored
$(grep "Completed refactoring" "$REFACTOR_LOG" | wc -l) components successfully refactored

### Component Distribution
- **Atoms**: $(find "$TARGET_DIR/components/ui/atoms" -name "*.tsx" 2>/dev/null | wc -l)
- **Molecules**: $(find "$TARGET_DIR/components/ui/molecules" -name "*.tsx" 2>/dev/null | wc -l)
- **Organisms**: $(find "$TARGET_DIR/components/ui/organisms" -name "*.tsx" 2>/dev/null | wc -l)

### Files Created
- **Components**: $(find "$TARGET_DIR/components" -name "*.tsx" 2>/dev/null | wc -l)
- **Hooks**: $(find "$TARGET_DIR/hooks" -name "*.ts" 2>/dev/null | wc -l)
- **Stories**: $(find "$TARGET_DIR/stories" -name "*.stories.tsx" 2>/dev/null | wc -l)
- **Types**: $(find "$TARGET_DIR/types" -name "*.ts" 2>/dev/null | wc -l)

## Next Steps

### Manual Review Required
1. **Component Logic**: Review extracted component logic and adapt as needed
2. **Props Interface**: Define proper TypeScript interfaces for component props
3. **Styling**: Update component styles to match design system
4. **Testing**: Create unit tests for refactored components
5. **Integration**: Update import paths in parent components

### Recommended Actions
1. Run \`npm run type-check\` to identify TypeScript issues
2. Run \`npm run lint\` to identify code style issues
3. Test components individually in Storybook
4. Update parent components to use new component structure

## Migration Log
\`\`\`
$(tail -20 "$REFACTOR_LOG")
\`\`\`

## Component Mapping

### Atoms (Basic UI Elements)
$(find "$TARGET_DIR/components/ui/atoms" -name "*.tsx" 2>/dev/null | sed 's/.*\///g' | sed 's/.tsx//g' | sort)

### Molecules (Composite Components)
$(find "$TARGET_DIR/components/ui/molecules" -name "*.tsx" 2>/dev/null | sed 's/.*\///g' | sed 's/.tsx//g' | sort)

### Organisms (Complex Components)
$(find "$TARGET_DIR/components/ui/organisms" -name "*.tsx" 2>/dev/null | sed 's/.*\///g' | sed 's/.tsx//g' | sort)
EOF

    log_action "Generated migration report: $report_file"
    echo -e "\n${GREEN}📊 Migration report generated: $report_file${NC}"
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    # Initialize log file
    echo "Component Migration Log - $(date)" > "$REFACTOR_LOG"
    
    if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        echo "Usage: $0 [component-file|--all]"
        echo ""
        echo "Options:"
        echo "  component-file    Refactor a specific component file"
        echo "  --all            Refactor all components automatically"
        echo "  --help           Show this help message"
        exit 0
    fi
    
    if [ "$1" = "--all" ]; then
        refactor_all_components
    elif [ -n "$1" ]; then
        refactor_single_component "$1"
    else
        echo -e "${YELLOW}Please specify a component file or use --all to refactor all components${NC}"
        echo "Usage: $0 [component-file|--all]"
        exit 1
    fi
    
    generate_migration_report
    
    echo -e "\n${GREEN}🎉 Component refactoring complete!${NC}"
    echo -e "${BLUE}Check the migration report for details and next steps.${NC}"
}

# Run if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
