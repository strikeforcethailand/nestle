const WEB_APP_SCORE_URL = 'https://script.google.com/macros/s/AKfycbyPCYJvdenyPhDMbiQHq68gvLDc6jJY9p22SHaCOoQKGcJ5VcVyZ-KQFxnLQwPjUfGv/exec';
async function scoreToday() {
    const empId = document.getElementById('ID_Emp').value;
    const scoreElement = document.getElementById('score');

    if (!empId) {
        scoreElement.innerHTML = "<h5>0/100</h5>";
        return;
    }

    try {
        console.log("Fetching score for empId:", empId); // Log ก่อน fetch

        const response = await fetch(`${WEB_APP_SCORE_URL}?empId=${empId}`);
        
        console.log("Response status:", response.status); // ดูว่า API ตอบอะไรกลับมา
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.text();
        console.log("Score received:", data); // ดูค่าที่ได้รับ

        scoreElement.innerHTML = `<h5>${data}/100</h5>`;
    } catch (error) {
        console.error("Error:", error);
        scoreElement.innerHTML = "<h5>0/100</h5>";
    }
}


// const WEB_APP_SCORE_URL = 'https://script.google.com/macros/s/AKfycbyPCYJvdenyPhDMbiQHq68gvLDc6jJY9p22SHaCOoQKGcJ5VcVyZ-KQFxnLQwPjUfGv/exec';

// async function scoreToday() {
//     const empId = document.getElementById('ID_Emp').value.trim();
//     const scoreElement = document.getElementById('score');

//     if (!empId) {
//         scoreElement.innerHTML = "<h5>0/100</h5>";
//         return;
//     }

//     // ใช้ cache ลดจำนวน request ซ้ำ ๆ
//     if (sessionStorage.getItem(`score_${empId}`)) {
//         scoreElement.innerHTML = `<h5>${sessionStorage.getItem(`score_${empId}`)}/100</h5>`;
//         return;
//     }

//     try {
//         console.log("📡 Fetching score for empId:", empId);

//         // ใช้ fetch กับ timeout และ retry
//         const data = await fetchWithTimeout(`${WEB_APP_SCORE_URL}?empId=${empId}`, 5000, 3);
        
//         console.log("✅ Score received:", data);
        
//         scoreElement.innerHTML = `<h5>${data}/100</h5>`;
//         sessionStorage.setItem(`score_${empId}`, data); // เก็บ cache เพื่อลดโหลดซ้ำ
//     } catch (error) {
//         console.error("❌ Error fetching score:", error);
//         scoreElement.innerHTML = "<h5>0/100</h5>";
//     }
// }

// // ฟังก์ชัน fetch พร้อม timeout และ retry
// async function fetchWithTimeout(url, timeout = 5000, retries = 3) {
//     for (let i = 0; i < retries; i++) {
//         try {
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), timeout);

//             const response = await fetch(url, { signal: controller.signal });
//             clearTimeout(timeoutId);

//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//             return await response.text(); // เปลี่ยนเป็น response.json() ถ้า API ส่ง JSON
//         } catch (error) {
//             console.warn(`⚠️ Fetch attempt ${i + 1} failed:`, error);
//             if (i === retries - 1) throw error;
//         }
//     }
// }
