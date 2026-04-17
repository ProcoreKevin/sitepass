export type SupportedLanguage =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "zh"
  | "ja"
  | "ko"
  | "hi"
  | "ar"
  | "sw"
  | "pt"
  | "mi"
  | "sm"

export type TranslationKey =
  | "home"
  | "project_timeline"
  | "latest_drawings"
  | "documents_tracking"
  | "assigned_open_items"
  | "todays_schedule"
  | "open_items"
  | "insights"
  | "financial_risk"
  | "rfi_turnaround"
  | "quick_create"
  | "team"
  | "links"
  | "favorite_tools"
  | "select_tool"
  | "vertigo_construction"
  | "search_placeholder"
  | "help"
  | "notifications"
  | "phase"
  | "complete"
  | "view_drawings"
  | "review"
  | "my_open_items"
  | "all_open_items"
  | "completed"
  | "list"
  | "map"
  | "go_to_budget"
  | "view_details"
  | "go_to_report"
  | "view_all_rfis"
  | "last_month"
  | "estimated_project_end"
  | "project_average"
  | "industry_average"
  | "progress"
  | "milestones"
  | "financial_summary"
  | "financial_summary_description"
  | "analyze"
  | "project_health"
  | "total"
  | "on_budget_on_schedule"
  | "on_budget_off_schedule"
  | "over_budget_on_schedule"
  | "over_budget_off_schedule"
  | "recent_drawings"
  | "see_all"
  | "revision"
  | "architectural"
  | "issued_for_construction"
  | "published"
  | "area"
  | "set"
  | "status"
  | "date_created"
  | "overdue"
  | "due_today"
  | "due_soon"
  | "due_later"
  | "no_due_date"
  | "quick_filter"
  | "type"
  | "item"
  | "due_date"
  | "view_item"
  | "page"
  | "job_cost_to_date"
  | "invoiced_to_date"
  | "budget_forecast"
  | "projected_costs"
  | "free_cash_flow"
  | "total_committed"
  | "forecast_to_complete"
  | "projected_roi"
  | "appearance"
  | "switch_project"
  | "select_tool_placeholder"
  | "quick_search_ai_assistance"
  | "no_favorite_tools"
  | "commitments"
  | "export"
  | "create"
  | "contracts"
  | "recycle_bin"
  | "search"
  | "filters"
  | "select_column_to_group"
  | "contract_company"
  | "number"
  | "title"
  | "erp_status"
  | "executed"
  | "ssov_status"
  | "original_contract_amount"
  | "approved_change_orders"
  | "grand_totals"
  | "draft"
  | "approved"
  | "yes"
  | "no"

