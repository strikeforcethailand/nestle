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
