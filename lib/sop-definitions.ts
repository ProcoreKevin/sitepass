/**
 * SOP (Standard Operating Procedure) Definitions
 * 
 * Defines workflow trigger rules and automation suggestions for context-aware
 * Assist Panel functionality. Each SOP maps a tool context to suggested actions.
 */

export interface SOPAction {
  id: string
  label: string
  description: string
  targetTool: string
  targetHref: string
  priority: 'high' | 'medium' | 'low'
}

export interface SOPDefinition {
  id: string
  name: string
  triggerTools: string[] // Tool paths that trigger this SOP
  prompts: string[] // Proactive prompts to show in Assist
  actions: SOPAction[] // Suggested actions user can take
  relatedTools: string[] // Other tools commonly used in this workflow
}

export const SOP_DEFINITIONS: Record<string, SOPDefinition> = {
  'submittal-review': {
    id: 'submittal-review',
    name: 'Submittal Review Workflow',
    triggerTools: ['/specifications', '/submittals'],
    prompts: [
      "Would you like me to help create Submittals from these specifications?",
      "I can suggest which specs require submittal packages and recommend assignees.",
      "Ready to track submittal status and approval workflow?"
    ],
    actions: [
      {
        id: 'create-submittal',
        label: 'Create Submittal',
        description: 'Generate a new submittal package from current specification',
        targetTool: 'Submittals',
        targetHref: '/submittals/new',
        priority: 'high'
      },
      {
        id: 'view-spec-submittals',
        label: 'View Related Submittals',
        description: 'See all submittals linked to this specification section',
        targetTool: 'Submittals',
        targetHref: '/submittals',
        priority: 'medium'
      }
    ],
    relatedTools: ['/drawings', '/rfis']
  },

  'invoice-approval': {
    id: 'invoice-approval',
    name: 'Invoice Approval Workflow',
    triggerTools: ['/commitments', '/invoicing', '/direct-costs'],
    prompts: [
      "Ready to invite the subcontractor to bill against this commitment?",
      "I can help track the invoice approval workflow and ERP sync status.",
      "Would you like to review pending invoices for this commitment?"
    ],
    actions: [
      {
        id: 'create-invoice',
        label: 'Create Invoice Request',
        description: 'Generate invoice request from commitment line items',
        targetTool: 'Invoicing',
        targetHref: '/invoicing/new',
        priority: 'high'
      },
      {
        id: 'view-payment-status',
        label: 'Check Payment Status',
        description: 'View payment history and pending amounts',
        targetTool: 'Pay',
        targetHref: '/pay',
        priority: 'medium'
      },
      {
        id: 'sync-erp',
        label: 'Sync to ERP',
        description: 'Push approved invoice to connected ERP system',
        targetTool: 'ERP Integrations',
        targetHref: '/erp-integrations',
        priority: 'low'
      }
    ],
    relatedTools: ['/budget', '/change-orders']
  },

  'drawing-revision': {
    id: 'drawing-revision',
    name: 'Drawing Revision Workflow',
    triggerTools: ['/drawings', '/bim-models'],
    prompts: [
      "I noticed you've added a markup. Would you like to create an RFI from this?",
      "I can help track the change management workflow from RFI to Change Order.",
      "Ready to issue a new drawing revision to the team?"
    ],
    actions: [
      {
        id: 'create-rfi',
        label: 'Create RFI',
        description: 'Generate RFI from drawing markup or question',
        targetTool: 'RFIs',
        targetHref: '/rfis/new',
        priority: 'high'
      },
      {
        id: 'create-coordination-issue',
        label: 'Log Coordination Issue',
        description: 'Track clash or coordination conflict for resolution',
        targetTool: 'Coordination Issues',
        targetHref: '/coordination-issues/new',
        priority: 'high'
      },
      {
        id: 'distribute-revision',
        label: 'Distribute Revision',
        description: 'Send updated drawing to project stakeholders',
        targetTool: 'Transmittals',
        targetHref: '/transmittals/new',
        priority: 'medium'
      }
    ],
    relatedTools: ['/submittals', '/change-events']
  },

  'safety-incident': {
    id: 'safety-incident',
    name: 'Safety Incident Workflow',
    triggerTools: ['/incidents', '/observations', '/inspections'],
    prompts: [
      "Should I help log this incident in the Daily Log?",
      "I can create a Safety Observation to track corrective actions.",
      "Would you like to generate an incident report for stakeholders?"
    ],
    actions: [
      {
        id: 'create-observation',
        label: 'Create Safety Observation',
        description: 'Document safety concern with photos and corrective actions',
        targetTool: 'Observations',
        targetHref: '/observations/new',
        priority: 'high'
      },
      {
        id: 'log-daily',
        label: 'Add to Daily Log',
        description: 'Record incident in today\'s daily log entry',
        targetTool: 'Daily Log',
        targetHref: '/daily-log',
        priority: 'high'
      },
      {
        id: 'create-action-plan',
        label: 'Create Action Plan',
        description: 'Define corrective action steps and assignments',
        targetTool: 'Action Plans',
        targetHref: '/action-plans/new',
        priority: 'medium'
      }
    ],
    relatedTools: ['/photos', '/forms']
  },

  'change-management': {
    id: 'change-management',
    name: 'Change Management Workflow',
    triggerTools: ['/change-events', '/change-orders', '/rfis'],
    prompts: [
      "This RFI may have cost or schedule impact. Would you like to create a Change Event?",
      "I can help track the approval chain for this change order.",
      "Ready to link this change to affected budget line items?"
    ],
    actions: [
      {
        id: 'create-change-event',
        label: 'Create Change Event',
        description: 'Document potential change with impact assessment',
        targetTool: 'Change Events',
        targetHref: '/change-events/new',
        priority: 'high'
      },
      {
        id: 'create-change-order',
        label: 'Create Change Order',
        description: 'Formalize change with cost and schedule adjustments',
        targetTool: 'Change Orders',
        targetHref: '/change-orders/new',
        priority: 'high'
      },
      {
        id: 'update-budget',
        label: 'Update Budget',
        description: 'Reflect change in project budget forecast',
        targetTool: 'Budget',
        targetHref: '/budget',
        priority: 'medium'
      }
    ],
    relatedTools: ['/commitments', '/schedule']
  },

  'field-documentation': {
    id: 'field-documentation',
    name: 'Field Documentation Workflow',
    triggerTools: ['/daily-log', '/photos', '/punch-list'],
    prompts: [
      "Would you like to attach these photos to today's Daily Log?",
      "I can help create punch list items from your field observations.",
      "Ready to generate a progress report from recent field data?"
    ],
    actions: [
      {
        id: 'add-to-daily-log',
        label: 'Add to Daily Log',
        description: 'Include photos and notes in daily documentation',
        targetTool: 'Daily Log',
        targetHref: '/daily-log',
        priority: 'high'
      },
      {
        id: 'create-punch-item',
        label: 'Create Punch Item',
        description: 'Log deficiency or incomplete work item',
        targetTool: 'Punch List',
        targetHref: '/punch-list/new',
        priority: 'medium'
      },
      {
        id: 'generate-report',
        label: 'Generate Report',
        description: 'Create summary report from field documentation',
        targetTool: 'Reports',
        targetHref: '/reports',
        priority: 'low'
      }
    ],
    relatedTools: ['/inspections', '/observations']
  },

  'meeting-coordination': {
    id: 'meeting-coordination',
    name: 'Meeting Coordination Workflow',
    triggerTools: ['/meetings', '/schedule'],
    prompts: [
      "Would you like me to help create action items from this meeting?",
      "I can distribute meeting minutes to attendees.",
      "Ready to schedule follow-up meetings for open items?"
    ],
    actions: [
      {
        id: 'create-tasks',
        label: 'Create Action Items',
        description: 'Generate tasks from meeting discussion items',
        targetTool: 'Tasks',
        targetHref: '/tasks/new',
        priority: 'high'
      },
      {
        id: 'send-minutes',
        label: 'Distribute Minutes',
        description: 'Email meeting minutes to attendees and stakeholders',
        targetTool: 'Correspondence',
        targetHref: '/correspondence/new',
        priority: 'medium'
      },
      {
        id: 'update-schedule',
        label: 'Update Schedule',
        description: 'Reflect discussed changes in project schedule',
        targetTool: 'Schedule',
        targetHref: '/schedule',
        priority: 'medium'
      }
    ],
    relatedTools: ['/conversations', '/action-plans']
  }
}

