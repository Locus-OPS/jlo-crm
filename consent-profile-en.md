# Consent Profile — Technical Specification

Version: 1.0  
Location: src/app/pages/consent-profile

Purpose:
This specification documents the front-end behavior, search criteria & validation, search result UI, related modal dialogs, and all button actions for the Consent Profile feature and its related components:
- consent-profile (main search list)
- consent-profile-detail (detail view)
- withdraw-dialog (withdraw action)
- consent-cif (CIF editor dialog)
- consent-latest (latest consent content dialog)
- whitelist dialog (add to whitelist)

References:
- Main component: consent-profile.component.ts / .html
- Detail component: detail/consent-profile-detail.component.ts / .html
- Dialogs:
  - dialog/withdraw-dialog.component.ts / .html
  - consent-cif/consent-cif.component.ts / .html
  - latest/consent-latest.component.ts / .html
  - whitelist/whitelist-dialog.component.ts / .html
- Service: consent-profile.service.ts

---

Table of contents
- Overview
- Search: criteria, validation, client transform
- Search result: table columns, paging, sorting, formatting
- All button actions (main + detail + dialogs)
- Dialogs: behavior, inputs/outputs, button flows
  - Consent Profile Detail
  - Withdraw Dialog
  - Consent CIF Dialog
  - Consent Latest Dialog
  - Whitelist Dialog
- APIs & payload shapes
- Translations / messages
- Error handling and UX notes
- Appendix: inferred data models

---

OVERVIEW

The Consent Profile feature provides:
- Searching consent profiles (with paging & sort)
- Viewing profile details (consent actions & history)
- Viewing latest consent content
- Editing CIF for a profile
- Initiating withdraw action (SMS/Email)
- Adding/removing whitelist flags

Main flows:
- Search -> select -> Detail -> view actions/history -> open dialogs (latest, withdraw, correction)
- Whitelist view: separate route with add/remove whitelist actions

---

1) SEARCH (consent-profile)

Search form controls (searchForm FormGroup)
- consentTypeCode: string (select — CONSENT_TYPE_CODE)
- cif: number (input type=number, min=0)
- idNumber: string (input text)
- channelCode: string (select — CHANNEL_CD) [present in form but not always shown]
- dateFrom / dateTo: date (profile create date range)
- actionDateFrom / actionDateTo: date (action date range)
- idType: string (select — ID_TYPE)
- accountNo: string
- subAccountNo: string

Search UI notes:
- consentTypeCode field is hidden when isWhiteList === true.
- date range pickers (profile create / action dates) are hidden when isWhiteList === true.
- "Add New Whitelist" button visible only on whitelist route.
- "Edit CIF" button visible only when menu == 'profile' in result actions column.

Client validation rules:
- For non-whitelist view: require at least one of cif OR idNumber.
  - Implemented in consent-profile.component.search():
    if (!isWhiteList && (!cif && !idNumber)) -> Utils.alertError(cp.error.searchProfileRequired)
- For whitelist dialog search (inside whitelist dialog): similarly require cif or idNumber.
- Date pair validation/enforcement:
  - onDateFromChange: if dateTo exists and dateTo < dateFrom then set dateTo = dateFrom.
  - onDateToChange: if dateFrom exists and dateFrom > dateTo then set dateFrom = dateTo.
  - Similar logic for actionDateFrom/actionDateTo.
- CIF input crates numeric-only enforcement in the CIF dialog (consent-cif) and whitelist dialog numberOnly handlers.

Client-side transforms before calling search API:
- All date fields converted with Utils.getDateStringForBackend(...)
- whitelistFlag: "Y" for whitelist view, otherwise null
- Append sortColumn and sortDirection from TableControl
- Use ApiPageRequest: { data: {...}, pageSize, pageNo }

Search trigger:
- onSearch() resets paginator (tableControl.resetPage()) then calls search().

Search (no-results & errors):
- If API returns status false -> Utils.alertError(result.message)
- If API returns status true but empty data -> Utils.alertError({ text: "Data not found" })

---

2) SEARCH RESULT TABLE

Displayed columns (displayedColumns)
- action (buttons)
- cif
- idNumber
- idType (display shows idTypeName resolved from codebook)
- accountNo
- subAccountNo
- updatedDate (formatted via Utils.getStringForDatetime)
- updatedBy
- operatedDate (formatted)
- operatedBy

Table behavior
- mat-sort on most columns. Sorting events update tableControl.sortColumn / sortDirection and trigger new searches.
- Row click sets selectedRow (highlight effect using 'selected-row' CSS)
- Paginator: mat-paginator bound to tableControl, triggers tableControl.onPage()

Client formatting
- idTypeName computed using Utils.getCodeNameByCodeId(this.idTypeList, idType)
- Dates formatted via Utils.getStringForDatetime

Action column buttons (per row)
- Search/View detail (icon: search)
  - Condition: visible when !isWhiteList
  - Action: onEdit(element) -> mode = 'DETAIL', selectedRow = element (parent shows consent-profile-detail component)
