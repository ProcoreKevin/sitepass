#!/usr/bin/env bash
# =============================================================================
# Legacy Theme Compliance Scanner v2.0
# Part of the legacy-theme Cursor Agent Skill
# Usage:  ./check-compliance.sh [src-path] [css-entry]
#         Defaults: .   styles/globals.css  (override: path [css-entry])
# Exit:   0 = clean · 1 = violations found (blocks merge in CI)
# =============================================================================

TARGET="${1:-.}"
CSS_ENTRY="${2:-styles/globals.css}"
VIOLATIONS=0
WARNINGS=0

RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

hr() { printf "${CYAN}─%.0s${NC}" {1..72}; echo; }

echo ""; hr
echo -e "${BOLD}  Legacy Theme Compliance Scanner v2.0 — NGX Design System${NC}"
echo -e "  Target: ${TARGET}  ·  CSS entry: ${CSS_ENTRY}"; hr; echo ""

# ─── Helper ─────────────────────────────────────────────────────────────────
check() {
  local label="$1" pattern="$2" rule="$3" exclude="${4:-__NOMATCH__}"
  local results
  results=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.css" \
    -E "$pattern" "$TARGET" 2>/dev/null \
    | grep -v "$exclude" | grep -v "//.*$pattern" \
    | grep -v "check-compliance" | grep -v "SKILL.md" \
    | grep -v "REFERENCE.md" | grep -v "CSS-LAYER-GUIDE.md")
  if [ -n "$results" ]; then
    echo -e "  ${RED}✗ VIOLATION${NC} — $label  [$rule]"
    echo "$results" | head -8 | while IFS= read -r line; do
      echo -e "      ${YELLOW}$line${NC}"
    done
    count=$(echo "$results" | wc -l)
    [ "$count" -gt 8 ] && echo -e "      ${YELLOW}... and $((count - 8)) more${NC}"
    echo ""; VIOLATIONS=$((VIOLATIONS + 1))
  fi
}

warn() {
  local label="$1" pattern="$2" note="$3" exclude="${4:-__NOMATCH__}"
  local results
  results=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.css" \
    -E "$pattern" "$TARGET" 2>/dev/null \
    | grep -v "$exclude" | grep -v "check-compliance" | grep -v "SKILL.md")
  if [ -n "$results" ]; then
    echo -e "  ${YELLOW}⚠ WARNING${NC} — $label"
    echo -e "  ${YELLOW}  → $note${NC}"
    echo "$results" | head -4 | while IFS= read -r line; do
      echo -e "      ${YELLOW}$line${NC}"
    done
    echo ""; WARNINGS=$((WARNINGS + 1))
  fi
}

# ─── 0. CSS LAYER ENFORCEMENT ────────────────────────────────────────────────
echo -e "${BOLD}[0] CSS Layer Enforcement${NC}"; echo ""

if [ -f "$CSS_ENTRY" ]; then
  if ! grep -q "@layer base, react-aria, untitled-ui, legacy-theme" "$CSS_ENTRY"; then
    echo -e "  ${RED}✗ VIOLATION${NC} — @layer declaration missing from ${CSS_ENTRY}  [Layer Order]"
    echo -e "      ${YELLOW}Add as FIRST line: @layer base, react-aria, untitled-ui, legacy-theme;${NC}"
    echo ""; VIOLATIONS=$((VIOLATIONS + 1))
  else
    echo -e "  ${GREEN}✓${NC} @layer declaration found"
  fi

  if grep -q "untitledui/react/styles.css" "$CSS_ENTRY"; then
    if ! grep -E "untitledui/react/styles\.css.*layer\|layer.*untitled-ui|@layer untitled-ui" "$CSS_ENTRY" > /dev/null 2>&1; then
      echo -e "  ${RED}✗ VIOLATION${NC} — UUI imported without layer assignment  [Layer Order]"
      echo -e "      ${YELLOW}@import '@untitledui/react/styles.css' layer(untitled-ui)${NC}"
      echo ""; VIOLATIONS=$((VIOLATIONS + 1))
    else
      echo -e "  ${GREEN}✓${NC} UUI import assigned to layer"
    fi
  fi

  if grep -q "react-aria" "$CSS_ENTRY"; then
    if ! grep -E "react-aria.*layer\|layer.*react-aria|@layer react-aria" "$CSS_ENTRY" > /dev/null 2>&1; then
      echo -e "  ${RED}✗ VIOLATION${NC} — React Aria imported without layer assignment  [Layer Order]"
      echo -e "      ${YELLOW}@import '@react-aria/components/dist/styles.css' layer(react-aria)${NC}"
      echo ""; VIOLATIONS=$((VIOLATIONS + 1))
    else
      echo -e "  ${GREEN}✓${NC} React Aria import assigned to layer"
    fi
  fi
else
  echo -e "  ${YELLOW}⚠ WARNING${NC} — CSS entry not found at ${CSS_ENTRY}"
  echo -e "  ${YELLOW}  → Pass entry as second arg: check-compliance.sh src/ src/styles/globals.css${NC}"
  echo ""; WARNINGS=$((WARNINGS + 1))
