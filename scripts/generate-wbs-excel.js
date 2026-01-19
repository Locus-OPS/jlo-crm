const XLSX = require('xlsx');

// WBS Data
const summaryData = [
  ['JLO CRM - Work Breakdown Structure (WBS)', '', '', '', '', '', ''],
  ['Project: JLO CRM Implementation', '', '', '', '', '', ''],
  ['Date: ' + new Date().toLocaleDateString('th-TH'), '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['Module', 'Components', 'Services', 'APIs', 'Complexity', 'Story Points (Min)', 'Story Points (Max)'],
  ['Customer', 8, 2, 22, 'HIGH', 85, 110],
  ['Case', 5, 4, 25, 'MEDIUM-HIGH', 48, 58],
  ['Knowledge Base (KB)', 13, 4, 21, 'MEDIUM-HIGH', 45, 55],
  ['Dashboard', 1, 1, 6, 'MEDIUM', 15, 20],
  ['Consulting', 3, 3, 8, 'MEDIUM', 20, 28],
  ['System', 22, 16, 54, 'HIGH', 120, 145],
  ['Shared/Infrastructure', 10, 5, 20, 'MEDIUM', 53, 79],
  ['', '', '', '', '', '', ''],
  ['Total Development', 62, 35, 156, '', 386, 495],
  ['Testing (+25%)', '', '', '', '', 97, 124],
  ['Documentation (+10%)', '', '', '', '', 39, 50],
  ['Grand Total', '', '', '', '', 522, 669],
];

// Customer Module WBS
const customerWBS = [
  ['CUSTOMER MODULE - Work Breakdown Structure', '', '', '', '', ''],
  ['Total Story Points: 85-110', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['WBS ID', 'Task Name', 'Description', 'Complexity', 'Points (Min)', 'Points (Max)'],
  ['1', 'Customer Module', '', '', 85, 110],
  ['1.1', 'Customer List Page', 'ค้นหา/แสดงรายชื่อลูกค้า + Pagination', 'MEDIUM', 12, 15],
  ['1.1.1', 'Search Form', 'ฟอร์มค้นหา 6+ fields (firstName, lastName, citizenId, etc.)', 'LOW', 3, 4],
  ['1.1.2', 'Data Table', 'Material Table with sorting, pagination', 'MEDIUM', 4, 5],
  ['1.1.3', 'Inline Preview', 'แสดง Customer Preview เมื่อเลือก row', 'LOW', 2, 3],
  ['1.1.4', 'Navigation', 'Navigation ไป Member/Customer Detail', 'LOW', 2, 3],
  ['1.2', 'Customer Detail Page', 'ฟอร์มสร้าง/แก้ไขลูกค้า (20+ fields)', 'HIGH', 40, 50],
  ['1.2.1', 'Basic Info Form', 'ข้อมูลพื้นฐาน (title, name, citizenId, passport, etc.)', 'MEDIUM', 8, 10],
  ['1.2.2', 'Individual/Corporate Toggle', 'Dynamic fields based on customer type', 'MEDIUM', 5, 6],
  ['1.2.3', 'Validation Logic', 'Complex validation (Thai vs Foreign nationals)', 'HIGH', 8, 10],
  ['1.2.4', 'Save Workflow', 'Multi-step: validate → verify → save', 'HIGH', 10, 12],
  ['1.2.5', 'Status State Machine', 'Customer status transitions (01→02→03→04)', 'MEDIUM', 5, 6],
  ['1.2.6', 'Permission Management', 'Form permission checking (CAN_WRITE)', 'LOW', 4, 6],
  ['1.3', 'Customer Address Tab', 'CRUD ที่อยู่ + Cascading dropdown', 'HIGH', 20, 25],
  ['1.3.1', 'Address List', 'Paginated address list with selection', 'MEDIUM', 4, 5],
  ['1.3.2', 'Address Form', 'Address form with validation', 'MEDIUM', 4, 5],
  ['1.3.3', 'Cascading Dropdowns', 'Country → Province → District → SubDistrict → PostCode', 'HIGH', 8, 10],
  ['1.3.4', 'Primary Address Logic', 'Prevent duplicate primary addresses', 'MEDIUM', 4, 5],
  ['1.4', 'Customer Case Tab', 'แสดง Case ของลูกค้า', 'LOW-MEDIUM', 5, 8],
  ['1.4.1', 'Case List Display', 'Table with sorting/pagination', 'LOW', 3, 4],
  ['1.4.2', 'Navigation to Case', 'Link to case detail page', 'LOW', 2, 4],
  ['1.5', 'Customer SR Tab', 'แสดง Service Request ของลูกค้า', 'LOW-MEDIUM', 5, 8],
  ['1.5.1', 'SR List Display', 'Table with sorting/pagination', 'LOW', 3, 4],
  ['1.5.2', 'Navigation to SR', 'Link to SR detail page', 'LOW', 2, 4],
  ['1.6', 'Contact History Tab', 'Timeline การติดต่อ', 'LOW', 3, 5],
  ['1.6.1', 'Timeline Component', 'Consulting timeline visualization', 'LOW', 3, 5],
  ['1.7', 'Audit Log Tab', 'ประวัติการแก้ไข', 'LOW', 3, 5],
  ['1.7.1', 'Change Log Display', 'Paginated change log', 'LOW', 3, 5],
  ['1.8', 'Profile Image Upload', 'อัพโหลดรูปภาพ + Progress tracking', 'MEDIUM', 8, 10],
  ['1.8.1', 'File Upload Component', 'Upload with progress indicator', 'MEDIUM', 5, 6],
  ['1.8.2', 'Image Display', 'Profile image display with fallback', 'LOW', 3, 4],
];

// Case Module WBS
const caseWBS = [
  ['CASE MODULE - Work Breakdown Structure', '', '', '', '', ''],
  ['Total Story Points: 48-58', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['WBS ID', 'Task Name', 'Description', 'Complexity', 'Points (Min)', 'Points (Max)'],
  ['2', 'Case Module', '', '', 48, 58],
  ['2.1', 'Case List Page', 'ค้นหา/แสดง Case + Filters (12 fields)', 'MEDIUM', 10, 12],
  ['2.1.1', 'Search Form', 'Advanced search with 12 filter criteria', 'MEDIUM', 4, 5],
  ['2.1.2', 'Data Table', 'Case list with sorting/pagination', 'MEDIUM', 4, 5],
  ['2.1.3', 'Customer/Owner Modals', 'Modal selection for filtering', 'LOW', 2, 2],
  ['2.2', 'Case Detail Page', 'ฟอร์ม Case (23 fields) + Validation', 'HIGH', 15, 18],
  ['2.2.1', 'Case Form', 'Main case form with 23 fields', 'HIGH', 6, 8],
  ['2.2.2', 'Validation Logic', 'Date validation, required fields', 'MEDIUM', 4, 5],
  ['2.2.3', 'SLA Calculation', 'Priority to SLA mapping', 'MEDIUM', 3, 3],
  ['2.2.4', 'Consulting Integration', 'Link case to consulting session', 'LOW', 2, 2],
  ['2.3', 'Case Activity Tab', 'CRUD Activity + Modal', 'MEDIUM', 8, 10],
  ['2.3.1', 'Activity List', 'Table with sorting/pagination', 'MEDIUM', 3, 4],
  ['2.3.2', 'Activity Form', 'Create/Edit activity form', 'MEDIUM', 3, 4],
  ['2.3.3', 'Owner/Dept Selection', 'Modal selection for assignment', 'LOW', 2, 2],
  ['2.4', 'Case Attachment Tab', 'Upload/Download ไฟล์แนบ', 'MEDIUM-HIGH', 10, 12],
  ['2.4.1', 'Attachment List', 'Table with file information', 'MEDIUM', 3, 4],
  ['2.4.2', 'File Upload', 'Upload with validation (type, size)', 'MEDIUM', 4, 5],
  ['2.4.3', 'File Preview/Download', 'Preview for images/PDF, download others', 'MEDIUM', 3, 3],
  ['2.5', 'Case KB Tab', 'เชื่อมโยง Knowledge Base', 'LOW-MEDIUM', 5, 6],
  ['2.5.1', 'KB Reference List', 'Linked KB articles list', 'LOW', 2, 3],
  ['2.5.2', 'KB Selection Modal', 'Search and link KB articles', 'LOW', 3, 3],
];

// KB Module WBS
const kbWBS = [
  ['KNOWLEDGE BASE MODULE - Work Breakdown Structure', '', '', '', '', ''],
  ['Total Story Points: 45-55', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['WBS ID', 'Task Name', 'Description', 'Complexity', 'Points (Min)', 'Points (Max)'],
  ['3', 'Knowledge Base Module', '', '', 45, 55],
  ['3.1', 'Content Container', '2 Tabs (All Content / My Favorites)', 'MEDIUM', 6, 8],
  ['3.1.1', 'Tab Navigation', 'Material Tabs component', 'LOW', 2, 3],
  ['3.1.2', 'Content Routing', 'State management between tabs', 'MEDIUM', 4, 5],
  ['3.2', 'Tree Component', 'Hierarchical folder/file tree + CRUD', 'HIGH', 12, 15],
  ['3.2.1', 'Tree Structure', 'Angular CDK Tree implementation', 'HIGH', 5, 6],
  ['3.2.2', 'Folder CRUD', 'Create/Edit/Delete folders', 'MEDIUM', 4, 5],
  ['3.2.3', 'Context Menu', 'Right-click operations', 'MEDIUM', 3, 4],
  ['3.3', 'Favorite Tree', 'Favorite items tree view', 'HIGH', 10, 12],
  ['3.3.1', 'Favorite Tree Display', 'Similar to main tree', 'MEDIUM', 5, 6],
  ['3.3.2', 'Favorite State Sync', 'Sync with main tree', 'MEDIUM', 5, 6],
  ['3.4', 'Detail Form', 'KB content metadata (10 fields)', 'HIGH', 8, 10],
  ['3.4.1', 'Metadata Form', 'Title, status, dates, etc.', 'MEDIUM', 4, 5],
  ['3.4.2', 'Folder Selection Modal', 'Tree-based folder picker', 'MEDIUM', 4, 5],
  ['3.5', 'Document Management', 'Upload/Download/Preview ไฟล์', 'HIGH', 10, 12],
  ['3.5.1', 'Document List', 'Table with file information', 'MEDIUM', 3, 4],
  ['3.5.2', 'File Upload', 'Multi-file upload with progress', 'MEDIUM', 4, 5],
  ['3.5.3', 'Main Document Flag', 'Designate primary document', 'LOW', 3, 3],
  ['3.6', 'Keyword Management', 'Keyword chips input', 'MEDIUM', 4, 5],
  ['3.6.1', 'Keyword Chips', 'Material Chips with autocomplete', 'MEDIUM', 4, 5],
  ['3.7', 'Rating System', '5-star rating + Average', 'MEDIUM', 4, 5],
  ['3.7.1', 'Star Rating Input', 'Interactive star rating', 'MEDIUM', 2, 3],
  ['3.7.2', 'Average Calculation', 'Display average rating', 'LOW', 2, 2],
  ['3.8', 'Favorite Toggle', 'Like/Unlike functionality', 'MEDIUM', 3, 4],
  ['3.8.1', 'Toggle Button', 'Like/Unlike with animation', 'LOW', 2, 2],
  ['3.8.2', 'Favorite State', 'Persist favorite status', 'LOW', 1, 2],
];

// Dashboard Module WBS
const dashboardWBS = [
  ['DASHBOARD MODULE - Work Breakdown Structure', '', '', '', '', ''],
  ['Total Story Points: 15-20', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['WBS ID', 'Task Name', 'Description', 'Complexity', 'Points (Min)', 'Points (Max)'],
  ['4', 'Dashboard Module', '', '', 15, 20],
  ['4.1', 'View Filter', 'My Tasks vs Organization dropdown', 'LOW', 2, 3],
  ['4.1.1', 'Filter Dropdown', 'Codebook-based dropdown', 'LOW', 2, 3],
  ['4.2', 'Status Summary Cards', '4 cards (New, Working, Escalated, Closed)', 'LOW', 3, 4],
  ['4.2.1', 'Summary Cards', 'Material Cards with counts', 'LOW', 3, 4],
  ['4.3', 'Bar Chart', 'Case by Channel (ngx-charts)', 'MEDIUM', 4, 5],
  ['4.3.1', 'Chart Component', 'ngx-charts-bar-horizontal', 'MEDIUM', 4, 5],
  ['4.4', 'Pie Chart', 'Case by Type (ngx-charts)', 'MEDIUM', 4, 5],
  ['4.4.1', 'Chart Component', 'ngx-charts-pie-chart', 'MEDIUM', 4, 5],
  ['4.5', 'Case Table', 'Paginated case list', 'MEDIUM', 4, 5],
  ['4.5.1', 'Case List', 'Table with navigation to details', 'MEDIUM', 4, 5],
  ['4.6', 'Activity Table', 'Activity list for selected case', 'MEDIUM', 3, 4],
  ['4.6.1', 'Activity List', 'Table showing activities', 'MEDIUM', 3, 4],
];

// Consulting Module WBS
const consultingWBS = [
  ['CONSULTING MODULE - Work Breakdown Structure', '', '', '', '', ''],
  ['Total Story Points: 20-28', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['WBS ID', 'Task Name', 'Description', 'Complexity', 'Points (Min)', 'Points (Max)'],
  ['5', 'Consulting Module', '', '', 20, 28],
  ['5.1', 'Consulting List Page', 'ค้นหา/แสดง Consulting + Related Cases', 'MEDIUM', 8, 10],
  ['5.1.1', 'Search Form', 'Filter criteria for consulting', 'MEDIUM', 3, 4],
  ['5.1.2', 'Consulting Table', 'List with pagination/sorting', 'MEDIUM', 3, 4],
  ['5.1.3', 'Related Cases', 'Display cases linked to consulting', 'LOW', 2, 2],
  ['5.2', 'Consulting Modal', 'Create/Edit Consulting', 'MEDIUM', 6, 8],
  ['5.2.1', 'Consulting Form', 'Form with 18 fields', 'MEDIUM', 4, 5],
  ['5.2.2', 'Customer/Owner Selection', 'Modal integration', 'LOW', 2, 3],
  ['5.3', 'Consulting Header Widget', 'Active session display + Start/Stop', 'MEDIUM', 5, 7],
  ['5.3.1', 'Session Display', 'Show current consulting info', 'MEDIUM', 3, 4],
  ['5.3.2', 'Start/Stop Actions', 'Walk-in/Phone consulting start', 'MEDIUM', 2, 3],
  ['5.4', 'Session Management', 'Session storage + Cross-component state', 'MEDIUM', 4, 6],
  ['5.4.1', 'Session Storage', 'Persist active consulting', 'LOW', 2, 3],
  ['5.4.2', 'BehaviorSubject', 'Cross-component communication', 'LOW', 2, 3],
];

// System Module WBS
const systemWBS = [
  ['SYSTEM MODULE - Work Breakdown Structure', '', '', '', '', ''],
  ['Total Story Points: 120-145', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['WBS ID', 'Task Name', 'Description', 'Complexity', 'Points (Min)', 'Points (Max)'],
  ['6', 'System Module', '', '', 120, 145],
  ['6.1', 'User Management', 'User CRUD + Profile Image + Logs', 'HIGH', 8, 10],
  ['6.1.1', 'User List', 'Search and list users', 'MEDIUM', 3, 4],
  ['6.1.2', 'User Form', 'Create/Edit user with validation', 'MEDIUM', 3, 4],
  ['6.1.3', 'Profile Image Upload', 'Upload with progress', 'LOW', 2, 2],
  ['6.2', 'Role & Responsibility', 'Role CRUD + Permission Matrix', 'HIGH', 9, 11],
  ['6.2.1', 'Role List', 'Search and list roles', 'MEDIUM', 3, 4],
  ['6.2.2', 'Role Form', 'Create/Edit role', 'LOW', 2, 3],
  ['6.2.3', 'Responsibility Dialog', 'Permission assignment matrix', 'HIGH', 4, 4],
  ['6.3', 'Menu Management', 'Menu Tree + CRUD', 'HIGH', 9, 10],
  ['6.3.1', 'Menu Tree', 'CDK Tree with hierarchy', 'HIGH', 5, 6],
  ['6.3.2', 'Menu Form', 'Create/Edit menu items', 'MEDIUM', 4, 4],
  ['6.4', 'Department Management', 'Department CRUD', 'MEDIUM', 5, 6],
  ['6.4.1', 'Department List', 'Search and list departments', 'LOW', 2, 3],
  ['6.4.2', 'Department Form', 'Create/Edit department', 'LOW', 3, 3],
  ['6.5', 'Department Team', 'Team CRUD under Department', 'MEDIUM', 5, 6],
  ['6.5.1', 'Team List', 'List teams by department', 'LOW', 2, 3],
  ['6.5.2', 'Team Form', 'Create/Edit team', 'LOW', 3, 3],
  ['6.6', 'Position Management', 'Position CRUD', 'MEDIUM', 5, 6],
  ['6.6.1', 'Position List', 'Search and list positions', 'LOW', 2, 3],
  ['6.6.2', 'Position Form', 'Create/Edit position', 'LOW', 3, 3],
  ['6.7', 'Business Unit', 'Business Unit CRUD', 'MEDIUM', 6, 7],
  ['6.7.1', 'BU List', 'Search and list business units', 'LOW', 3, 3],
  ['6.7.2', 'BU Form', 'Create/Edit business unit', 'LOW', 3, 4],
  ['6.8', 'Codebook Management', 'Codebook CRUD + Parent-Child', 'HIGH', 8, 9],
  ['6.8.1', 'Codebook List', 'Search with real-time filter', 'MEDIUM', 4, 4],
  ['6.8.2', 'Codebook Form', 'Form with 15 fields (etc1-5)', 'MEDIUM', 4, 5],
  ['6.9', 'Email Template', 'Rich Text Editor + File Upload', 'VERY HIGH', 12, 15],
  ['6.9.1', 'Template List', 'Search and list templates', 'MEDIUM', 3, 4],
  ['6.9.2', 'Quill Editor', 'ngx-quill with custom handlers', 'HIGH', 5, 6],
  ['6.9.3', 'Image/File Upload', 'Upload handlers for editor', 'MEDIUM', 4, 5],
  ['6.10', 'Holiday Management', 'FullCalendar + CRUD', 'HIGH', 10, 12],
  ['6.10.1', 'Calendar View', 'FullCalendar integration', 'HIGH', 5, 6],
  ['6.10.2', 'Holiday Form', 'Create/Edit holidays', 'MEDIUM', 3, 4],
  ['6.10.3', 'Year Filter', 'Filter by year', 'LOW', 2, 2],
  ['6.11', 'Internationalization', 'Multi-language Messages', 'HIGH', 8, 10],
  ['6.11.1', 'Message List', 'Search and list messages', 'MEDIUM', 3, 4],
  ['6.11.2', 'Dynamic FormArray', 'Form per language', 'HIGH', 5, 6],
  ['6.12', 'Questionnaire', 'Header → Questions → Answers', 'VERY HIGH', 20, 25],
  ['6.12.1', 'Questionnaire List', 'Search and list questionnaires', 'MEDIUM', 4, 5],
  ['6.12.2', 'Questionnaire Detail', 'Header form + Question builder', 'HIGH', 8, 10],
  ['6.12.3', 'Landing Page', 'Public questionnaire view', 'MEDIUM', 4, 5],
  ['6.12.4', 'Preview Component', 'Questionnaire preview', 'LOW', 4, 5],
  ['6.13', 'Scheduler', 'Job Scheduler + History', 'HIGH', 10, 12],
  ['6.13.1', 'Scheduler List', 'List scheduled jobs', 'MEDIUM', 4, 5],
  ['6.13.2', 'Scheduler Form', 'Cron expression config', 'MEDIUM', 4, 5],
  ['6.13.3', 'History Log', 'Execution history', 'LOW', 2, 2],
  ['6.14', 'SLA Management', 'SLA CRUD', 'MEDIUM', 4, 5],
  ['6.14.1', 'SLA List', 'Search and list SLAs', 'LOW', 2, 2],
  ['6.14.2', 'SLA Form', 'Create/Edit SLA', 'LOW', 2, 3],
];

// Configuration Checklist
const configChecklist = [
  ['CONFIGURATION CHECKLIST', '', '', ''],
  ['', '', '', ''],
  ['Category', 'Item', 'Required For', 'Status'],
  ['Backend', 'Database Schema Setup (20+ tables)', 'All Modules', ''],
  ['Backend', 'API Endpoints (136+ endpoints)', 'All Modules', ''],
  ['Backend', 'File Storage Configuration', 'Customer, Case, KB, System', ''],
  ['Backend', 'JWT Authentication', 'All Modules', ''],
  ['Backend', 'WebSocket Server', 'Consulting, Notifications', ''],
  ['', '', '', ''],
  ['Codebook', 'CUSTOMER_STATUS', 'Customer', ''],
  ['Codebook', 'CUSTOMER_TYPE', 'Customer', ''],
  ['Codebook', 'TITLE_NAME', 'Customer, Case', ''],
  ['Codebook', 'NATIONALITY', 'Customer', ''],
  ['Codebook', 'GENDER', 'Customer', ''],
  ['Codebook', 'MARITAL_STATUS', 'Customer', ''],
  ['Codebook', 'OCCUPATION', 'Customer', ''],
  ['Codebook', 'BUSINESS_TYPE', 'Customer', ''],
  ['Codebook', 'PHONE_PREFIX', 'Customer', ''],
  ['Codebook', 'SOURCE_CHANNEL', 'Customer', ''],
  ['Codebook', 'COUNTRY', 'Customer', ''],
  ['Codebook', 'ADDRESS_TYPE', 'Customer', ''],
  ['Codebook', 'CASE_DIVISION', 'Case', ''],
  ['Codebook', 'CASE_CATEGORY', 'Case', ''],
  ['Codebook', 'CASE_TYPE', 'Case', ''],
  ['Codebook', 'CASE_SUBTYPE', 'Case', ''],
  ['Codebook', 'CASE_PRIORITY', 'Case', ''],
  ['Codebook', 'CASE_STATUS', 'Case', ''],
  ['Codebook', 'CASE_CHANNEL', 'Case', ''],
  ['Codebook', 'CONSULTING_CHANNEL', 'Consulting', ''],
  ['Codebook', 'CONSULTING_STATUS', 'Consulting', ''],
  ['Codebook', 'CONTENT_STATUS', 'KB', ''],
  ['Codebook', 'VIEW_BY', 'Dashboard', ''],
  ['', '', '', ''],
  ['Geo Data', 'Thailand Provinces', 'Customer', ''],
  ['Geo Data', 'Thailand Districts', 'Customer', ''],
  ['Geo Data', 'Thailand Sub-Districts', 'Customer', ''],
  ['Geo Data', 'Thailand Postal Codes', 'Customer', ''],
  ['', '', '', ''],
  ['Environment', 'Development Setup', 'All', ''],
  ['Environment', 'SIT Setup', 'All', ''],
  ['Environment', 'UAT Setup', 'All', ''],
  ['Environment', 'Production Setup', 'All', ''],
];

// Timeline Estimation
const timelineData = [
  ['TIMELINE ESTIMATION', '', '', '', ''],
  ['', '', '', '', ''],
  ['Team Size', 'Sprint Velocity (pts/sprint)', 'Sprints Needed', 'Duration (weeks)', 'Notes'],
  ['2 Developers', 40, '13-17', '26-34', 'Sequential development'],
  ['3 Developers', 60, '9-12', '18-24', 'Recommended'],
  ['4 Developers', 80, '7-9', '14-18', 'Parallel workstreams'],
  ['5 Developers', 100, '6-7', '12-14', 'Maximum parallelization'],
  ['', '', '', '', ''],
  ['PHASE BREAKDOWN', '', '', '', ''],
  ['Phase', 'Modules', 'Story Points', 'Duration (3 devs)', 'Priority'],
  ['Phase 1 - Core', 'System (Core), Customer, Case, Infrastructure', '218-283', '11-14 weeks', 'MUST HAVE'],
  ['Phase 2 - Extended', 'KB, Dashboard, Consulting, System (Remaining)', '168-212', '8-11 weeks', 'SHOULD HAVE'],
];

// Create workbook
const wb = XLSX.utils.book_new();

// Add sheets
const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
ws1['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 10 }, { wch: 8 }, { wch: 15 }, { wch: 18 }, { wch: 18 }];
XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

const ws2 = XLSX.utils.aoa_to_sheet(customerWBS);
ws2['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 50 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
XLSX.utils.book_append_sheet(wb, ws2, 'Customer Module');

const ws3 = XLSX.utils.aoa_to_sheet(caseWBS);
ws3['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 50 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
XLSX.utils.book_append_sheet(wb, ws3, 'Case Module');

const ws4 = XLSX.utils.aoa_to_sheet(kbWBS);
ws4['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 50 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
XLSX.utils.book_append_sheet(wb, ws4, 'KB Module');

const ws5 = XLSX.utils.aoa_to_sheet(dashboardWBS);
ws5['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 50 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
XLSX.utils.book_append_sheet(wb, ws5, 'Dashboard Module');

const ws6 = XLSX.utils.aoa_to_sheet(consultingWBS);
ws6['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 50 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
XLSX.utils.book_append_sheet(wb, ws6, 'Consulting Module');

const ws7 = XLSX.utils.aoa_to_sheet(systemWBS);
ws7['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 50 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
XLSX.utils.book_append_sheet(wb, ws7, 'System Module');

const ws8 = XLSX.utils.aoa_to_sheet(configChecklist);
ws8['!cols'] = [{ wch: 15 }, { wch: 40 }, { wch: 30 }, { wch: 10 }];
XLSX.utils.book_append_sheet(wb, ws8, 'Configuration Checklist');

const ws9 = XLSX.utils.aoa_to_sheet(timelineData);
ws9['!cols'] = [{ wch: 25 }, { wch: 50 }, { wch: 15 }, { wch: 18 }, { wch: 25 }];
XLSX.utils.book_append_sheet(wb, ws9, 'Timeline');

// Write file
const outputPath = './JLO_CRM_WBS_Template.xlsx';
XLSX.writeFile(wb, outputPath);
console.log(`Excel file generated: ${outputPath}`);