const baseTranslations = {
  home: "Home",
  project_timeline: "Project Timeline",
  latest_drawings: "Latest Drawings",
  documents_tracking: "Documents You're Tracking",
  assigned_open_items: "Assigned Open Items",
  todays_schedule: "Today's Schedule",
  open_items: "Open Items",
  insights: "Insights",
  financial_risk: "Financial Risk of General Condition Funds",
  rfi_turnaround: "Average RFI Turnaround",
  quick_create: "Quick Create",
  team: "Team",
  links: "Links",
  favorite_tools: "Favorite Tools",
  select_tool: "Select Tool",
  vertigo_construction: "Vertigo Construction",
  search_placeholder: "Ask Assist anything",
  help: "Help",
  notifications: "Notifications",
  phase: "Phase",
  complete: "COMPLETE",
  view_drawings: "View Drawings",
  review: "Review",
  my_open_items: "My Open Items",
  all_open_items: "All Open Items",
  completed: "Completed",
  list: "List",
  map: "Map",
  go_to_budget: "Go to Budget",
  view_details: "View Details",
  go_to_report: "Go to Report",
  view_all_rfis: "View all RFIs",
  last_month: "Last Month",
  estimated_project_end: "Estimated Project End",
  project_average: "Project Average",
  industry_average: "Industry Average",
  progress: "Progress",
  milestones: "Milestones",
  financial_summary: "Financial Summary",
  financial_summary_description:
    "Understand the collective performance of all your construction investments at a glance",
  analyze: "Analyze",
  project_health: "Project Health",
  total: "Total",
  on_budget_on_schedule: "On Budget, On Schedule",
  on_budget_off_schedule: "On Budget, Off Schedule",
  over_budget_on_schedule: "Over Budget, On Schedule",
  over_budget_off_schedule: "Over Budget, Off Schedule",
  recent_drawings: "Recent Drawings",
  see_all: "See All",
  revision: "REVISION",
  architectural: "Architectural",
  issued_for_construction: "Issued For Construction",
  published: "Published",
  area: "Area",
  set: "Set",
  status: "Status",
  date_created: "Date Created",
  overdue: "Overdue",
  due_today: "Due Today",
  due_soon: "Due Soon",
  due_later: "Due Later",
  no_due_date: "No Due Date",
  quick_filter: "Quick Filter",
  type: "Type",
  item: "Item",
  due_date: "Due Date",
  view_item: "View Item",
  page: "Page",
  job_cost_to_date: "Job Cost To-date",
  invoiced_to_date: "Invoiced to-date",
  budget_forecast: "Budget Forecast",
  projected_costs: "Projected Costs",
  free_cash_flow: "Free Cash Flow",
  total_committed: "Total Committed",
  forecast_to_complete: "Forecast to complete",
  projected_roi: "Projected ROI",
  appearance: "Appearance",
  switch_project: "Switch Project",
  select_tool_placeholder: "Select a tool to get started",
  quick_search_ai_assistance: "Quick search and AI assistance",
  no_favorite_tools: "No favorite tools yet. Add tools from the menu.",
  commitments: "Commitments",
  export: "Export",
  create: "Create",
  contracts: "Contracts",
  recycle_bin: "Recycle Bin",
  search: "Search",
  filters: "Filters",
  select_column_to_group: "Select a column to group",
  contract_company: "Contract Company",
  number: "Number",
  title: "Title",
  erp_status: "ERP Status",
  executed: "Executed",
  ssov_status: "SSOV Status",
  original_contract_amount: "Original Contract Amount",
  approved_change_orders: "Approved Change Orders",
  grand_totals: "Grand Totals",
  draft: "Draft",
  approved: "Approved",
  yes: "Yes",
  no: "No",
}

