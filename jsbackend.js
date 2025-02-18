const WEB_APP_EMP_URL = 'https://script.google.com/macros/s/AKfycbwgR2YT0TBewko0r8Su6fofnfdS_RWlkG0FWZ-dirOzxjFXOKNiCZrgcFc1T9ZakxE/exec';

async function fetchEmployeeData() {
    // เคลียร์ค่าของ fname และ route ก่อนเริ่มการดึงข้อมูล
    document.getElementById('fname').value = '';
    document.getElementById('route').value = '';

    // แสดง spinner
    document.getElementById('spinner').style.display = 'block';
    
    const empId = document.getElementById('ID_Emp').value;
    
    if (!empId) {
        Swal.fire("กรุณากรอกรหัสพนักงาน");
        document.getElementById('spinner').style.display = 'none';  // ซ่อน spinner ถ้าไม่มี empId
        document.getElementById('shop').style.display = 'none';
        document.getElementById('storeName').style.display = 'none';
        document.getElementById('storeIMG').style.display = 'none';
        document.getElementById('latlon').style.display = 'none';
        document.getElementById('fullAddress').style.display = 'none';
        document.getElementById('submit').style.display = 'none';
        return;
    }
    
    try {
        // ส่งคำขอไปยัง Web App ของ Google Apps Script
        const response = await fetch(`${WEB_APP_EMP_URL}?empId=${empId}`);

        if (!response.ok) {
            alert('ไม่สามารถดึงข้อมูลได้');
            return;
        }

        const data = await response.json();  // รับข้อมูลที่เป็น JSON

        if (data.fname && data.route) {
            document.getElementById('fname').value = data.fname;
            document.getElementById('route').value = data.route;
            document.getElementById('shop').style.display = 'block';
            document.getElementById('storeName').style.display = 'block';
            document.getElementById('storeIMG').style.display = 'block';
            document.getElementById('latlon').style.display = 'block';
            document.getElementById('fullAddress').style.display = 'block';
            document.getElementById('submit').style.display = 'block';
        } else {
            Swal.fire("ไม่พบข้อมูลพนักงาน");
            document.getElementById('shop').style.display = 'none';
            document.getElementById('storeName').style.display = 'none';
            document.getElementById('storeIMG').style.display = 'none';
            document.getElementById('latlon').style.display = 'none';
            document.getElementById('fullAddress').style.display = 'none';
            document.getElementById('submit').style.display = 'none';
        }
    } catch (err) {
        console.error("Error fetching data:", err); // แสดงข้อผิดพลาดใน console
        Swal.fire("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
        // ซ่อน spinner หลังจากโหลดเสร็จ
        document.getElementById('spinner').style.display = 'none';
        scoreToday();
    }
}


