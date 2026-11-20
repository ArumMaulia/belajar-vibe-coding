# Belajar Vibe Coding - Backend Project

Project backend modern dan performa tinggi menggunakan runtime **Bun**, framework **ElysiaJS**, ORM **Drizzle**, dan database **MySQL**.

---

## 🛠️ Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Framework**: [ElysiaJS](https://elysiajs.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database Driver**: [MySQL2](https://github.com/sidorares/node-mysql2)
- **Security / Hashing**: Bcrypt (`Bun.password.hash`)
- **Language**: TypeScript

---

## 📁 Struktur Direktori

```text
belajar-vibe-coding/
├── src/
│   ├── db/
│   │   ├── index.ts        # Inisialisasi pool MySQL & client Drizzle ORM
│   │   └── schema.ts       # Definisi schema database (tabel users)
│   ├── routes/
│   │   └── users-route.ts  # Routing ElysiaJS (validasi request & response)
│   ├── services/
│   │   └── users-service.ts# Logika bisnis aplikasi (cek duplikasi, hash bcrypt, DB)
│   └── index.ts            # Entry point server ElysiaJS
├── tests/
│   └── users.test.ts       # Automated unit & integration test
├── drizzle.config.ts       # Konfigurasi Drizzle Kit untuk migrasi/push
├── .env.example            # Contoh konfigurasi environment variable
├── .env                    # Konfigurasi environment lokal (diabaikan git)
├── .gitignore              # Daftar file yang diabaikan oleh Git
├── tsconfig.json           # Konfigurasi TypeScript
├── package.json            # Daftar script & dependensi project
└── README.md               # Dokumentasi project
```

---

## 🚀 Memulai (Quick Start)

### 1. Instalasi Dependensi
Pastikan [Bun](https://bun.sh/) telah terinstal di komputer Anda, lalu jalankan:
```bash
bun install
```

### 2. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan sesuaikan koneksi database MySQL Anda:
```bash
cp .env.example .env
```

Isi `.env`:
```env
PORT=3000
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=belajar_vibe_coding
```

### 3. Menjalankan Server

**Mode Pengembangan (Watch Mode):**
```bash
bun run dev
```

**Mode Produksi:**
```bash
bun run start
```

Server akan aktif di: `http://localhost:3000`

---

## 📡 Endpoint API

### 1. Status Server
- **`GET /`**: Mengecek status server.
- **`GET /health`**: Health check koneksi aktif ke database MySQL.

### 2. Registrasi Pengguna Baru
- **`POST /api/users`**
- **Header**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Eko",
    "email": "eko@localhost",
    "password": "rahasia"
  }
  ```
- **Response Success (HTTP 200)**:
  ```json
  {
    "data": "OK"
  }
  ```
- **Response Error Duplicate (HTTP 400)**:
  ```json
  {
    "error": "Email sudah terdaftar"
  }
  ```
- **Response Validation Error (HTTP 422)**:
  Jika salah satu field tidak lengkap / kosong.

---

## 🧪 Testing & Type Checking

- **Jalankan Automated Tests:**
  ```bash
  bun test
  ```

- **Type Check TypeScript:**
  ```bash
  bun run typecheck
  ```

---

## 🗄️ Manajemen Database (Drizzle ORM)

- **Sinkronisasi Schema ke Database (Prototyping/Dev):**
  ```bash
  bun run db:push
  ```

- **Generate File Migrasi SQL:**
  ```bash
  bun run db:generate
  ```

- **Jalankan Migrasi:**
  ```bash
  bun run db:migrate
  ```

- **Buka Drizzle Studio (Web GUI Database):**
  ```bash
  bun run db:studio
  ```
