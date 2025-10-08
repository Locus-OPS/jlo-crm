Consent Profile - Technical Specification (ฉบับทดแทน)
เวอร์ชัน: 1.0
วันที่: 2025-10-07
ผู้เขียน: ทีมพัฒนา

สรุปภาพรวม
- เอกสารนี้เป็น Technical Specification สำหรับฟีเจอร์ "Consent Profile" และ Dialog ที่เกี่ยวข้อง ได้แก่:
  1. consent-profile (หน้าค้นหา / รายการ)
  2. consent-profile-detail (หน้ารายละเอียด / แก้ไข)
  3. withdraw-dialog (ยืนยันการถอนความยินยอม)
  4. consent-cif dialog (เชื่อมข้อมูลลูกค้า / ค้นหา CIF)
  5. consent-latest dialog (ดูเวอร์ชันล่าสุดของ consent)
  6. whitelist dialog (บริหารรายการ whitelist)
- เนื้อหาในเอกสารครอบคลุม: search criteria และ validation, search result, related dialogs, การกระทำของปุ่ม (button actions), การเชื่อมต่อ API, error handling, และ acceptance criteria

1. ข้อกำหนดทั่วไป
- เทคโนโลยี UI: Angular (ตามโครงงานปัจจุบัน)
- Modal/Dialog: ใช้ Component ของแอพที่เป็นมาตรฐาน (material/dialog หรือ custom modal)
- ขนาด modal:
  - small: 420px (confirm, simple)
  - medium: 720px (form / รายละเอียดสั้น)
  - large: 980px (ผลลัพธ์/รายละเอียดยาว)
- Authentication/Authorization: ทุก API ต้องตรวจสอบ token และสิทธิ์การเข้าถึง (RBAC). ปุ่มบางปุ่มต้องซ่อนไว้หากผู้ใช้ไม่มีสิทธิ์ (เช่น withdraw, edit, whitelist)
- Localization: ข้อความทั้งหมดรองรับภาษาไทย/อังกฤษ (i18n key)

2. Data model (ตัวอย่าง)
- ConsentProfile {
    id: string,              // profile id (PK)
    profileName: string,
    consentType: string,     // e.g., "MARKETING", "SERVICE", "THIRD_PARTY"
    customerName?: string,
    cif?: string,
    nationalId?: string,
    channel?: string,        // e.g., "ONLINE", "BRANCH"
    status: string,          // e.g., "ACTIVE","INACTIVE","WITHDRAWN"
    latestConsentAt?: string,// ISO timestamp
    createdAt: string,
    updatedAt?: string,
    whitelistFlag?: boolean
  }

3. API (ตัวอย่าง endpoints)
- GET /api/consent-profiles
  - Query params: profileName, consentType, cif, nationalId, channel, status, fromDate, toDate, page, size, sort
  - Response: { items: ConsentProfile[], total: number, page: number, size: number }
- GET /api/consent-profiles/{id}
  - Response: ConsentProfile + history/versions
- POST /api/consent-profiles/{id}/withdraw
  - Body: { reason: string, withdrawnBy: string }
  - Response: updated profile
- GET /api/consents/latest?cif=... or ?nationalId=...
  - Response: latest consent record
- POST /api/whitelist
  - Body: { profileId, reason, effectiveDate, expireDate }
- GET /api/whitelist?profileId=...
- Other: export (GET /api/consent-profiles/export?...) returns CSV/XLSX

4. consent-profile (หน้าค้นหา / รายการ)
UI layout:
- Search area (filter panel) — ปุ่ม Search / Clear / Export
- Results table (paginated) — columns + actions per row
- Toolbar buttons: Create (ถ้ามี), Export

Search Criteria (fields และ validation):
- Profile ID (profileName / profileId)
  - Type: string
  - Validation: max length 50, regex /^[A-Za-z0-9\-_ ]*$/
- Consent Type
  - Type: dropdown (multi-select allowed)
  - Values: จาก master data
