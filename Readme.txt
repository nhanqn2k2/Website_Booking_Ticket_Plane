Các bước để chạy project
B1: clone dự án về.
B2: Bật terminal
B3: cd vào folder plane
B4: gõ npm install để tải các thư viện cần thiết
B5: set up database
B6: gõ npm start để chạy dự án
B7: bật trình duyệt lên và truy cập vào http://localhost:3000/

- Các bước set up database như sau:
* Đầu tiên bạn phải đảm bảo thiết bị của bạn đã được cài đặt MongoDB Command Line 
Database Tools.
* Nếu chưa cài đặt thì bạn có thể cài đặt ở link sau:
https://www.mongodb.com/try/download/database-tools
* Tìm trong đường link mục có tên MongoDB Command Line Database Tools Download tải về file
zip. Sau đó unzip tệp vừa tải, tiếp theo vào trong thư mục bin của tệp vừa tải copy hết tất
cả các file có đuôi .exe.
* Tiếp đến vào thư mục mà bạn tải mongodb vào trong thư mục bin và paste tất cả các file
.exe vừa copy vào, nếu có thông báo thì cứ chọn replace. Như vậy là đã cài đặt thành công.
* Sau đó bật Power Shell lên và gõ lệnh sau:
mongorestore -d plane_nodejs path/plane_nodejs
** Path là đường dẫn đến folder plane_nodejs trong thư mục database của dự án.