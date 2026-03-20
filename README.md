# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Đơn hàng Admin — json-server (đồng bộ nhiều máy / trình duyệt)

Đơn hàng cửa hàng chính (Greenie) được lưu qua **json-server** (`db.json`) thay vì chỉ `localStorage`, nên khi bạn chạy API trên một máy và các máy khác mở cùng site (qua mạng LAN hoặc deploy), admin sẽ thấy chung một danh sách đơn.

```sh
# Cách 1: Chạy API + Vite cùng lúc
npm run dev:full

# Cách 2: Hai terminal
npm run server   # json-server tại http://localhost:3001, đọc/ghi db.json
npm run dev      # Vite proxy /api → json-server
```

- File dữ liệu: `db.json` (mảng `orders`).
- **Máy khác trong LAN**: chạy `npm run server -- --host 0.0.0.0` (hoặc cấu hình json-server lắng nghe mọi interface) và đặt `VITE_API_URL=http://<IP-máy-chủ>:3001` trong `.env` trên máy client, hoặc chỉnh proxy/build tương ứng.
- Nếu **không** bật json-server, app tự dùng lại `localStorage` như trước.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
