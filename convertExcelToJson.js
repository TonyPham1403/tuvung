const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

// Thư mục chứa các file Excel
const dataDir = path.join(__dirname, "data");

// Hàm đọc tất cả file Excel và tạo data.json
async function generateDataJson() {
    let allData = {};

    // Lấy danh sách file trong thư mục "data"
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith(".xlsx"));

    for (let fileName of files) {
        // Đọc file Excel
        const filePath = path.join(dataDir, fileName);
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Chuyển đổi dữ liệu sang JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Lấy bộ thủ từ tên file (VD: "口-30.xlsx" → "口")
        // const radical = fileName.split("-")[0];
        const radical = fileName.split(/[-.]/)[0];

        if (!allData[radical]) {
            allData[radical] = [];
        }
        allData[radical].push(...jsonData);
    }

    // Ghi dữ liệu vào file data.json
    fs.writeFileSync("data.json", JSON.stringify(allData, null, 4), "utf-8");
    console.log("✅ Tạo file data.json thành công!");
}

// Chạy hàm
generateDataJson();