/**
 * Get applicable SOP based on current tool path
 */
export function getSOPForTool(pathname: string): SOPDefinition | null {
  for (const sop of Object.values(SOP_DEFINITIONS)) {
    if (sop.triggerTools.some(tool => pathname.startsWith(tool))) {
      return sop
    }
  }
  return null
}

/**
 * Get random prompt from SOP for variety
 */
export function getRandomSOPPrompt(sop: SOPDefinition): string {
  const index = Math.floor(Math.random() * sop.prompts.length)
  return sop.prompts[index]
}

/**
 * Get high-priority actions from SOP
 */
export function getHighPriorityActions(sop: SOPDefinition): SOPAction[] {
  return sop.actions.filter(action => action.priority === 'high')
}

/**
 * Filter System Types
 * 
 * Core filter system architecture as defined in:
 * /guidelines/Filter-System-Implementation.md
 * 
 * Filter Principles (MANDATORY):
 * - Principle 1: AND Across Fields (narrows results - intersection logic)
 * - Principle 2: OR Within Fields (broadens results - union logic)
 * - Principle 3: Permissions Are Silent Pre-Filters
 */

export type FilterOperator = 
  | 'is_any_of' 
  | 'is_none_of' 
  | 'is' 
  | 'is_me' 
  | 'is_my_company' 
  | 'before' 
  | 'after' 
  | 'between' 
  | 'is_today' 
  | 'this_week' 
  | 'this_month' 
  | 'is_overdue'

