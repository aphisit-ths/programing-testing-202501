# User Management API

## Overview
RESTful API สำหรับการจัดการข้อมูลผู้ใช้ พัฒนาด้วย Elysia.js, Bun และ SQLite

## การติดตั้ง

```bash
# ติดตั้ง dependencies
bun install

# สร้างฐานข้อมูล
touch mydb.sqlite

# รัน migrations
bun run db:migrate

# เพิ่มข้อมูลตัวอย่าง
bun run db:seed
```

## การเริ่มต้นใช้งาน

```bash
# Development mode
bun run dev

# หรือใช้ Docker
docker build -t user-api .
docker run -p 7777:7777 user-api
```

## API Endpoints

- **GET /api/user** - ดึงข้อมูลผู้ใช้ทั้งหมด (พร้อม pagination และ search)
    - Query params: `q`, `start`, `limit`, `sortBy`, `order`
- **GET /api/user/:id** - ดึงข้อมูลผู้ใช้ตาม ID
- **POST /api/user** - สร้างผู้ใช้ใหม่
- **PUT /api/user/:id** - อัปเดตข้อมูลผู้ใช้
- **DELETE /api/user/:id** - ลบข้อมูลผู้ใช้ (soft delete)

## คำสั่งที่ใช้บ่อย

```bash
# รัน application
bun run dev

# สร้าง migration ใหม่
bun run db:generate

# รีเซ็ตฐานข้อมูล
make db-reset
```

## การ Deploy ด้วย Docker Compose

```bash
# สร้างและรัน container
docker-compose up -d

# ดู logs
docker-compose logs -f

# หยุด container
docker-compose down
```

## โครงสร้างโปรเจค

```
src/
├── controllers/   # API endpoints
├── db/            # Database config, migrations, schema
├── middleware/    # Middleware functions
├── repo/          # Repository layer
└── utils/         # Utility functions
```