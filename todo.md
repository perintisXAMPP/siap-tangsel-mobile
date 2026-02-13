# SIAP Tangsel Mobile - Project TODO

## Database & Schema
- [x] Extend drizzle schema dengan tabel: agendas, dispositions, documents, notifications, audit_logs
- [x] Implement database migrations dan push schema ke MySQL
- [x] Create database helper functions di server/db.ts

## API & Backend (tRPC Procedures)
- [x] Create agenda router dengan procedures: list, create, update, delete, getById
- [x] Create disposition router dengan procedures: list, create, update, updateStatus, getById
- [x] Create document router dengan procedures: upload, delete, getSignedUrl
- [x] Create notification router dengan procedures: list, markAsRead, delete
- [x] Create dashboard router untuk statistik agenda dan disposisi
- [ ] Implement email notification triggers untuk agenda baru, disposisi approval, status changes
- [ ] Add vitest tests untuk semua procedures

## Frontend - Layout & Theme
- [x] Setup cyberpunk aesthetic di index.css dengan neon pink (#FF00FF), cyan (#00FFFF), background hitam (#0a0a0a)
- [x] Create global HUD-style border components dan bracket elements
- [x] Setup responsive mobile-first layout
- [x] Customize DashboardLayout untuk cyberpunk theme

## Frontend - Dashboard & Pages
- [x] Create Dashboard page dengan statistik agenda, disposisi, dan upcoming events
- [x] Create Agenda List page dengan search, filter, dan CRUD actions
- [ ] Create Agenda Detail/Form page untuk create dan edit agenda
- [x] Create Disposition List page dengan status tracking
- [ ] Create Disposition Detail page dengan approval workflow
- [ ] Create Document Management page untuk upload dan download
- [ ] Create Notifications page untuk melihat dan manage notifications
- [ ] Create Admin Settings page untuk manage users dan system settings

## Frontend - Components
- [ ] Create CyberpunkCard component dengan neon glow effect
- [ ] Create CyberpunkButton component dengan neon styling
- [ ] Create HUDHeader component dengan bracket styling
- [ ] Create StatusBadge component untuk status agenda/disposisi
- [ ] Create ApprovalWorkflow component untuk disposition approval
- [ ] Create DocumentUpload component dengan S3 integration
- [ ] Create NotificationCenter component

## Authentication & Authorization
- [ ] Verify Manus OAuth integration berfungsi dengan baik
- [ ] Implement role-based access control (user vs admin)
- [ ] Protect routes berdasarkan role
- [ ] Create admin-only procedures dan components

## Email Notifications
- [x] Integrate Manus Notification API untuk email notifications
- [x] Setup notification templates untuk: agenda baru, disposisi approval needed, status changes
- [x] Create notification service di server/_core/notification.ts
- [ ] Implement automatic email triggers di procedures

## File Storage (S3)
- [x] Verify S3 helpers di server/storage.ts
- [ ] Create document upload procedure dengan S3 integration
- [ ] Implement file metadata storage di database
- [ ] Create signed URL generation untuk secure file access
- [x] Add file type validation dan size limits

## Termux Deployment & Scripts
- [x] Create termux-install.sh script untuk instalasi dependencies
- [ ] Create termux-start.sh script untuk menjalankan server
- [ ] Create .env.termux template untuk Termux environment
- [ ] Create localhost-access guide untuk akses via smartphone browser
- [ ] Document port forwarding dan network configuration

## Documentation
- [x] Create DEPLOYMENT.md dengan langkah-langkah Termux setup
- [ ] Create API.md dengan dokumentasi semua tRPC procedures
- [ ] Create USER_GUIDE.md dengan panduan menggunakan aplikasi
- [ ] Create ARCHITECTURE.md dengan overview sistem dan data flow
- [x] Create TERMUX_SETUP.md dengan detailed Termux installation guide

## Testing & QA
- [ ] Write vitest tests untuk semua backend procedures
- [ ] Test authentication flow (login, logout, role-based access)
- [ ] Test CRUD operations untuk agenda dan disposisi
- [ ] Test email notification triggers
- [ ] Test file upload dan download via S3
- [ ] Test responsive design di berbagai ukuran layar mobile
- [ ] Test Termux deployment script
- [ ] Test localhost access dari smartphone

## Deployment & Publishing
- [ ] Create checkpoint sebelum publish
- [ ] Verify semua fitur berfungsi di production
- [ ] Setup custom domain binding (siaptangsel.id)
- [ ] Verify SSL certificate aktif
- [ ] Final QA dan user acceptance testing