fi

# --spacing px override check
spacing_hits=$(grep -rn --include="*.css" -E "^\s*--spacing:\s*[0-9]+px" "$TARGET" 2>/dev/null \
  | grep -v "check-compliance" | grep -v "SKILL.md")
if [ -n "$spacing_hits" ]; then
  echo -e "  ${RED}✗ VIOLATION${NC} — --spacing set to px value (doubles all Tailwind utilities)  [Spacing Multiplier]"
  echo -e "      ${YELLOW}Must be: --spacing: 0.25rem${NC}"
  echo "$spacing_hits" | head -4 | while IFS= read -r line; do echo -e "      ${YELLOW}$line${NC}"; done
  echo ""; VIOLATIONS=$((VIOLATIONS + 1))
fi

warn "Manual :disabled on React Aria components — use isDisabled prop" \
  '<(Button|TextField|Select|ComboBox|DatePicker|NumberField|Switch|Checkbox)[^>]* disabled[^=I]' \
  "React Aria manages [data-disabled]. Use isDisabled prop instead." \
  "isDisabled\|WRONG\|❌\|comment"

echo ""

# ─── 1. TOKEN VIOLATIONS ────────────────────────────────────────────────────
echo -e "${BOLD}[1] Token Violations  (Guidelines Rule 0.1)${NC}"; echo ""

check "Hex color in className or style" \
  '(className|style)=.*#[0-9a-fA-F]{3,6}' "Rule 0.1"

check "bg-white raw token — use bg-[var(--color-bg-primary)]" \
  '"bg-white[^/]|`bg-white[^/]' "Rule 0.1" \
  "bg-white/30\|bg-white/20\|WRONG\|❌\|violation\|NEVER"

check "Inline style with hardcoded color" \
  "style=\{\{.*color.*:.*['\"]#" "Rule 0.1"

check "Raw Tailwind color primitive instead of semantic token" \
  'className=.*\b(red|blue|green|yellow|gray|slate|zinc)-[0-9]{2,3}\b' \
  "Rule 0.1" "asphalt-\|core-\|WRONG\|❌"

check "brand-500 or brand-600 as text color (contrast failure)" \
  'text-\[var\(--color-brand-[56]' "Legacy WCAG Note"

echo ""

# ─── 2. OLD TOKEN NAMESPACE ──────────────────────────────────────────────────
echo -e "${BOLD}[2] Stale Token Names  (v1.3.3 namespace migration)${NC}"; echo ""

check "Old --color-background-* name — use --color-bg-*" \
  'var\(--color-background-(primary|secondary|tertiary|disabled|row-active|info|success|warning|danger)\)' \
  "Token Namespace v1.3.3"

check "Old --color-foreground-* name — use --color-text-*" \
  'var\(--color-foreground-(primary|secondary|tertiary|inverse|link|disabled)\)' \
  "Token Namespace v1.3.3"

check "Old --color-nav-background — use --color-bg-nav" \
  'var\(--color-nav-background\)' "Token Namespace v1.3.3"

check "Old --color-background-row-active — use --color-bg-row-active" \
  'var\(--color-background-row-active\)' "Token Namespace v1.3.3"

check "Old --color-border-active-row — use --color-border-row-active" \
  'var\(--color-border-active-row\)' "Token Namespace v1.3.3"

echo ""

# ─── 3. TYPOGRAPHY VIOLATIONS ───────────────────────────────────────────────
echo -e "${BOLD}[3] Typography Violations  (Legacy Type Ramp)${NC}"; echo ""

check "Font size outside 5-step ramp" \
  '\btext-(10|11|15|17|18|19|21|22|23)px\b|\btext-(xs|3xl|4xl|5xl)\b' \
  "Legacy Type Ramp"

check "Body text at 16px — legacy uses 14px (text-sm)" \
  'className=.*\btext-base\b' "Legacy Type Ramp" \
  "h1\|h2\|h3\|heading\|title\|WRONG\|❌"

check "Font weight outside permitted set" \
  'font-(thin|extralight|light|extrabold|black)\b' \
  "Legacy Type Ramp"

echo ""

# ─── 4. SPACING VIOLATIONS ──────────────────────────────────────────────────
echo -e "${BOLD}[4] Spacing Violations${NC}"; echo ""

check "Card/panel padding not p-4 (16px)" \
  '<div[^>]*(card|panel|Card|Panel)[^>]*className=[^>]*\bp-[^4 "]' \
  "Legacy Spacing" "p-4\|WRONG\|❌"

echo ""

# ─── 5. BORDER RADIUS VIOLATIONS ────────────────────────────────────────────
echo -e "${BOLD}[5] Border Radius Violations  (btn=4px, card=8px, badge=pill)${NC}"; echo ""

check "Non-canonical radius on button (must be rounded/4px)" \
  '<button[^>]*className=[^>]*(rounded-lg|rounded-xl|rounded-full|rounded-2xl)' \
  "Legacy Radius" "badge\|pill\|tag\|chip\|WRONG\|❌"