export interface FilterValue {
  field: string           // e.g., 'type', 'status', 'discipline'
  label: string           // Human-readable: 'Type', 'Status', 'Discipline'
  operator: FilterOperator
  values: string[]        // Selected values: ['Drawing', 'RFI']
  isDynamic?: boolean     // For filters like "Me", "Today"
  isLocked?: boolean      // For Standard View locked filters
}

/**
 * Dynamic Filter Values
 * These resolve at render time, not at save time
 */
export const DYNAMIC_FILTER_VALUES = {
  ME: 'me',               // Resolves to current user
  MY_COMPANY: 'my_company', // Resolves to current user's company
  TODAY: 'today',         // Resolves to current date
  THIS_WEEK: 'this_week', // Resolves to current Mon-Sun window
  OVERDUE: 'overdue',     // Resolves to Due Date < today AND Status != Approved
  EXPIRING_SOON: 'expiring_soon', // Resolves to expiration within N days
} as const

/**
 * Minor vs Major Change Classification
 * 
 * Minor changes (no save prompt, persist silently):
 * - Sort column change
 * - Sort direction change
 * - Column show/hide
 * - Column reorder
 * 
 * Major changes (trigger unsaved changes banner):
 * - Any filter added/removed/modified
 * - Display type change
 * - Group by change
 */
export type ViewChangeType = 'minor' | 'major'

export function classifyViewChange(changeType: string): ViewChangeType {
  const minorChanges = ['sort_column', 'sort_direction', 'column_visibility', 'column_order']
  return minorChanges.includes(changeType) ? 'minor' : 'major'
}

/**
 * User roles for context-aware suggestions
 * 
 * Extended with form action permissions per:
 * /guidelines/Form-Creation-Checklist.md (Section 2.4, 3.5)
 */
export type UserRole = 
  | 'superintendent'
  | 'project-manager'
  | 'financial-admin'
  | 'subcontractor'
  | 'architect'
  | 'owner'

/**
 * Form Role Taxonomy
 * 
 * Defines what actions each role can perform on forms.
 * See: /guidelines/Form-Creation-Checklist.md Section 3.5
 */
export type FormRole = 'author' | 'reviewer' | 'controller' | 'consumer'

export interface FormRolePermissions {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean  // Only drafts for author
  canVoid: boolean    // Controllers only
  canRespond: boolean // Reviewers
  canReassign: boolean // Controllers
}

export const FORM_ROLE_PERMISSIONS: Record<FormRole, FormRolePermissions> = {
  author: {
    canCreate: true,
    canEdit: true,
    canDelete: true, // Only own drafts
    canVoid: false,
    canRespond: false,
    canReassign: false,
  },
  reviewer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canVoid: false,
    canRespond: true,
    canReassign: false,
  },
  controller: {
    canCreate: true,
    canEdit: true,
    canDelete: true, // Within managed set
    canVoid: true,
    canRespond: true,
    canReassign: true,
  },
  consumer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canVoid: false,
    canRespond: false,
    canReassign: false,
  },
}

/**
 * Role-specific entry points and suggested tools
 */
export const ROLE_ENTRY_VECTORS: Record<UserRole, { primaryTools: string[]; suggestedCategory: string }> = {
  'superintendent': {
    primaryTools: ['/daily-log', '/inspections', '/punch-list', '/photos'],
    suggestedCategory: 'field-design'
  },
  'project-manager': {
    primaryTools: ['/rfis', '/submittals', '/schedule', '/meetings'],
    suggestedCategory: 'project-coordination'
  },
  'financial-admin': {
    primaryTools: ['/budget', '/invoicing', '/commitments', '/change-orders'],
    suggestedCategory: 'financials-contracts'
  },
  'subcontractor': {
    primaryTools: ['/timesheets', '/daily-log', '/tm-tickets', '/invoicing'],
    suggestedCategory: 'resources'
  },
  'architect': {
    primaryTools: ['/drawings', '/rfis', '/submittals', '/coordination-issues'],
    suggestedCategory: 'field-design'
  },
  'owner': {
    primaryTools: ['/budget', '/reports', '/schedule', '/photos'],
    suggestedCategory: 'administration'
  }
}
