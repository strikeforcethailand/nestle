function getTakePhoto() {
    var fileInput = document.getElementById("cameraInput");
    var filePath = fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    // ตรวจสอบประเภทไฟล์ที่อัพโหลด
    if (!allowedExtensions.exec(filePath)) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "กรุณาแนบภาพเท่านั้น",
        showConfirmButton: false,
        timer: 1500
      });
      fileInput.value = '';
      document.getElementById('latitudeInput').value = '';
      document.getElementById('longitudeInput').value = '';
      document.getElementById('fullAddressInput').value = '';
      return false;
    } else {
      // การโหลดไฟล์ภาพ
      if (fileInput.files && fileInput.files[0]) {
        var file = fileInput.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
          var img = new Image();
          img.onload = function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            var maxWidth = 800;
            var maxHeight = 800;
            var width = img.width;
            var height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            document.getElementById('imagePreviewStore').innerHTML = '<img width="200px" src="' + canvas.toDataURL('image/jpeg', 0.9) + '"/>';
            getLocation(); // ดึงตำแหน่งที่ตั้ง         
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }