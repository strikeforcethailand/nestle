const WEB_APP_SUBMIT_URL = "https://script.google.com/macros/s/AKfycbx0i9lXq2_NJsj0m2tncRFrx_hqxksvJSdlrNvtdQvTXYaSKTmAxJgBXTx6rYuZBGZ5/exec";

async function submitForm() {
    const requiredFields = [
        "ID_Emp", "fname", "route", "store_name", 
        "latitudeInput", "longitudeInput", "fullAddressInput"
    ];
    
    let isValid = requiredFields.every(id => {
        const element = document.getElementById(id);
        return element && element.value.trim();
    });

    let shoptype = document.querySelector('input[name="shoptype"]:checked')?.value;

    if (!isValid || !shoptype) {
        Swal.fire({
            title: 'แจ้งเตือน!',
            text: 'กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน',
            icon: 'warning',
            confirmButtonText: 'OK',
        });
        return;
    }

    // ตรวจสอบว่ามีไฟล์ถูกเลือกหรือไม่
    const cameraInput = document.getElementById("cameraInput");
    if (!cameraInput || cameraInput.files.length === 0) {
        Swal.fire({
            title: 'แจ้งเตือน!',
            text: 'กรุณาเลือกไฟล์ภาพก่อนส่งข้อมูล',
            icon: 'warning',
            confirmButtonText: 'OK',
        });
        return;
    }

    // แปลงไฟล์เป็น Base64
    const file = cameraInput.files[0];
    const base64File = await convertFileToBase64(file);

    Swal.fire({
        title: 'ยืนยันการส่งข้อมูล',
        text: 'คุณแน่ใจหรือไม่ที่ต้องการส่งข้อมูล?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
    }).then(async (result) => {
        if (result.isConfirmed) {
            const submitButton = document.getElementById('submit');
            submitButton.disabled = true;

            Swal.fire({
                title: "กำลังส่งข้อมูล...",
                text: "กรุณารอสักครู่",
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                let formData = new FormData();
                formData.append("ID_Emp", document.getElementById("ID_Emp").value);
                formData.append("fname", document.getElementById("fname").value);
                formData.append("route", document.getElementById("route").value);
                formData.append("store_name", document.getElementById("store_name").value);
                formData.append("latitudeInput", document.getElementById("latitudeInput").value);
                formData.append("longitudeInput", document.getElementById("longitudeInput").value);
                formData.append("fullAddressInput", document.getElementById("fullAddressInput").value);
                formData.append("shoptype", shoptype);
                
                // แปลงไฟล์เป็น Base64 และเพิ่มลงใน formData
                formData.append("cameraInput", base64File);

                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }

                let response = await fetch(WEB_APP_SUBMIT_URL, {
                    method: "POST",
                    body: formData
                });

                let result = await response.json();

                if (result.status === "success") {
                    Swal.fire({
                        title: "สำเร็จ!",
                        text: "ส่งข้อมูลเรียบร้อยแล้ว",
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then(() => {
                        // เก็บค่า ID_Emp ไว้ก่อนรีโหลด
                        localStorage.setItem("saved_ID_Emp", document.getElementById("ID_Emp").value);

                        location.reload();
                        
                    });
                } else {
                    throw new Error(result.message || "เกิดข้อผิดพลาด");
                }

            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "ผิดพลาด!",
                    text: "ไม่สามารถส่งข้อมูลได้",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } finally {
                submitButton.disabled = false;
            }
        }
    });
}

// ฟังก์ชันแปลงไฟล์เป็น Base64
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // คืนค่า Base64 (ไม่รวมส่วนที่เกิน)
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ✅ ฟังก์ชันคืนค่า ID_Emp หลังรีโหลด
window.onload = function() {
    let savedID = localStorage.getItem("saved_ID_Emp");
    if (savedID) {
        document.getElementById("ID_Emp").value = savedID;
        localStorage.removeItem("saved_ID_Emp");
        scoreToday();
        fetchEmployeeData();
        
    }
};
