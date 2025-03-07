// ฟังก์ชันสำหรับดึงตำแหน่งที่ตั้งปัจจุบันของผู้ใช้
async function getLocation() {
    // ตรวจสอบว่าบราวเซอร์รองรับ Geolocation หรือไม่
    if (navigator.geolocation) {
        try {
            // แสดง spinner
            showSpinner();

            // ดึงข้อมูลตำแหน่งที่ตั้งปัจจุบัน
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            await displayLocation(position);
        } catch (error) {
            alert("Error getting location: " + error.message);
        } finally {
            // ซ่อน spinner เมื่อเสร็จสิ้น (ไม่ว่าจะสำเร็จหรือล้มเหลว)
            hideSpinner();
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
    await fetchFullAddress(latitude, longitude);
}

// ฟังก์ชันสำหรับดึงที่อยู่
async function fetchFullAddress(latitude, longitude) {
    const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    try {
        const response = await fetch(reverseGeocodingUrl);
        const data = await response.json();
        if (data.display_name) {
            // อัปเดตค่าใน input ที่อยู่
            document.getElementById("fullAddressInput").value = data.display_name;
        } else {
            console.log("Unable to retrieve full address.");
        }
    } catch (error) {
        console.error("Error fetching reverse geocoding data:", error);
    }
}

// ฟังก์ชันสำหรับแสดง spinner
function showSpinner() {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block"; // แสดง spinner
}

// ฟังก์ชันสำหรับซ่อน spinner
function hideSpinner() {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "none"; // ซ่อน spinner
}