export const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  en: { ...baseTranslations },
  es: {
    home: "Inicio",
    project_timeline: "Cronología del Proyecto",
    latest_drawings: "Últimos Planos",
    documents_tracking: "Documentos que Estás Rastreando",
    assigned_open_items: "Elementos Abiertos Asignados",
    todays_schedule: "Horario de Hoy",
    open_items: "Elementos Abiertos",
    insights: "Perspectivas",
    financial_risk: "Riesgo Financiero de Fondos de Condición General",
    rfi_turnaround: "Tiempo Promedio de Respuesta RFI",
    quick_create: "Crear Rápido",
    team: "Equipo",
    links: "Enlaces",
    favorite_tools: "Herramientas Favoritas",
    select_tool: "Seleccionar Herramienta",
    vertigo_construction: "Vertigo Construcción",
    search_placeholder: "Pregunta a Assist cualquier cosa",
    help: "Ayuda",
    notifications: "Notificaciones",
    phase: "Fase",
    complete: "COMPLETO",
    view_drawings: "Ver Planos",
    review: "Revisar",
    my_open_items: "Mis Elementos Abiertos",
    all_open_items: "Todos los Elementos Abiertos",
    completed: "Completado",
    list: "Lista",
    map: "Mapa",
    go_to_budget: "Ir al Presupuesto",
    view_details: "Ver Detalles",
    go_to_report: "Ir al Informe",
    view_all_rfis: "Ver todos los RFIs",
    last_month: "Mes Pasado",
    estimated_project_end: "Fin Estimado del Proyecto",
    project_average: "Promedio del Proyecto",
    industry_average: "Promedio de la Industria",
    progress: "Progreso",
    milestones: "Hitos",
    financial_summary: "Resumen Financiero",
    financial_summary_description:
      "Comprenda el rendimiento colectivo de todas sus inversiones en construcción de un vistazo",
    analyze: "Analizar",
    project_health: "Salud del Proyecto",
    total: "Total",
    on_budget_on_schedule: "Dentro del Presupuesto, A Tiempo",
    on_budget_off_schedule: "Dentro del Presupuesto, Retrasado",
    over_budget_on_schedule: "Sobre Presupuesto, A Tiempo",
    over_budget_off_schedule: "Sobre Presupuesto, Retrasado",
    recent_drawings: "Planos Recientes",
    see_all: "Ver Todo",
    revision: "REVISIÓN",
    architectural: "Arquitectónico",
    issued_for_construction: "Emitido para Construcción",
    published: "Publicado",
    area: "Área",
    set: "Conjunto",
    status: "Estado",
    date_created: "Fecha de Creación",
    overdue: "Vencido",
    due_today: "Vence Hoy",
    due_soon: "Vence Pronto",
    due_later: "Vence Más Tarde",
    no_due_date: "Sin Fecha de Vencimiento",
    quick_filter: "Filtro Rápido",
    type: "Tipo",
    item: "Elemento",
    due_date: "Fecha de Vencimiento",
    view_item: "Ver Elemento",
    page: "Página",
    job_cost_to_date: "Costo del Trabajo a la Fecha",
    invoiced_to_date: "Facturado a la Fecha",
    budget_forecast: "Pronóstico del Presupuesto",
    projected_costs: "Costos Proyectados",
    free_cash_flow: "Flujo de Caja Libre",
    total_committed: "Total Comprometido",
    forecast_to_complete: "Pronóstico para Completar",
    projected_roi: "ROI Proyectado",
    appearance: "Apariencia",
    switch_project: "Cambiar Proyecto",
    select_tool_placeholder: "Selecciona una herramienta para comenzar",
    quick_search_ai_assistance: "Búsqueda rápida y asistencia de IA",
    no_favorite_tools: "Aún no hay herramientas favoritas. Agrega herramientas desde el menú.",
    commitments: "Compromisos",
    export: "Exportar",
    create: "Crear",
    contracts: "Contratos",
    recycle_bin: "Basura",
    search: "Buscar",
    filters: "Filtros",
    select_column_to_group: "Selecciona una columna para agrupar",
    contract_company: "Compañía de Contrato",
    number: "Número",
    title: "Título",
    erp_status: "Estado ERP",
    executed: "Ejecutado",
    ssov_status: "Estado SSOV",
    original_contract_amount: "Monto Original del Contrato",
    approved_change_orders: "Pedidos de Cambio Aprobados",
    grand_totals: "Grand Totales",
    draft: "Borrador",
    approved: "Aprobado",
    yes: "Sí",
    no: "No",
  },
  fr: {
    home: "Accueil",
    project_timeline: "Chronologie du Projet",
    latest_drawings: "Derniers Plans",
    documents_tracking: "Documents que Vous Suivez",
    assigned_open_items: "Éléments Ouverts Assignés",
    todays_schedule: "Programme d'Aujourd'hui",
    open_items: "Éléments Ouverts",
    insights: "Aperçus",
    financial_risk: "Risque Financier des Fonds de Condition Générale",
    rfi_turnaround: "Délai Moyen de Réponse RFI",
    quick_create: "Création Rapide",
    team: "Équipe",
    links: "Liens",
    favorite_tools: "Outils Favoris",
    select_tool: "Sélectionner un Outil",
    vertigo_construction: "Vertigo Construction",
    search_placeholder: "Demandez à Assist n'importe quoi",
    help: "Aide",
    notifications: "Notifications",
    phase: "Phase",
    complete: "TERMINÉ",
    view_drawings: "Voir les Plans",
    review: "Réviser",
    my_open_items: "Mes Éléments Ouverts",
    all_open_items: "Tous les Éléments Ouverts",
    completed: "Terminé",
    list: "Liste",
    map: "Carte",
    go_to_budget: "Aller au Budget",
    view_details: "Voir les Détails",
    go_to_report: "Aller au Rapport",
    view_all_rfis: "Voir tous les RFIs",
    last_month: "Mois Dernier",
    estimated_project_end: "Fin Estimée du Projet",
    project_average: "Moyenne du Projet",
    industry_average: "Moyenne de l'Industrie",
    progress: "Progrès",
    milestones: "Jalons",
    financial_summary: "Résumé Financier",
    financial_summary_description:
      "Comprenez la performance collective de tous vos investissements en construction en un coup d'œil",
    analyze: "Analyser",
    project_health: "Santé du Projet",
    total: "Total",
    on_budget_on_schedule: "Dans le Budget, À l'Heure",
    on_budget_off_schedule: "Dans le Budget, En Retard",
    over_budget_on_schedule: "Hors Budget, À l'Heure",
    over_budget_off_schedule: "Hors Budget, En Retard",
    recent_drawings: "Plans Récents",
    see_all: "Voir Tout",
    revision: "RÉVISION",
    architectural: "Architectural",
    issued_for_construction: "Émis pour Construction",
    published: "Publié",
    area: "Zone",
    set: "Ensemble",
    status: "Statut",
    date_created: "Date de Création",
    overdue: "En Retard",
    due_today: "Dû Aujourd'hui",
    due_soon: "Dû Bientôt",
    due_later: "Dû Plus Tard",
    no_due_date: "Pas de Date d'Échéance",
    quick_filter: "Filtre Rapide",
    type: "Type",
    item: "Élément",
    due_date: "Date d'Échéance",
    view_item: "Voir l'Élément",
    page: "Page",
    job_cost_to_date: "Coût du Travail à ce Jour",
    invoiced_to_date: "Facturé à ce Jour",
    budget_forecast: "Prévision Budgétaire",
    projected_costs: "Coûts Projetés",
    free_cash_flow: "Flux de Trésorerie Disponible",
    total_committed: "Total Engagé",
    forecast_to_complete: "Prognose bis Fertigstellung",
    projected_roi: "ROI Projeté",
    appearance: "Apparence",
    switch_project: "Changer de Projet",
    select_tool_placeholder: "Sélectionnez un outil pour commencer",
    quick_search_ai_assistance: "Recherche rapide et assistance IA",
    no_favorite_tools: "Pas encore d'outils favoris. Ajoutez des outils depuis le menu.",
    commitments: "Engagements",
    export: "Exporter",
    create: "Créer",
    contracts: "Contrats",
    recycle_bin: "Corbeille",
    search: "Rechercher",
    filters: "Filtres",
    select_column_to_group: "Sélectionnez une colonne pour regrouper",
    contract_company: "Entreprise Contractuelle",
    number: "Numéro",
    title: "Titre",
    erp_status: "Statut ERP",
    executed: "Exécuté",
    ssov_status: "Statut SSOV",
    original_contract_amount: "Montant Original du Contrat",
    approved_change_orders: "Commandes de Changement Approuvées",
    grand_totals: "Grand Totals",
    draft: "Brouillon",
    approved: "Approuvé",
    yes: "Oui",
    no: "Non",
  },
  de: {
    home: "Startseite",
    project_timeline: "Projektzeitplan",
    latest_drawings: "Neueste Zeichnungen",
    documents_tracking: "Dokumente, die Sie Verfolgen",
    assigned_open_items: "Zugewiesene Offene Punkte",
    todays_schedule: "Heutiger Zeitplan",
    open_items: "Offene Punkte",
    insights: "Einblicke",
    financial_risk: "Finanzielles Risiko der Allgemeinen Bedingungsfonds",
    rfi_turnaround: "Durchschnittliche RFI-Bearbeitungszeit",
    quick_create: "Schnell Erstellen",
    team: "Team",
    links: "Links",
    favorite_tools: "Lieblingswerkzeuge",
    select_tool: "Werkzeug Auswählen",
    vertigo_construction: "Vertigo Bau",
    search_placeholder: "Fragen Sie Assist alles",
    help: "Hilfe",
    notifications: "Benachrichtigungen",
    phase: "Phase",
    complete: "ABGESCHLOSSEN",
    view_drawings: "Zeichnungen Ansehen",
    review: "Überprüfen",
    my_open_items: "Meine Offenen Punkte",
    all_open_items: "Alle Offenen Punkte",
    completed: "Abgeschlossen",
    list: "Liste",
    map: "Karte",
    go_to_budget: "Zum Budget Gehen",
    view_details: "Details Ansehen",
    go_to_report: "Zum Bericht Gehen",
    view_all_rfis: "Alle RFIs Ansehen",
    last_month: "Letzter Monat",
    estimated_project_end: "Geschätztes Projektende",
    project_average: "Projektdurchschnitt",
    industry_average: "Branchendurchschnitt",
    progress: "Fortschritt",
    milestones: "Meilensteine",
    financial_summary: "Finanzübersicht",
    financial_summary_description: "Verstehen Sie die kollektive Leistung aller Ihrer Bauinvestitionen auf einen Blick",
    analyze: "Analysieren",
    project_health: "Projektgesundheit",
    total: "Gesamt",
    on_budget_on_schedule: "Im Budget, Pünktlich",
    on_budget_off_schedule: "Im Budget, Verspätet",
    over_budget_on_schedule: "Über Budget, Pünktlich",
    over_budget_off_schedule: "Über Budget, Verspätet",
    recent_drawings: "Neueste Zeichnungen",
    see_all: "Alle Anzeigen",
    revision: "REVISION",
    architectural: "Architektonisch",
    issued_for_construction: "Für Bau Ausgegeben",
    published: "Veröffentlicht",
    area: "Bereich",
    set: "Satz",
    status: "Statut",
    date_created: "Erstellungsdatum",
    overdue: "Überfällig",
    due_today: "Heute Fällig",
    due_soon: "Bald Fällig",
    due_later: "Später Fällig",
    no_due_date: "Kein Fälligkeitsdatum",
    quick_filter: "Schnellfilter",
    type: "Typ",
    item: "Element",
    due_date: "Fälligkeitsdatum",
    view_item: "Element Ansehen",
    page: "Seite",
    job_cost_to_date: "Arbeitskosten bis Heute",
    invoiced_to_date: "Fakturiert bis Heute",
    budget_forecast: "Budgetprognose",
    projected_costs: "Prognostizierte Kosten",
    free_cash_flow: "Freier Cashflow",
    total_committed: "Gesamt Verpflichtet",
    forecast_to_complete: "Prognose bis Fertigstellung",
    projected_roi: "Prognostizierter ROI",
    appearance: "Erscheinungsbild",
    switch_project: "Projekt Wechseln",
    select_tool_placeholder: "Wählen Sie ein Werkzeug zum Starten",
    quick_search_ai_assistance: "Schnellsuche und KI-Unterstützung",
    no_favorite_tools: "Noch keine Lieblingswerkzeuge. Fügen Sie Werkzeuge aus dem Menü hinzu.",
    commitments: "Verpflichtungen",
    export: "Exportieren",
    create: "Erstellen",
    contracts: "Verträge",
    recycle_bin: "Papierkorb",
    search: "Suchen",
    filters: "Filter",
    select_column_to_group: "Wählen Sie eine Spalte zum Gruppieren",
    contract_company: "Vertragsfirma",
    number: "Nummer",
    title: "Titel",
    erp_status: "ERP-Status",
    executed: "Ausgeführt",
    ssov_status: "SSOV-Status",
    original_contract_amount: "Ursprünglicher Vertragsbetrag",
    approved_change_orders: "Genehmigte Änderungsbestellungen",
    grand_totals: "Große Gesamtsummen",
    draft: "Entwurf",
    approved: "Genehmigt",
    yes: "Ja",
    no: "Nein",
  },
  zh: {
    home: "主页",
    project_timeline: "项目时间表",
    latest_drawings: "最新图纸",
    documents_tracking: "您正在跟踪的文档",
    assigned_open_items: "分配的待办事项",
    todays_schedule: "今日日程",
    open_items: "待办事项",
    insights: "洞察",
    financial_risk: "一般条件资金的财务风险",
    rfi_turnaround: "平均RFI周转时间",
    quick_create: "快速创建",
    team: "团队",
    links: "链接",
    favorite_tools: "收藏工具",
    select_tool: "选择工具",
    vertigo_construction: "Vertigo建筑",
    search_placeholder: "向Assist询问任何问题",
    help: "帮助",
    notifications: "通知",
    phase: "阶段",
    complete: "完成",
    view_drawings: "查看图纸",
    review: "审查",
    my_open_items: "我的待办事项",
    all_open_items: "所有待办事项",
    completed: "已完成",
    list: "列表",
    map: "地图",
    go_to_budget: "转到预算",
    view_details: "查看详情",
    go_to_report: "转到报告",
    view_all_rfis: "查看所有RFI",
    last_month: "上个月",
    estimated_project_end: "预计项目结束",
    project_average: "项目平均",
    industry_average: "行业平均",
    progress: "进度",
    milestones: "里程碑",
    financial_summary: "财务摘要",
    financial_summary_description: "一目了然地了解所有建筑投资的整体表现",
    analyze: "分析",
    project_health: "项目健康",
    total: "总计",
    on_budget_on_schedule: "预算内，按时",
    on_budget_off_schedule: "预算内，延迟",
    over_budget_on_schedule: "超预算，按时",
    over_budget_off_schedule: "超预算，延迟",
    recent_drawings: "最近图纸",
    see_all: "查看全部",
    revision: "修订",
    architectural: "建筑",
    issued_for_construction: "已发布用于施工",
    published: "已发布",
    area: "区域",
    set: "集合",
    status: "状态",
    date_created: "创建日期",
    overdue: "逾期",
    due_today: "今天到期",
    due_soon: "即将到期",
    due_later: "稍后到期",
    no_due_date: "无到期日期",
    quick_filter: "快速筛选",
    type: "类型",
    item: "项目",
    due_date: "到期日期",
    view_item: "查看项目",
    page: "页面",
    job_cost_to_date: "截至目前的工作成本",
    invoiced_to_date: "截至目前的发票",
    budget_forecast: "预算预测",
    projected_costs: "预计成本",
    free_cash_flow: "自由现金流",
    total_committed: "总承诺",
    forecast_to_complete: "完成预测",
    projected_roi: "预计投资回报率",
    appearance: "外观",
    switch_project: "切换项目",
    select_tool_placeholder: "选择一个工具开始",
    quick_search_ai_assistance: "快速搜索和AI辅助",
    no_favorite_tools: "还没有收藏的工具。从菜单中添加工具。",
    commitments: "承诺",
    export: "导出",
    create: "创建",
    contracts: "合同",
    recycle_bin: "回收站",
    search: "搜索",
    filters: "过滤器",
    select_column_to_group: "选择列进行分组",
    contract_company: "合同公司",
    number: "编号",
    title: "标题",
    erp_status: "ERP状态",
    executed: "已执行",
    ssov_status: "SSOV状态",
    original_contract_amount: "原始合同金额",
    approved_change_orders: "批准的变更订单",
    grand_totals: "总计",
    draft: "草稿",
    approved: "已批准",
    yes: "是",
    no: "否",
  },
  it: { ...baseTranslations },
  ja: { ...baseTranslations },
  ko: { ...baseTranslations },
  hi: { ...baseTranslations },
  ar: { ...baseTranslations },
  sw: { ...baseTranslations },
  pt: { ...baseTranslations },
  mi: { ...baseTranslations },
  sm: { ...baseTranslations },
}