- Edit CIF (icon: edit)
  - Condition: visible when menu == 'profile'
  - Action: showEditCIF(element) -> open ConsentCifComponent dialog (width: 50%, data: element)
    - After close: if result falsy -> window.location.reload()
- Remove from whitelist (icon: remove)
  - Condition: visible when isWhiteList
  - Action: confirmRemoveWhitelist(element) -> show Utils.confirm(...) -> if confirm -> updateWhitelistFlag(false) -> call service.updateWhitelistFlag -> on success alert success and refresh search()

---

3) BUTTONS (main view & dialogs summary)

Main search card
- Add New Whitelist (btn) - visible on whitelist route
  - Action: displayAddNewWhitelist() -> open WhitelistDialogComponent (height:90%, width:95%). After close if result truthy -> this.search()
- Search (btn)
  - type=submit triggers onSearch()
- Clear (btn)
  - Action: clear() -> reset searchForm

In action column (per-row)
- Search/View (btn)
  - onEdit(row) -> switch to detail mode
- Edit CIF (btn)
  - showEditCIF(row) -> opens dialog
- Remove from whitelist (btn)
  - confirmRemoveWhitelist(row) -> confirm -> updateWhitelistFlag(false)

Detail view buttons (consent-profile-detail)
- Back (button in parent) -> back() -> mode = 'SEARCH' and scrollTop()
- Inside detail component (consent-profile-detail):
  - Change filter checkbox: toggles filterLatestConsentFlag and calls searchConsentAction()
  - Each consentAction row has a "view" button which:
    - onSelectActionRow(row) sets selected action and calls searchConsentActionHistoryList()
  - showConsentMaster(data) -> opens ConsentLatestComponent dialog (width: 80%)
  - openConsentCorrection() -> opens ConsentCorrectionDialogComponent (height:90%, width:95%); after close, if result truthy emit backEvent() to parent

Consent CIF dialog (consent-cif)
- New CIF input (text/number)
  - numberOnly(event) enforces numeric key input
- Save button
  - onSave() -> calls consentProfileService.updateCIF({ data: { idNo, idType, newCif } })
  - On success: Utils.alertSuccess('CIF has been updated.') then dialogRef.close()
  - On failure: Utils.alertError(...)

Withdraw Dialog
- Input: choice of type ('sms' | 'email'), pre-filled mobileNo and email come from injected data; profileId provided in injected data
- Send button
  - sendWithdrawConsent() clears messages, calls consentProfileService.sendWithdrawConsent({ data: { type, sendTo, profileId } })
  - On success -> set successMessage = 'Success'
  - On failure -> set errorMessage = result.message

Consent Latest (latest dialog)
- Displays latest consent master and content for given consentId (injected data)
- On init, fetch MULTIPLE codebooks (ENTITY_CODE, CONSENT_TYPE_CODE) then call ConsentMasterService.getConsentMaster({ data: { consentId, latestVersionFlag: 'Y' } })
- Renders consent content in selected languages, entity names resolved by codebook

Whitelist Dialog (add)
- Search sub-form: searchProfileForm (cif, idNumber, idType, entityCode)
- Validation: require cif OR idNumber (if none provided -> Utils.alertError(cp.error.searchProfileRequired))
- Search button
  - search() -> calls consentProfileService.searchConsentProfileWithoutPaging({ data: { ...form.value, whitelistFlag: 'N' } })
  - On success with data: maps idTypeName, formats dates, shows results list
  - If no data -> Utils.alertError("Data not found") and sets searchProfileNotFound = true
- Row select sets selectedConsentProfile
- Confirm add to whitelist
  - confirmUpdateWhitelistFlag() -> confirm dialog -> updateWhitelistFlag() -> call service.updateWhitelistFlag({ data: { customerId, whitelistFlag: 'Y' } })
  - On success: Utils.alertSuccess(...) then dialogRef.close(true)
  - On failure: Utils.alertError(...)

---

4) CONSENT-PROFILE-DETAIL (detail/consent-profile-detail.component.ts)

Inputs:
- @Input() searchConsentProfile: ConsentProfile (the selected row from search)
- @Input() isConsentCorrection: boolean
- @Output() backEvent: EventEmitter - parent listens to return to search

Data & controls:
- createForm: FormGroup (fields: cif, idNumber, idType, entityCode, createdBy, createdDate, updatedBy, updatedDate, filterLatestConsentFlag)
- Tables:
  - Consent Action list (dsConsentAction) with consentActionTblColumns
  - Consent Action History list (dsConsentActionHistory) with consentActionHistoryTblColumns
  - View Latest Consent actions (viewLatestConsentActionList) with viewConsentActionTblColumns
- Table controls for pagination/sorting: consentActionTableControl, consentActionHistoryTableControl, viewConsentActionTableControl

Key methods and flows:
- ngOnInit() loads codebooks ID_TYPE, CONSENT_TYPE_CODE; sets default pageSize=10; calls searchConsentActionList()
- searchConsentActionList()
  - Calls consentProfileService.getConsentProfileDetail({ data: this.searchConsentProfile.profileId })
  - Sets this.consentProfile from response, then patches createForm with consentProfile and formatted dates
  - Calls searchConsentAction() and searchViewLatestConsentAction()
