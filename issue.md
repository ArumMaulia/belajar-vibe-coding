# [Planning] Inisialisasi Project Backend: Bun, ElysiaJS, Drizzle ORM & MySQL

## 1. Overview & Objective
Dokumen planning ini digunakan sebagai panduan tingkat tinggi (*high-level guide*) bagi implementor (programmer atau model AI) untuk menginisialisasi project backend baru di folder ini dengan performa tinggi menggunakan runtime Bun, web framework ElysiaJS, dan Drizzle ORM yang terhubung ke database MySQL.

---

## 2. Tech Stack
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Web Framework**: [ElysiaJS](https://elysiajs.com/)
- **ORM & Migration Tool**: [Drizzle ORM](https://orm.drizzle.team/) (`drizzle-orm`, `drizzle-kit`)
- **Database Driver**: MySQL Client (e.g., `mysql2`)
- **Language**: TypeScript

---

## 3. High-Level Milestones

### Milestone 1: Inisialisasi Project & Dependensi
- Inisialisasi project baru menggunakan Bun (`bun init`).
- Pasang dependensi utama:
  - Framework: `elysia`
  - ORM: `drizzle-orm` dan driver MySQL (`mysql2`)
- Pasang dependensi pengembangan (*dev dependencies*):
  - `drizzle-kit` (untuk migrasi dan schema management)
  - Type definition yang relevan (misal `@types/bun`)

### Milestone 2: Konfigurasi Environment & Database
- Buat file template environment (`.env.example` dan `.env`) untuk menyimpan kredensial database MySQL (host, port, user, password, database name).
- Konfigurasi koneksi database menggunakan Drizzle ORM dengan konektor MySQL.
- Setup konfigurasi `drizzle.config.ts` untuk keperluan schema push / migration.
- Definisikan satu schema tabel contoh awal (misal: tabel `users` atau health check table) untuk memvalidasi integrasi Drizzle.

### Milestone 3: Server Setup (ElysiaJS)
- Buat entry point aplikasi (misal `src/index.ts`).
- Inisialisasi server ElysiaJS dengan port yang dapat dikonfigurasi via environment variable (default: `3000`).
- Sediakan minimal dua endpoint dasar:
  - `GET /`: Sambutan / status aplikasi dasar.
  - `GET /health`: Health check endpoint yang memvalidasi koneksi aktif ke database MySQL.

### Milestone 4: Scripts & Workflow
- Tambahkan script standar pada `package.json`:
  - `dev`: Menjalankan server dalam watch mode (`bun --watch src/index.ts`).
  - `start`: Menjalankan server dalam mode produksi (`bun src/index.ts`).
  - `db:generate` & `db:push` / `db:migrate`: Script bantuan untuk sinkronisasi schema Drizzle ke MySQL.

---

## 4. Rekomendasi Struktur Direktori (High-Level)
Implementor dapat mengadaptasi struktur sederhana berikut:
```text
.
├── src/
│   ├── db/
│   │   ├── index.ts        # Setup koneksi Drizzle & client MySQL
│   │   └── schema.ts       # Definisi schema database
│   ├── routes/             # (Opsional) Pemisahan route modular
│   └── index.ts            # Entry point server Elysia
├── drizzle.config.ts       # Konfigurasi Drizzle Kit
├── .env.example            # Template variabel environment
├── .gitignore              # Mengabaikan node_modules, .env, dll.
├── tsconfig.json           # Konfigurasi TypeScript
├── package.json
└── README.md               # Panduan singkat menjalankan project
```

---

## 5. Acceptance Criteria (Definition of Done)
1. Project dapat berjalan tanpa error menggunakan perintah `bun run dev`.
2. Endpoint `GET /` atau `GET /health` dapat diakses dan mengembalikan respons JSON yang valid.
3. Konfigurasi Drizzle ORM terhubung ke MySQL dan script Drizzle (`drizzle-kit`) dapat dijalankan untuk inspeksi atau push schema.
4. Kredensial database tidak di-hardcode (menggunakan `.env` dan menyertakan `.env.example`).
5. Dokumentasi singkat (`README.md`) tersedia yang memuat cara install, setup database, dan menjalankan server.

---

## 6. Petunjuk Khusus untuk Implementor
- Pertahankan kode tetap modular, bersih, dan menggunakan type safety bawaan TypeScript & Elysia.
- Hindari konfigurasi yang berlebihan di tahap awal (*keep it simple*); fokus pada stabilitas pondasi integrasi Bun + Elysia + Drizzle + MySQL.
