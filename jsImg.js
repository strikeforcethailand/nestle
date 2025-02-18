// function getTakePhoto() {
//     var fileInput = document.getElementById("cameraInput");
//     var filePath = fileInput.value;
//     var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

//     // ตรวจสอบประเภทไฟล์ที่อัพโหลด
//     if (!allowedExtensions.exec(filePath)) {
//       Swal.fire({
//         position: "center",
//         icon: "error",
//         title: "กรุณาแนบภาพเท่านั้น",
//         showConfirmButton: false,
//         timer: 1500
//       });
//       fileInput.value = '';
//       document.getElementById('latitudeInput').value = '';
//       document.getElementById('longitudeInput').value = '';
//       document.getElementById('fullAddressInput').value = '';
//       return false;
//     } else {
//       // การโหลดไฟล์ภาพ
//       if (fileInput.files && fileInput.files[0]) {
//         var file = fileInput.files[0];
//         var reader = new FileReader();

//         reader.onload = function (e) {
//           var img = new Image();
//           img.onload = function () {
//             var canvas = document.createElement('canvas');
//             var ctx = canvas.getContext('2d');

//             var maxWidth = 800;
//             var maxHeight = 800;
//             var width = img.width;
//             var height = img.height;

//             if (width > height) {
//               if (width > maxWidth) {
//                 height *= maxWidth / width;
//                 width = maxWidth;
//               }
//             } else {
//               if (height > maxHeight) {
//                 width *= maxHeight / height;
//                 height = maxHeight;
//               }
//             }

//             canvas.width = width;
//             canvas.height = height;
//             ctx.drawImage(img, 0, 0, width, height);

//             document.getElementById('imagePreviewStore').innerHTML = '<img width="200px" src="' + canvas.toDataURL('image/jpeg', 0.9) + '"/>';
//             getLocation(); // ดึงตำแหน่งที่ตั้ง         
//           };
//           img.src = e.target.result;
//         };
//         reader.readAsDataURL(file);
//       }
//     }
//   }

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

          // Display the resized image
          document.getElementById('imagePreviewStore').innerHTML = '<img width="200px" src="' + canvas.toDataURL('image/jpeg', 0.9) + '"/>';
          
          // Convert the canvas to a Blob and prepare to send to server
          var imageBlob = dataURLToBlob(canvas.toDataURL('image/jpeg', 0.9));
          sendImageToServer(imageBlob);
          
          // Get the location data
          getLocation();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

// Helper function to convert base64 to Blob
function dataURLToBlob(dataURL) {
  var binary = atob(dataURL.split(',')[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}

// Function to send the image to the server
function sendImageToServer(imageBlob) {
  var formData = new FormData();
  formData.append('cameraInput', imageBlob, 'image.jpg'); // Use the appropriate field name and file name

  // Send the data to the server using fetch
  fetch('<YOUR_GOOGLE_APPS_SCRIPT_URL>', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
