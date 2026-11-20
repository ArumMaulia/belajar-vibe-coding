# [Planning] Implementasi Skema Tabel Users & Endpoint Registrasi User (POST /api/users)

Dokumen ini disusun sebagai panduan implementasi tingkat tinggi (*high-level guide*) yang terstruktur, jelas, dan mudah dieksekusi oleh programmer junior atau model AI yang lebih ringan (*cost-effective*).

---

## 1. Overview Fitur
Menambahkan fitur registrasi pengguna baru (*User Registration*) pada project backend Bun + ElysiaJS + Drizzle ORM + MySQL. Fitur ini mencakup:
1. Pembaruan skema database untuk tabel `users`.
2. Hashing password menggunakan algoritma **bcrypt**.
3. Pembuatan API endpoint `POST /api/users` dengan arsitektur modular (*Separation of Concerns*) memisahkan **routes** dan **services**.

---

## 2. Spesifikasi Database (Tabel `users`)

Perbarui skema database pada file `src/db/schema.ts` dengan spesifikasi kolom berikut:

| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `INT` / `SERIAL` | Primary Key, Auto Increment |
| `name` | `VARCHAR(255)` | Not Null |
| `email` | `VARCHAR(255)` | Not Null, Unique |
| `password` | `VARCHAR(255)` | Not Null (Menyimpan hash bcrypt) |
| `created_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP`, Not Null |

---

## 3. Spesifikasi Kontrak API (API Contract)

### Endpoint:
- **Method**: `POST`
- **URL**: `/api/users`
- **Header**: `Content-Type: application/json`

### Request Body:
```json
{
  "name": "Eko",
  "email": "eko@localhost",
  "password": "rahasia"
}
```

### Response Body:

#### 1. Skenario Berhasil (HTTP 200 / 201)
```json
{
  "data": "OK"
}
```

#### 2. Skenario Error - Email Duplikat (HTTP 400)
Jika email yang didaftarkan sudah ada di tabel database:
```json
{
  "error": "Email sudah terdaftar"
}
```

#### 3. Skenario Error - Validasi Input (HTTP 400 / 422)
Jika field `name`, `email`, atau `password` kosong/tidak valid:
```json
{
  "error": "Pesan validasi yang sesuai"
}
```

---

## 4. Struktur Folder & Penamaan File

Proyek wajib menggunakan arsitektur modular dengan memisahkan routing dan logika bisnis di dalam direktori `src/`:

```text
src/
├── db/
│   ├── index.ts             # Koneksi database & instance Drizzle
│   └── schema.ts            # Definisi skema tabel users
├── routes/
│   └── users-route.ts       # Definisi endpoint ElysiaJS (routing & validasi request)
├── services/
│   └── users-service.ts     # Logika bisnis (cek email duplikat, hash bcrypt, simpan ke DB)
└── index.ts                 # Entry point server (mount routes ke aplikasi Elysia)
```

**Aturan Penamaan:**
- Folder `src/routes/` menggunakan konvensi: `*-route.ts` (contoh: `users-route.ts`).
- Folder `src/services/` menggunakan konvensi: `*-service.ts` (contoh: `users-service.ts`).

---

## 5. Tahapan Implementasi (Step-by-Step Guide)

Ikuti tahapan berikut secara berurutan:

### Tahap 1: Memperbarui Skema Database Drizzle
1. Buka file `src/db/schema.ts`.
2. Pastikan kolom tabel `users` memiliki:
   - `id`: serial/int primary key.
   - `name`: varchar(255) not null.
   - `email`: varchar(255) not null unique.
   - `password`: varchar(255) not null.
   - `created_at`: timestamp not null default current timestamp.
3. Jalankan perintah migrasi/push schema ke MySQL:
   ```bash
   bun run db:push
   ```

### Tahap 2: Membuat Business Logic (`src/services/users-service.ts`)
1. Buat file baru `src/services/users-service.ts`.
2. Definisikan tipe input registrasi:
   ```ts
   export interface RegisterUserInput {
     name: string;
     email: string;
     password: string;
   }
   ```
3. Buat fungsi registrasi (misal `registerUser(input: RegisterUserInput)`):
   - **Langkah 2a**: Cek keberadaan user berdasarkan email di database:
     Gunakan query Drizzle: `await db.select().from(users).where(eq(users.email, input.email))`.
   - **Langkah 2b**: Jika data ditemukan, lemparkan error atau kembalikan indikator error:
     `throw new Error("Email sudah terdaftar");`
   - **Langkah 2c**: Lakukan hashing pada password menggunakan bcrypt.
     > **Rekomendasi Bun**: Gunakan fungsi bawaan runtime Bun yang sangat cepat tanpa package tambahan:
     > ```ts
     > const hashedPassword = await Bun.password.hash(input.password, {
     >   algorithm: "bcrypt",
     >   cost: 10,
     > });
     > ```
   - **Langkah 2d**: Masukkan data baru ke tabel `users` melalui Drizzle:
     ```ts
     await db.insert(users).values({
       name: input.name,
       email: input.email,
       password: hashedPassword,
     });
     ```
   - **Langkah 2e**: Kembalikan hasil sukses.

### Tahap 3: Membuat Routing Elysia (`src/routes/users-route.ts`)
1. Buat file baru `src/routes/users-route.ts`.
2. Buat sub-plugin Elysia menggunakan prefix `/api`:
   ```ts
   import { Elysia, t } from "elysia";
   import { registerUser } from "../services/users-service";

   export const usersRoute = new Elysia({ prefix: "/api" })
     .post(
       "/users",
       async ({ body, set }) => {
         try {
           await registerUser(body);
           return { data: "OK" };
         } catch (error: any) {
           if (error.message === "Email sudah terdaftar") {
             set.status = 400;
             return { error: "Email sudah terdaftar" };
           }
           set.status = 500;
           return { error: "Terjadi kesalahan pada server" };
         }
       },
       {
         body: t.Object({
           name: t.String({ minLength: 1 }),
           email: t.String({ format: "email" }),
           password: t.String({ minLength: 1 }),
         }),
       }
     );
   ```

### Tahap 4: Daftarkan Route ke Aplikasi Utama (`src/index.ts`)
1. Buka file `src/index.ts`.
2. Import `usersRoute` dari `./routes/users-route`.
3. Pasang (*mount*) route tersebut ke instance utama Elysia menggunakan `.use(usersRoute)`.

### Tahap 5: Pengujian & Verifikasi
1. Jalankan server:
   ```bash
   bun run dev
   ```
2. **Uji Skenario Berhasil**:
   Kirim request HTTP POST menggunakan `curl` atau REST Client:
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d "{\"name\":\"Eko\",\"email\":\"eko@localhost\",\"password\":\"rahasia\"}"
   ```
   **Hasil yang diharapkan**: Status HTTP 200/201 dan body `{"data":"OK"}`.

3. **Uji Skenario Email Duplikat**:
   Kirim kembali request yang sama persis untuk kedua kalinya.
   **Hasil yang diharapkan**: Status HTTP 400 dan body `{"error":"Email sudah terdaftar"}`.

4. **Verifikasi Keamanan Password**:
   Periksa isi database atau log untuk memastikan kolom `password` tersimpan dalam format hash bcrypt (diawali `$2b$` atau `$2a$`), bukan teks asli (*plain text*).

5. **Typecheck & Linter**:
   Pastikan tidak ada error TypeScript:
   ```bash
   bun run typecheck
   ```

---

## 6. Acceptance Criteria (Definition of Done)
- [ ] Tabel `users` memiliki kolom `id`, `name`, `email` (unique), `password`, dan `created_at`.
- [ ] Folder `src/routes/` dan `src/services/` telah dibuat dengan konvensi penamaan `users-route.ts` dan `users-service.ts`.
- [ ] Password user berhasil di-hash menggunakan bcrypt sebelum disimpan ke database.
- [ ] `POST /api/users` mengembalikan `{"data": "OK"}` saat data valid dan email belum pernah didaftarkan.
- [ ] `POST /api/users` mengembalikan `{"error": "Email sudah terdaftar"}` dengan status HTTP 400 saat email sudah ada di database.
- [ ] `bun run typecheck` berjalan sukses tanpa error.
