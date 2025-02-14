  // ฟังก์ชันสำหรับดึงตำแหน่งที่ตั้งปัจจุบันของผู้ใช้
async function getLocation() {
    // ตรวจสอบว่าบราวเซอร์รองรับ Geolocation หรือไม่
    if (navigator.geolocation) {
        try {
            // ดึงข้อมูลตำแหน่งที่ตั้งปัจจุบัน
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            await displayLocation(position);
        } catch (error) {
            alert("Error getting location: " + error.message);
        }
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// ฟังก์ชันสำหรับแสดงตำแหน่งที่ตั้งในหน้าเว็บ
async function displayLocation(position) {
    // ดึงข้อมูลละติจูดและลองจิจูดจากตำแหน่งที่ตั้ง
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // อัปเดตค่าของ input ที่เกี่ยวข้องกับละติจูดและลองจิจูด
    document.getElementById("latitudeInput").value = latitude;
    document.getElementById("longitudeInput").value = longitude;

    // ดึงที่อยู่จากบริการ reverse geocoding โดยใช้ละติจูดและลองจิจูด
    const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    try {
        const response = await fetch(reverseGeocodingUrl);
        const data = await response.json();
        if (data.display_name) {
            // อัปเดตค่าใน input ที่อยู่
            const fullAddress = data.display_name;
            document.getElementById("fullAddressInput").value = fullAddress;
        } else {
            console.log("Unable to retrieve full address.");
        }
    } catch (error) {
        console.error("Error fetching reverse geocoding data:", error);
    }
}



// ฟังก์ชันสำหรับดึงเวลาปัจจุบันในกรุงเทพ
function getCurrentTimeInBangkok() {
    const now = new Date();
    const bangkokTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));

    // แปลงเวลาเป็นรูปแบบ HH:MM
    const hours = String(bangkokTime.getHours()).padStart(2, '0');
    const minutes = String(bangkokTime.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// ตั้งค่าเวลาปัจจุบันของกรุงเทพใน input ที่ชื่อว่า currentTime
document.getElementById('currentTime').value = getCurrentTimeInBangkok();

// ฟังก์ชันสำหรับดึงวันที่ในรูปแบบที่กำหนด
function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
}

// ตั้งค่าวันที่ปัจจุบันใน input ที่ชื่อว่า todayInput
document.getElementById('todayInput').value = getFormattedDate();

// ฟังก์ชันสำหรับจัดการขั้นตอนการทำงาน
let currentStep = 1;
function nextStep() {
    // ไปยังขั้นตอนถัดไป
    if (currentStep < 3) {
        document.getElementById(`step${currentStep}`).style.display = 'none';
        currentStep++;
        document.getElementById(`step${currentStep}`).style.display = 'block';
    }
}