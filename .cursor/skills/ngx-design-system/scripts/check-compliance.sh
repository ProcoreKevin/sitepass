#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# NGX Design System — Compliance Scanner
# Usage:  ./check-compliance.sh [path]     (default: src/)
# Scans TSX / TS / CSS files for token violations and pattern anti-patterns
# Exit code: 0 = clean, 1 = violations found
# ─────────────────────────────────────────────────────────────────────────────

TARGET="${1:-src}"
VIOLATIONS=0
WARNINGS=0

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

hr() { printf "${CYAN}─%.0s${NC}" {1..72}; echo; }

echo ""
hr
echo -e "${BOLD}  NGX Design System — Compliance Scanner${NC}"
echo -e "  Target: ${TARGET}"
hr
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 1: TOKEN VIOLATIONS (Guidelines Rule 0.1)
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BOLD}[1] Token Violations  (Guidelines Rule 0.1)${NC}"
echo ""

check_token() {
  local label="$1"
  local pattern="$2"
  local rule="$3"
  local exclude="${4:-__NOMATCH__}"

  results=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.css" \
    -E "$pattern" "$TARGET" 2>/dev/null \
    | grep -v "$exclude" \
    | grep -v "check-compliance" \
    | grep -v "SKILL.md" \
    | grep -v "REFERENCE.md")

  if [ -n "$results" ]; then
    echo -e "  ${RED}✗ VIOLATION${NC} — $label  [$rule]"
    echo "$results" | head -8 | while IFS= read -r line; do
      echo -e "      ${YELLOW}$line${NC}"
    done
    count=$(echo "$results" | wc -l)
    if [ "$count" -gt 8 ]; then
      echo -e "      ${YELLOW}... and $((count - 8)) more${NC}"
    fi
    echo ""
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
}

# Raw color values
check_token \
  "Hex color code used directly in className or style" \
  '(className|style)=.*#[0-9a-fA-F]{3,6}' \
  "Rule 0.1"

# bg-white in component styling (NOT in comments or string descriptions)
check_token \
  "bg-white raw token — use bg-background-primary" \
  '"bg-white[^/]|`bg-white[^/]' \
  "Rule 0.1" \
  "bg-white/30\|bg-white/20\|WRONG\|❌\|violation\|NEVER"

# Hardcoded inline styles with colors
check_token \
  "Inline style with hardcoded color value" \
  "style=\{\{.*color.*:.*['\"]#" \
  "Rule 0.1"

# Raw Tailwind color primitives in className (not semantic tokens)
check_token \
  "Raw Tailwind color primitive — use semantic token" \
  'className=.*\b(red|blue|green|yellow|purple|pink|indigo|orange|teal)-[0-9]{2,3}\b' \
  "Rule 0.1" \
  "asphalt-\|core-\|helix-\|WRONG\|❌"

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 2: PATTERN VIOLATIONS (Guidelines Rule 0.4)
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BOLD}[2] Pattern Component Violations  (Guidelines Rule 0.4)${NC}"
echo ""

# Custom table row duplicates
results=$(find "$TARGET" -name "*.tsx" -not -path "*/shared/patterns/*" 2>/dev/null \
  | xargs grep -lE "isActive.*bg-|isSelected.*bg-|\bactiveRow\b|\bselectedRow\b" 2>/dev/null \
  | grep -v "rfi-table\|gold-standard\|spec")

if [ -n "$results" ]; then
  echo -e "  ${RED}✗ VIOLATION${NC} — Custom table row state found outside pattern component  [Rule 0.4]"
  echo "$results" | while IFS= read -r f; do echo -e "      ${YELLOW}$f${NC}"; done
  echo ""
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# TableActionRow duplicates outside shared/patterns
results=$(find "$TARGET" -name "table-action-row.tsx" \
  -not -path "*/shared/patterns/*" \
  -not -path "*/rfis/*" 2>/dev/null)

if [ -n "$results" ]; then
  echo -e "  ${RED}✗ VIOLATION${NC} — Duplicate TableActionRow outside shared/patterns  [Rule 0.4]"
  echo "$results" | while IFS= read -r f; do echo -e "      ${YELLOW}$f${NC}"; done
  echo ""
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# Locked styling overrides on pattern components
check_token \
  "Pattern component locked style overridden with !" \
  '<TableRow[^>]*className.*![a-z]|<TableActionRow[^>]*className.*![a-z]' \
  "Rule 0.4 / PCL Locked Styling"

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 3: Z-INDEX VIOLATIONS (Architecture RULE 3)
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BOLD}[3] Z-Index Violations  (Architecture RULE 3)${NC}"
echo ""

check_token \
  "Non-canonical z-index value — must be z-0/10/20/30/50/80" \
  '\bz-(1|2|3|4|5|6|7|8|9|11|12|13|14|15|16|17|18|19|21|22|25|40|60|70|90|100|110|120)\b' \
  "Architecture RULE 3"

# fixed inset-0 on a Slide-Out (should be absolute within workspace container)
results=$(grep -rn --include="*.tsx" \
  -E "z-30.*fixed inset-0|fixed inset-0.*z-30" \
  "$TARGET" 2>/dev/null \
  | grep -v "WRONG\|❌\|Modal\|modal")