- CIF
  - Type: string (numeric)
  - Validation: digits only, length: 5-12 (ขึ้นกับระบบ)
- National ID (เลขบัตรประชาชน)
  - Type: string
  - Validation: Thai national id format (13 digits) OR other country format per config
- Customer Name
  - Type: string
  - Validation: max length 100
- Channel
  - Type: dropdown
  - Validation: from allowed list
- Status
  - Type: dropdown (single)
  - Values: ALL, ACTIVE, INACTIVE, WITHDRAWN
- Date Range (Latest Consent Date)
  - fromDate / toDate (date picker)
  - Validation: fromDate <= toDate, max range 365 days (configurable)
- Whitelist flag
  - Type: checkbox (true/false)

Search Validation rules (apply before calling API):
- At least one search criteria must be provided OR allow full list search (configurable). If policy requires explicit criteria, then error if all blank: "กรุณาระบุเงื่อนไขการค้นหาอย่างน้อยหนึ่งรายการ"
- If nationalId provided -> must be 13 digits (frontend validate)
- If fromDate or toDate provided, ensure ISO format and range limit enforced
- Trim inputs, remove dangerous chars. Client-side validation for quick feedback, server-side must re-validate.

Search actions (ปุ่ม):
- Search
  - Disabled if validation fails
  - On click: call GET /api/consent-profiles with params. Show loading spinner.
- Clear
  - Reset all filters to default. Focus first field.
- Export
  - Triggers export; should respect current filters; show progress/toast; download file when ready.
- Create (optional)
  - Opens consent-profile-detail in create mode

Search Result (table):
- Columns:
  1. Profile ID / Profile Name (clickable link -> opens consent-profile-detail)
  2. Consent Type
  3. Customer Name
  4. CIF
  5. National ID
  6. Channel
  7. Status (badge color coded)
  8. Latest Consent Date (sortable)
  9. Whitelist (icon/boolean)
  10. Actions (buttons)
- Table behaviors:
  - Sorting on profileName, latestConsentAt, status
  - Pagination controls: page, size (10,25,50,100)
  - Row selection for bulk operations (optional)
  - Empty state: show helpful message + suggestion to clear filters or create new profile
  - Loading state: skeleton rows

Row Actions (buttons and behavior):
- View / Detail (icon - eye)
  - Opens consent-profile-detail in read-only mode (or editable based on permission)
- Edit (icon - pencil)
  - Opens consent-profile-detail in edit mode
- Withdraw (icon - undo/ban)
  - Opens withdraw-dialog (confirm + reason)
  - Disabled if status == WITHDRAWN or user lacks permission
- Latest (icon - clock)
  - Opens consent-latest dialog showing most recent consent data and version diff
- CIF Lookup (icon - search)
  - Opens consent-cif dialog to link/change CIF
- Whitelist (icon - star)
  - Opens whitelist dialog to add/remove whitelist entry
- More (ellipsis)
  - Additional actions: Audit log, Export single profile, Resend notification

5. consent-profile-detail (Dialog / Page)
Purpose:
- แสดงรายละเอียดแบบเต็มของ profile
- แก้ไขข้อมูล contact/channel/consent types และบันทึก
- แสดง history / versions และปุ่มเรียก dialog ต่างๆ

Layout / Sections:
- Header: Profile ID, Status, Whitelist indicator, Action buttons (Save, Cancel, Withdraw, Delete)
- Main form:
  - Profile Name (text) — required
  - Consent Types (multi-select) — required
  - Customer Info: Customer Name, CIF (lookup), National ID (readonly if linked to system), Contact Info (phone, email)
  - Channels: checkboxes / multi-select
  - Effective / Expiry Date
  - Notes / Reason
- History / Versions tab:
  - List of consent versions with timestamp and operator
  - Button to open consent-latest dialog to view details of a version