check "Non-canonical radius on input (must be rounded/4px)" \
  '<input[^>]*className=[^>]*(rounded-lg|rounded-xl|rounded-full)' \
  "Legacy Radius" "WRONG\|❌"

echo ""

# ─── 6. COMPONENT STYLE VIOLATIONS ──────────────────────────────────────────
echo -e "${BOLD}[6] Component Style Violations  (v1.3.2+ card · v1.3.3+ secondary button)${NC}"; echo ""

warn "Card with explicit border — shadow-sm only (v1.3.2+)" \
  'className=.*\bborder\b.*card|className=.*card.*\bborder\b' \
  "Remove border. Use shadow-[var(--shadow-sm)] for elevation." \
  "border-b\|border-t\|border-l\|card-header\|border-none\|WRONG\|❌"

check "Secondary button with border — gray ramp, no border (v1.3.3+)" \
  '(btn-secondary|ButtonSecondary)[^"]*\bborder\b[^-n]' \
  "Secondary Button v1.3.3" "border-none\|WRONG\|❌"

echo ""

# ─── 7. PATTERN VIOLATIONS ──────────────────────────────────────────────────
echo -e "${BOLD}[7] Pattern Component Violations  (Guidelines Rule 0.4)${NC}"; echo ""

pattern_hits=$(find "$TARGET" -name "*.tsx" -not -path "*/shared/patterns/*" 2>/dev/null \
  | xargs grep -l "isActive.*bg-\|isSelected.*bg-\|activeRow\|selectedRow" 2>/dev/null \
  | grep -v "rfi-table\|gold-standard\|spec")
if [ -n "$pattern_hits" ]; then
  echo -e "  ${RED}✗ VIOLATION${NC} — Custom table row state outside pattern component  [Rule 0.4]"
  echo "$pattern_hits" | while IFS= read -r f; do echo -e "      ${YELLOW}$f${NC}"; done
  echo ""; VIOLATIONS=$((VIOLATIONS + 1))
fi

check "Destructive action inside Popover" \
  "Popover.*[Dd]elete|[Dd]elete.*Popover|z-20.*[Dd]elete" \
  "FCC §2.4" "WRONG\|❌\|comment\|\/\/"

check "Save/Cancel on Data Entry Slide-Out" \
  "(onSave|handleSave).*z-30|SlideOut.*Save" \
  "FCC Rule 6.1" "Filter\|filter\|Config\|ManualSaveFooter"

echo ""

# ─── 8. ARCHITECTURE VIOLATIONS ─────────────────────────────────────────────
echo -e "${BOLD}[8] Architecture Violations${NC}"; echo ""

check "Non-canonical z-index value" \
  '\bz-(1|2|3|4|5|6|7|8|9|11|12|13|15|16|17|18|19|21|22|25|40|60|70|90|100)\b' \
  "Architecture RULE 3"

slideout_hits=$(grep -rn --include="*.tsx" \
  -E "z-30.*fixed inset-0|fixed inset-0.*z-30" \
  "$TARGET" 2>/dev/null | grep -v "WRONG\|❌\|Modal\|modal")
if [ -n "$slideout_hits" ]; then
  echo -e "  ${RED}✗ VIOLATION${NC} — Slide-Out uses fixed inset-0 (must be absolute, workspace-only)  [RULE 3]"
  echo "$slideout_hits" | head -5 | while IFS= read -r line; do echo -e "      ${YELLOW}$line${NC}"; done
  echo ""; VIOLATIONS=$((VIOLATIONS + 1))
fi

check "Grid/table in right pane" \
  "rightPane.*[Tt]able|rightPane.*[Gg]rid" \
  "Architecture RULE 3" "WRONG\|❌"

echo ""

# ─── RESULTS ────────────────────────────────────────────────────────────────
hr; echo ""
if [ "$VIOLATIONS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo -e "  ${GREEN}${BOLD}✓ ALL CHECKS PASSED${NC} — No violations found in ${TARGET}"
elif [ "$VIOLATIONS" -eq 0 ]; then
  echo -e "  ${YELLOW}${BOLD}⚠ $WARNINGS WARNING(S)${NC} — Review before merging"
  echo -e "  ${GREEN}✓ No hard violations found${NC}"
else
  echo -e "  ${RED}${BOLD}✗ $VIOLATIONS VIOLATION(S)${NC}  ${YELLOW}$WARNINGS WARNING(S)${NC}"
  echo ""
  echo -e "  ${BOLD}Violations block merge. Fix before submitting.${NC}"
  echo ""
  echo -e "  Layer issues → ${CYAN}references/CSS-LAYER-GUIDE.md${NC}"
  echo -e "  Token issues → ${CYAN}guidelines/Guidelines.md${NC}"
  echo -e "  Pattern issues → ${CYAN}guidelines/Pattern-Component-Library.md${NC}"
fi
echo ""; hr; echo ""

exit $((VIOLATIONS > 0 ? 1 : 0))