if [ -n "$results" ]; then
  echo -e "  ${RED}✗ VIOLATION${NC} — Slide-Out uses fixed inset-0 — scrim must be absolute (workspace-only)  [Architecture RULE 3]"
  echo "$results" | head -5 | while IFS= read -r line; do echo -e "      ${YELLOW}$line${NC}"; done
  echo ""
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 4: FORM PATTERN VIOLATIONS (Form-Creation-Checklist)
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BOLD}[4] Form Pattern Violations  (Form-Creation-Checklist)${NC}"
echo ""

# Save/Cancel in a Slide-Out (Data Entry type should be autosave)
results=$(grep -rn --include="*.tsx" \
  -E "(onSave|handleSave).*z-30|z-30.*(onSave|handleSave)|Save Changes.*Slide|SlideOut.*Save" \
  "$TARGET" 2>/dev/null \
  | grep -v "Filter\|filter\|Config\|config\|System\|ManualSaveFooter")

if [ -n "$results" ]; then
  echo -e "  ${YELLOW}⚠ WARNING${NC}  — Possible Save/Cancel in Slide-Out (Data Entry type must be autosave)  [FCC Rule 6.1]"
  echo "$results" | head -5 | while IFS= read -r line; do echo -e "      ${YELLOW}$line${NC}"; done
  echo ""
  WARNINGS=$((WARNINGS + 1))
fi

# Destructive action in a Popover
results=$(grep -rn --include="*.tsx" \
  -E "Popover.*[Dd]elete|[Dd]elete.*Popover|[Vv]oid.*Popover|Popover.*[Vv]oid|z-20.*[Dd]elete|[Dd]elete.*z-20" \
  "$TARGET" 2>/dev/null \
  | grep -v "WRONG\|❌\|comment\|\/\/")

if [ -n "$results" ]; then
  echo -e "  ${RED}✗ VIOLATION${NC} — Destructive action inside a Popover — never allowed  [FCC §2.4]"
  echo "$results" | head -5 | while IFS= read -r line; do echo -e "      ${YELLOW}$line${NC}"; done
  echo ""
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 5: WORKSPACE ARCHITECTURE (Architecture RULE 1 = Guidelines Rule 0.6)
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BOLD}[5] Workspace Architecture  (Architecture RULE 1)${NC}"
echo ""

# Three-pane layouts
check_token \
  "Possible three-pane workspace layout — max is 2 panes" \
  'flex.*<.*pane.*<.*pane.*<.*pane|grid-cols-3.*workspace|threePane\|three-pane' \
  "Architecture RULE 1"

# Grid content in right pane
results=$(grep -rn --include="*.tsx" \
  -E "rightPane.*[Tt]able|rightPane.*[Gg]rid|rightPane.*TableRow|[Rr]ight.*[Pp]ane.*rfi-table" \
  "$TARGET" 2>/dev/null \
  | grep -v "WRONG\|❌")

if [ -n "$results" ]; then
  echo -e "  ${RED}✗ VIOLATION${NC} — Grid/Table content in right pane — grids must be in left pane  [Architecture RULE 3]"
  echo "$results" | head -5 | while IFS= read -r line; do echo -e "      ${YELLOW}$line${NC}"; done
  echo ""
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 6: NAVIGATION INTEGRITY (Guidelines Rule 0.3)
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BOLD}[6] Navigation Integrity  (Guidelines Rule 0.3)${NC}"
echo ""

# Pages without route connections to sidebar
orphan_pages=$(find "$TARGET" -name "page.tsx" 2>/dev/null \
  | grep -v "__tests__\|test\|spec\|node_modules" \
  | while read -r f; do
      tool_dir=$(echo "$f" | sed 's|/page.tsx||' | xargs basename)
      if ! grep -qr "\"$tool_dir\"\|'$tool_dir'" "${TARGET}/app/components/shell/" 2>/dev/null; then
        echo "$f"
      fi
    done)

if [ -n "$orphan_pages" ]; then
  echo -e "  ${YELLOW}⚠ WARNING${NC}  — Possible orphaned page (not found in sidebar navigation)  [Rule 0.3]"
  echo "$orphan_pages" | head -5 | while IFS= read -r f; do echo -e "      ${YELLOW}$f${NC}"; done
  echo ""
  WARNINGS=$((WARNINGS + 1))
fi

# ─────────────────────────────────────────────────────────────────────────────
# RESULTS SUMMARY
# ─────────────────────────────────────────────────────────────────────────────

hr
echo ""
if [ "$VIOLATIONS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo -e "  ${GREEN}${BOLD}✓ ALL CHECKS PASSED${NC} — No violations found in ${TARGET}"
elif [ "$VIOLATIONS" -eq 0 ]; then
  echo -e "  ${YELLOW}${BOLD}⚠ $WARNINGS WARNING(S)${NC} — Review before merging"
  echo -e "  ${GREEN}✓ No hard violations found${NC}"
else
  echo -e "  ${RED}${BOLD}✗ $VIOLATIONS VIOLATION(S)${NC}  ${YELLOW}$WARNINGS WARNING(S)${NC}"
  echo ""
  echo -e "  ${BOLD}Violations block merge. Fix before submitting.${NC}"
  echo -e "  Cite rule numbers from the governing documents when explaining fixes."
fi
echo ""
hr
echo ""

exit $((VIOLATIONS > 0 ? 1 : 0))