- searchConsentAction()
  - Calls consentProfileService.getConsentProfileAction with ApiPageRequest:
    data: { profileId, filterLatestConsentFlag: 'Y' | null, sortColumn, sortDirection }, pageSize, pageNo
  - On success sets dsConsentAction, maps display fields (lastHistoryDate, createdDate, updatedDate, operatedDate) and consentTypeCodeName
  - If data returned, onSelectActionRow(result.data[0]) to pre-select first action
- searchConsentActionHistoryList()
  - Calls getConsentProfileActionHistory with ApiPageRequest where data includes selected consent action and sort/paging
  - On success sets dsConsentActionHistory and formats dates and resolves code names
- changeFilterLatestConsent(event)
  - Toggles filterLatestConsentFlag and re-runs searchConsentAction()

Buttons & behaviors in detail:
- Row selection on consent actions triggers onSelectActionRow -> sets consentProfileAction and searches history
- Row selection on view latest list sets selectedViewConsentAction
- showConsentMaster(data) -> open ConsentLatestComponent dialog (80% width)
- openConsentCorrection() -> open ConsentCorrectionDialogComponent (95%x90%), after close if result true emit backEvent (navigates back to list)

---

5) DIALOGS — technical behavior & API calls

ConsentProfileService endpoints (used by dialogs & components)
- POST /api/consent-profile/search (ApiPageRequest) -> ApiPageResponse<ConsentProfile[]>
- POST /api/consent-profile/searchWithoutPaging (ApiRequest) -> ApiResponse<ConsentProfile[]>
- POST /api/consent-profile/getConsentProfileDetail (ApiRequest) -> ApiResponse<ConsentProfile>
- POST /api/consent-profile/getConsentProfileAction (ApiPageRequest) -> ApiPageResponse<ConsentProfileAction[]>
- POST /api/consent-profile/getConsentProfileActionHistory (ApiPageRequest) -> ApiPageResponse<ConsentActionHistory[]>
- POST /api/consent-profile/getViewConsentProfileAction (ApiRequest) -> ApiResponse<ConsentProfileAction[]>
- POST /api/consent-profile/sendWithdrawConsent (ApiRequest) -> ApiResponse<?>
- POST /api/consent-profile/updateCIF (ApiRequest) -> ApiResponse<?>
- POST /api/whitelist/updateWhitelistFlag (ApiRequest) -> ApiResponse<boolean>

Dialog-specific payloads:
- updateCIF:
  { data: { idNo: string, idType: string, newCif: number } }
- sendWithdrawConsent:
  { data: { type: 'sms' | 'email', sendTo: string, profileId: number } }
- updateWhitelistFlag:
  { data: { customerId: number, whitelistFlag: 'Y' | 'N' } }

---

6) TRANSLATIONS & MESSAGES

Keys used in these components include (not exhaustive)
- cp.title, cp.cif, cp.idNumber, cp.idType, cp.detail
- consent-correction.title, consent-correction.detail
- whitelist.title, whitelist.addNewBtn
- cp.error.searchProfileRequired
- whitelist.confirmRemoveWhitelist.title / .content
- whitelist.confirmAddWhitelist.title / .content
- consent-correction.error.searchProfileNotFound
- button.search, button.clear, button.back

The whitelist and consent-correction dialogs rely on the translations for confirm messages and error strings.

---

7) ERROR HANDLING & USER FEEDBACK

- Utils.alertError(...) used to show errors:
  - When user-submitted validation fails (missing cif/idNumber)
  - When API returns status false
  - When no data found for a search -> "Data not found"
- Utils.alertSuccess(...) used for positive confirmations:
  - On CIF update success, whitelist update success
- Dialogs may set local errorMessage / successMessage fields (withdraw-dialog).

UX suggestions (observed & recommended)
- Avoid window.location.reload() after CIF edit; better to return a success flag from dialog and let parent re-search or update affected row.
- Show loading indicators while awaiting API responses.
- Disable Search button while request in-flight to avoid duplicates.
- Validate email/phone format in withdraw dialog for improved UX.

---

8) APPENDIX — Inferred Data Models (fields referenced)

ConsentProfile (inferred)
- profileId (used to fetch detail & actions)
- customerId (used for whitelist updates)
- cif
- idNumber
- idType
- idTypeName (resolved via codebook)
- accountNo
- subAccountNo
- updatedDate, updatedBy
- operatedDate, operatedBy
- createdDate, createdBy
- filterLatestConsentFlag
- consentTypeCode, channelCode, whitelistFlag

ConsentProfileAction (inferred)
- actionId / consentId
- consentTypeCode, consentTypeCodeName
- action / actionName
- actionEntity
- signedVersion
- channelCode, branchCode
- accountReference
- fileName
- lastHistoryDate, createdDate, createdBy, updatedDate, updatedBy, operatedDate, operatedBy

ConsentActionHistory (inferred)
- createdDate, updatedDate, operatedDate, createdBy, updatedBy, etc.
- consentTypeCode, consentTypeCodeName

---

End of specification.
