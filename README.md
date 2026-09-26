# Product RESTful API - CI/CD Pipeline

Dự án Product API xây dựng theo quy chuẩn DevOps & CI/CD khép kín:
**Local Code $\rightarrow$ GitHub Actions $\rightarrow$ Docker Hub $\rightarrow$ Local Docker Engine (Watchtower)**.

---

## 1. Công nghệ sử dụng
- **Backend:** Node.js, Express.js
- **Database:** MongoDB & Mongoose ODM
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions (Service Containers, Secrets, Automated Build & Push)
- **Registry:** Docker Hub (`nguyendinhhao/product-api:latest`)
- **CD Automation:** Watchtower

---

## 2. API Endpoints
- `GET /health`: Kiểm tra sức khỏe hệ thống và trạng thái kết nối MongoDB.
- `POST /api/products`: Thêm mới sản phẩm (`pid`, `pname`, `price`, `quantity`).
- `GET /api/products`: Lấy toàn bộ danh sách sản phẩm.
- `GET /api/products/:pid`: Lấy thông tin chi tiết một sản phẩm theo `pid`.
- `PUT /api/products/:pid`: Cập nhật thông tin sản phẩm theo `pid`.
- `DELETE /api/products/:pid`: Xóa sản phẩm theo `pid`.

---

## 3. Tổng kết 14 bước thực hiện

| Bước | Nội dung công việc | Kết quả | Chi tiết kiểm chứng |
| :---: | :--- | :---: | :--- |
| **1** | Xóa ngữ cảnh cũ, thiết lập hướng dẫn cơ bản & kiểm tra khách quan | **ĐẠT** | Xác thực: Git 2.46, Docker Engine 29.4.2, Node v24.14, npm 11.11. |
| **2** | Tạo mới repository rỗng `product-api` trên GitHub | **ĐẠT** | Repository: `https://github.com/NguyenDinhHao1709/product-api.git` |
| **3** | Clone repo về máy bằng terminal VS Code | **ĐẠT** | Clone vào `P1/product-api/`, khởi tạo nhánh `main`. |
| **4** | Kết nối Docker Desktop với Visual Studio Code | **ĐẠT** | Docker Engine kết nối ổn định qua terminal. |
| **5** | Tạo container MongoDB cơ bản tên `nammongodb` | **ĐẠT** | Container `nammongodb` chạy độc lập ở port `27017`. |
| **6** | Xây dựng RESTful API CRUD Product với Mongoose & `.env` | **ĐẠT** | Hoàn thành `server.js`, `test.js` kiểm thử 100% 5 thao tác CRUD. |
| **7** | Dockerize cho `product-api` | **ĐẠT** | `Dockerfile` (Node 20 Alpine) & `.dockerignore`, image tối ưu ~54.5 MB. |
| **8** | Sử dụng Docker Compose | **ĐẠT** | `docker-compose.yml` điều phối mạng nội bộ kết nối `product-api` và `mongodb`. |
| **9** | Thêm healthcheck cho MongoDB + Product API | **ĐẠT** | `mongosh ping` và `/health`; cả 2 container đạt trạng thái `(healthy)`. |
| **10** | Viết `.github/workflows/test-productci.yml` đơn giản cho CI | **ĐẠT** | GitHub Actions Workflow test cơ bản hoàn thành. |
| **11** | Viết `.github/workflows/test-productci-prod.yml` test CRUD + MongoDB Service Container | **ĐẠT** | MongoDB Service Container chạy trên runner, pass toàn bộ test CRUD thực tế. |
| **12** | Thực hiện CD đẩy image lên Docker Hub khi CI đạt | **ĐẠT** | Tự động build & push image `nguyendinhhao/product-api:latest` lên Docker Hub. |
| **13** | Tạo `docker-compose-prod.yaml` chạy image từ Docker Hub | **ĐẠT** | Kéo và chạy trực tiếp image từ Docker Hub trên Docker Engine local. |
| **14** | Tự động hóa quá trình CD: GitHub Actions → Docker Hub → Local Engine | **ĐẠT** | Tích hợp Watchtower và `deploy-local.ps1`; tự động phát hiện image mới và cập nhật zero-touch. |

---

## 4. Hướng dẫn chạy nhanh

### Khởi chạy môi trường Production:
```bash
docker compose -f docker-compose-prod.yaml up -d
```

### Chạy kiểm thử tự động toàn bộ CRUD:
```bash
node test.js
```
