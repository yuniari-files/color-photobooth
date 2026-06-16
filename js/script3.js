// --- UPDATE FULL ISI FILE SCRIPT3.JS DENGAN KODE DI BAWAH INI ---

const video = document.getElementById('video');
const flashOverlay = document.getElementById('flash-effect');
const countdownEl = document.getElementById('countdown-number');
const currentIndexEl = document.getElementById('current-index');
const totalTargetEl = document.getElementById('total-target');
const statusText = document.getElementById('status-text');

let captureCount = 0;
let totalToCapture = parseInt(localStorage.getItem('selectedCaptureMode')) || 4; 
let photos = []; 

// 1. Inisialisasi Tampilan Target Foto
totalTargetEl.innerText = totalToCapture;

// 2. Akses Kamera User
// 1. UPDATE PADA FUNGSI AKSES KAMERA (Ubah resolusi menjadi murni landscape 4:3)
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            // Mengubah permintaan resolusi menjadi standar murni landscape 4:3 (1024 x 768)
            video: { width: 1024, height: 768, facingMode: "user" }, 
            audio: false 
        });
        video.srcObject = stream;
        statusText.innerText = "GET READY!";
        
        setTimeout(startCaptureProcess, 2000);
    } catch (err) {
        console.error("Gagal akses kamera: ", err);
        statusText.innerText = "CAMERA ERROR!";
    }
}


// 3. Logika Utama Alur Ambil Foto (Looping)
async function startCaptureProcess() {
    if (captureCount < totalToCapture) {
        captureCount++;
        currentIndexEl.innerText = captureCount;
        statusText.innerText = `CAPTURING PHOTO ${captureCount}...`;
        
        // Tunggu hingga hitungan mundur 2 detik benar-benar selesai
        await runTimer(2);
        
        // Eksekusi jepret foto dan efek kilatan flash
        captureImage();
        
        // Beri jeda rileks 1.5 detik setelah jepretan sebelum masuk ke angka hitung mundur berikutnya
        setTimeout(startCaptureProcess, 1500); 
    } else {
        // Blok ini AKAN PASTI JALAN jika jumlah captureCount sudah menyamai totalToCapture
        statusText.innerText = "ALL DONE! SAVING...";
        countdownEl.innerText = "✨";
        
        // Amankan hasil array foto ke localStorage
        localStorage.setItem('capturedPhotos', JSON.stringify(photos));
        
        // Pindah otomatis ke halaman keempat setelah 2 detik proses simpan
        setTimeout(() => {
            window.location.href = 'halaman4.html';
        }, 2000);
    }
}

// 4. Fungsi Hitung Mundur (Timer 2 Detik)
function runTimer(seconds) {
    return new Promise((resolve) => {
        let current = seconds;
        countdownEl.innerText = current;

        let timer = setInterval(() => {
            current--;
            if (current > 0) {
                countdownEl.innerText = current;
            } else {
                clearInterval(timer);
                countdownEl.innerText = "📸"; // Efek visual jepret
                
                // Berikan jeda super singkat (200ms) agar emoji kamera sempat terlihat sebelum fungsi resolve() dipanggil
                setTimeout(() => {
                    countdownEl.innerText = "";
                    resolve(); // Mengizinkan alur startCaptureProcess untuk lanjut ke tahap captureImage()
                }, 200);
            }
        }, 1000);
    });
}

// 5. Fungsi Mengambil Gambar dari Video Stream ke Canvas
// --- UPDATE HANYA PADA FUNGSI CAPTUREIMAGE DI SCRIPT3.JS ---

// --- GANTI FULL FUNGSI CAPTUREIMAGE DI SCRIPT3.JS DENGAN INI ---

function captureImage() {
    // Trigger Animasi Flash Putih
    flashOverlay.classList.remove('animate-flash');
    void flashOverlay.offsetWidth; 
    flashOverlay.classList.add('animate-flash');

    const canvas = document.getElementById('capture-canvas');
    const context = canvas.getContext('2d');
    
    // 1. Tentukan ukuran target file akhir (Murni Landscape 4:3)
    const targetWidth = 800;
    const targetHeight = 600;
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // 2. Ambil ukuran asli video yang ditangkap oleh sensor kamera HP
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // 3. Logika Pintar Pemotong Gambar (Cropping): Mencegah Gepeng di Android
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = videoWidth;
    let sourceHeight = videoHeight;

    const videoRatio = videoWidth / videoHeight;
    const targetRatio = targetWidth / targetHeight;

    if (videoRatio > targetRatio) {
        // Jika sensor video terlalu lebar, potong bagian kanan-kirinya
        sourceWidth = videoHeight * targetRatio;
        sourceX = (videoWidth - sourceWidth) / 2;
    } else {
        // Jika sensor video terlalu tegak (kasus Android potret), potong bagian atas-bawahnya
        sourceHeight = videoWidth / targetRatio;
        sourceY = (videoHeight - sourceHeight) / 2;
    }

    // 4. Proses Pencerminan (Mirroring) agar hasil foto tidak terbalik kanan-kiri
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    
    // 5. Gambar ke canvas menggunakan teknik pemotongan terukur (drawImage 9 argumen)
    context.drawImage(
        video, 
        sourceX, sourceY, sourceWidth, sourceHeight, // Area video asli yang dipotong
        0, 0, targetWidth, targetHeight              // Area target kanvas landscape
    );

    // 6. Simpan hasil gambar kompresi ke array dalam bentuk JPEG
    const dataURL = canvas.toDataURL('image/jpeg', 0.7); 
    photos.push(dataURL);
}

// Jalankan sistem kamera otomatis saat halaman di-load
setupCamera();
