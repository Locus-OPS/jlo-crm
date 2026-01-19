# Security Audit Report: JLO-CRM

**Date:** 2026-01-19

## Summary
พบปัญหา security หลายจุดในระบบ แบ่งตามระดับความรุนแรง

---

## CRITICAL Issues (ต้องแก้ทันที)

### 1. Hardcoded Credentials
**File:** `src/app/pages/system/questionnaire/landing-page/landing-page.service.ts:14-18`
```typescript
private clientId = 'slipdpa';
private clientSecret = 'slipdpa123';
Authorization: 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
```
**Risk:** Credentials เห็นได้ใน source code และ browser dev tools

### 2. Unencrypted WebSocket (ws:// แทน wss://)
**Files:**
- `src/environments/environment.ts:11`
- `src/environments/environment.prod.ts:4`
```typescript
endpointWebsocket: 'ws://52.221.33.21/jlo-crm-ws/chat'
```
**Risk:** Chat data ส่งแบบไม่เข้ารหัส + IP address exposed

### 3. HTTP Environments (SIT/UAT)
**Files:**
- `src/environments/environment.sit.ts:3`
- `src/environments/environment.uat.ts:3`
```typescript
endpoint: 'http://sit-server:8080'
```
**Risk:** Credentials และ tokens ส่งแบบ plain text

### 4. Hardcoded WebSocket URLs
**Files:**
- `src/app/services/web-socket.service.ts:15` - hardcoded localhost
- `src/app/pages/chat-example/chat-example.service.ts:27` - hardcoded production URL

---

## HIGH Issues (ควรแก้โดยเร็ว)

### 5. XSS Vulnerability - innerHTML with unsanitized data
**Files:**
- `src/app/pages/integration/fbmessaging/fbmessaging.html:75`
- `src/app/pages/integration/linemessaging/linemessaging.html:109`
```html
<p [innerHTML]="getAttachmentsHtml(interaction.metadataJson)"></p>
```
**Risk:** Malicious HTML/script จาก external source สามารถ execute ได้

### 6. No CSRF Protection
**Issue:** ไม่มี CSRF token ใน state-changing requests
**Risk:** Cross-Site Request Forgery attacks

### 7. PostMessage with wildcard origin
**File:** `src/app/layouts/template/taskbar/softphone/softphone.component.ts:219,234`
```typescript
iframe.contentWindow.postMessage(JSON.stringify({...}), "*");
```
**Risk:** Data leak ไปยัง untrusted frames

### 8. Excessive Console Logging (215+ occurrences)
**Files:** 58 files มี console.log
**Risk:** Debug info และ sensitive data อาจ leak ใน production

### 9. Token Storage in sessionStorage
**File:** `src/app/shared/token-utils.ts:8-15`
**Risk:** XSS attack สามารถขโมย token ได้

---

## MEDIUM Issues

### 10. bypassSecurityTrust* Usage
**Files:**
- `src/app/pages/case/caseatt/caseatt.component.ts:201,206`
- `src/app/pages/common/modal-file/modal-file.component.ts:64,69`
- `src/app/pages/integration/linemessaging/linemessaging.ts:240`

### 11. Missing Input Validation
**File:** `src/app/pages/customer/customer-detail/customer-detail.component.ts`
**Issue:** Form fields ไม่มี validators

### 12. Username in WebSocket URL
**Files:** chat services
```typescript
new WebSocket(`${url}?username=${username}`)
```
**Risk:** Username exposed in logs และ browser history

### 13. File Type Validation by MIME only
**File:** `src/app/pages/common/modal-file/modal-file.component.ts:79-92`
**Risk:** MIME type สามารถ spoof ได้

---

## Recommended Fixes

### Priority 1 (Critical)
| Issue | Fix |
|-------|-----|
| Hardcoded credentials | ย้ายไป environment variables หรือ backend |
| WebSocket ws:// | เปลี่ยนเป็น wss:// ทุก environment |
| HTTP environments | เปลี่ยนเป็น HTTPS ทั้งหมด |
| Exposed IP | ใช้ domain name แทน |

### Priority 2 (High)
| Issue | Fix |
|-------|-----|
| XSS innerHTML | ใช้ DomSanitizer.sanitize() |
| No CSRF | Implement CSRF token |
| PostMessage "*" | ระบุ origin ที่ชัดเจน |
| Console.log | ลบออกหรือใช้ logging service |

### Priority 3 (Medium)
| Issue | Fix |
|-------|-----|
| bypassSecurityTrust | Review และ validate inputs ก่อนใช้ |
| Form validation | เพิ่ม Angular Validators |
| Username in URL | ส่งผ่าน header หรือ body แทน |

---

## Files to Modify

### Critical Fixes
1. `src/app/pages/system/questionnaire/landing-page/landing-page.service.ts`
2. `src/environments/environment.ts`
3. `src/environments/environment.prod.ts`
4. `src/environments/environment.sit.ts`
5. `src/environments/environment.uat.ts`
6. `src/app/services/web-socket.service.ts`
7. `src/app/pages/chat-example/chat-example.service.ts`

### High Priority Fixes
8. `src/app/pages/integration/fbmessaging/fbmessaging.ts`
9. `src/app/pages/integration/linemessaging/linemessaging.ts`
10. `src/app/layouts/template/taskbar/softphone/softphone.component.ts`
11. Remove console.log from 58 files

---

## Verification
- ตรวจสอบว่า credentials ไม่อยู่ใน source code
- ทดสอบว่า WebSocket ใช้ wss://
- ตรวจสอบว่าทุก environment ใช้ HTTPS
- ทดสอบ XSS โดยใส่ `<script>alert('xss')</script>` ใน input fields
- ตรวจสอบ Network tab ว่าไม่มี sensitive data ใน URL