Validations:
- Required: Profile Name, at least one Consent Type
- Date validations: effectiveDate <= expiryDate (if expiry provided)
- CIF: numeric pattern; if CIF changed, prompt confirmation and optionally log audit
- National ID: format check

Buttons and actions:
- Save
  - Client-side validation -> call PUT /api/consent-profiles/{id} (or POST for create)
  - On success: close dialog or show toast and refresh list
- Cancel
  - If dirty form: show confirm discard modal
- Withdraw
  - Opens withdraw-dialog
- Delete
  - Confirm delete modal -> call DELETE /api/consent-profiles/{id}; soft-delete preferred

6. withdraw-dialog (Dialog)
Purpose:
- ยืนยันการถอนความยินยอม (withdraw consent)
- เก็บเหตุผล และบันทึกผู้ดำเนินการ

Layout:
- Title: "ยืนยันการถอนความยินยอม"
- Body:
  - Read-only summary of profile (Profile ID, customer, consent types)
  - Textarea: Reason (required) — validation: min length 5, max 1000
  - Checkbox: "ยืนยันการถอน" (optional) to prevent accidental action
- Buttons:
  - Confirm (primary) — disabled until reason valid and optional checkbox checked
  - Cancel

Behavior:
- On Confirm: call POST /api/consent-profiles/{id}/withdraw with body { reason, withdrawnBy }
- UI: show progress, then on success close dialog, show toast "ถอนความยินยอมเรียบร้อย", update status in list to WITHDRAWN
- Error handling: show specific error message (e.g., already withdrawn, insufficient permission)

7. consent-cif dialog (Dialog)
Purpose:
- ค้นหาและเลือก CIF เพื่อเชื่อมกับ profile หรืออัปเดตข้อมูลลูกค้า

Layout:
- Search field(s): CIF, nationalId, customerName
- Validation: if CIF field used -> numeric check; if nationalId used -> 13 digits etc.
- Results table: CIF, Customer Name, DOB (optional), Contact
- Actions:
  - Select (choose CIF) -> closes dialog and populates profile form field
  - Link (API call to link)
- Buttons:
  - Search, Clear, Select, Close

API:
- GET /api/customers?cif=...&nationalId=...&name=...
- POST /api/consent-profiles/{id}/link-cif { cif }

8. consent-latest dialog (Dialog)
Purpose:
- แสดงข้อมูล consent ล่าสุดของ profile หรือลูกค้า
- เปรียบเทียบ differences ระหว่างเวอร์ชัน (optional diff view)

Layout:
- Header: profile id / timestamp / operator
- Content:
  - Key fields of consent: consent types, channels, status, effective/expiry, notes
  - Version history list (left) -> selecting version shows details on right
  - Diff view (highlight changed fields)
- Buttons:
  - Close, Export version (optional)

API:
- GET /api/consents/latest?profileId=... or GET /api/consents/{profileId}/versions

9. whitelist dialog (Dialog)
Purpose:
- เพิ่ม/แก้ไข/ลบ whitelist entry สำหรับ profile (ป้องกันไม่ให้ถูกถอนอัตโนมัติ หรือตั้งข้อยกเว้น)

Layout:
- Header: Whitelist management
- Form:
  - Whitelist Type (reason category)
  - Effective Date (required)
  - Expiry Date (optional, must be >= effectiveDate)
  - Reason (required)
- List of existing whitelist entries with actions (edit/delete)
- Buttons:
  - Add / Save, Cancel

API:
- GET /api/whitelist?profileId=
- POST /api/whitelist
- PUT /api/whitelist/{id}
- DELETE /api/whitelist/{id}

Validations:
- EffectiveDate required
- ExpiryDate >= EffectiveDate
- Prevent overlapping whitelist ranges for same profile unless allowed

10. UI/UX Considerations
- Feedback: loading spinners, disabled states while request pending, success/error toasts
- Accessibility: keyboard navigation, ARIA labels for dialogs/buttons, color contrast for badges
- Confirmation for destructive actions (withdraw, delete)
- Consistent iconography and tooltips
- Mobile responsiveness: table collapses to stacked cards; dialogs adapt to full-screen on small devices

11. Security & Audit
- All sensitive actions logged to audit trail (user id, timestamp, action, before/after)
- Server-side validation mandatory (never trust client)
- Role-based access control:
  - VIEW_CONSENT: can search & view
  - EDIT_CONSENT: can edit profile
  - WITHDRAW_CONSENT: can withdraw
  - MANAGE_WHITELIST: manage whitelist
- Data masking: nationalId partially masked in results unless user has high privilege

12. Error handling scenarios
- No search results -> show informative empty state with suggested actions
- API failure -> show friendly error message and retry option
- Concurrent modification -> if save fails due to version conflict, show message and provide Refresh / Merge option
- Withdraw already done -> show message and refresh status

13. Testing & Acceptance Criteria
Test cases:
- Search with single criteria returns appropriate results
- Validation: invalid nationalId prevented on search
- Date range validation enforced
- Clicking profile name opens detail; edit and save persists changes
- Withdraw dialog requires reason and updates status
- CIF dialog search and link updates profile cif field
- Latest dialog shows correct latest consent details and versions
- Whitelist add/edit/delete persists and reflected in profile view
Acceptance criteria:
- UI follows design; all buttons perform described API calls
- Validation rules enforced client-side and server-side
- Proper success and error messages shown
- Audit logs created for all mutating actions

14. Non-functional requirements
- Performance: typical search returns first page within 2s (under normal load)
- Scalability: server supports pagination and bulk export async job if large result set
- Maintainability: components modular, dialogs reusable
- Observability: errors reported to monitoring system, key metrics tracked (search volume, withdraw events)

15. Implementation notes / Developer guidance
- Reuse existing models in src/app/model (profile.model.ts, etc.)
- Use shared modal components under src/app/pages/common/modal-confirm if possible
- Centralize API calls in a service (e.g., ConsentProfileService) under src/app/pages/management/consent-profile/
- Use Reactive Forms for detail form and validate using shared validators
- Keep strings in i18n files under src/assets/i18n/
- For export, prefer backend-generated files and provide signed URL for download to avoid large payload in frontend

16. Sample UI flow (Search -> Withdraw)
- User enters criteria (e.g., profileName or CIF) -> Click Search -> loading -> results displayed
- User clicks Withdraw action on a row -> withdraw-dialog opens with profile summary
- User enters reason, confirms -> call withdraw API -> on success toast -> row status updated to WITHDRAWN

17. Deployment / Feature flags
- Consider gating destructive operations (withdraw) behind a feature flag for phased rollout
- Backwards compatibility: API changes should be versioned if affecting clients

18. Appendix: Sample request/response
- GET /api/consent-profiles?page=0&size=25&consentType=MARKETING
  Response:
  {
    "items": [
      {
        "id":"PF-12345",
        "profileName":"Marketing Profile A",
        "consentType":"MARKETING",
        "customerName":"สมชาย ใจดี",
        "cif":"100001",
        "nationalId":"1234567890123",
        "channel":"ONLINE",
        "status":"ACTIVE",
        "latestConsentAt":"2025-09-30T10:12:00Z",
        "whitelistFlag":false
      }
    ],
    "total": 1,
    "page":0,
    "size":25
  }

สรุป
- เอกสารฉบับนี้เป็นแนวทางเชิงเทคนิคสำหรับการพัฒนาและทดสอบฟีเจอร์ Consent Profile และ dialog ที่เกี่ยวข้อง ครอบคลุม search criteria/validation, ผลลัพธ์การค้นหา, dialog ต่าง ๆ, การกระทำของปุ่ม และข้อกำหนดด้านระบบที่สำคัญ
- หากต้องการรายละเอียดเชิงโค้ด (ตัวอย่าง component, service, หรือ API contract แบบ OpenAPI) ให้แจ้งเพื่อจัดทำต่อได้
