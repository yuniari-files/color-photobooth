document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil data pilihan dari halaman sebelumnya
    const storedPhotos = JSON.parse(localStorage.getItem("capturedPhotos")) || [];
    const selectedTheme = localStorage.getItem("selectedFrameTheme") || "pink";
    
    const finalStrip = document.getElementById("final-strip");
    const photosStage = document.getElementById("photos-stage");
    const btnDownload = document.getElementById("btn-download");
    const btnRestart = document.getElementById("btn-restart");

    // Kembalikan ke awal jika data tidak ditemukan
    if (storedPhotos.length === 0) {
        alert("Data foto tidak ditemukan!");
        window.location.href = "index.html";
        return;
    }

    // 2. Terapkan tema warna pada strip
    finalStrip.classList.add(`theme-${selectedTheme}`);

    // 3. Tampilkan semua foto ke dalam list frame preview
    storedPhotos.forEach(photoBase64 => {
        const img = document.createElement("img");
        img.src = photoBase64;
        img.classList.add("captured-item");
        photosStage.appendChild(img);
    });

    // 4. Logika Tombol Download (Menyatukan komponen ke satu gambar Canvas)
    btnDownload.addEventListener("click", () => {
        const canvas = document.getElementById("export-canvas");
        const ctx = canvas.getContext("2d");

        // Pengaturan Ukuran Kanvas Ekspor (High Resolution agar cetakan tajam)
        const photoWidth = 800;
        const photoHeight = 600;
        const paddingSide = 50;
        const paddingTop = 60;
        const gap = 40;
        const footerHeight = 80;

        const totalPhotos = storedPhotos.length;
        
        // Hitung total dimensi file gambar akhir secara dinamis
        canvas.width = photoWidth + (paddingSide * 2);
        canvas.height = paddingTop + (totalPhotos * photoHeight) + ((totalPhotos - 1) * gap) + footerHeight;

        // A. Gambar Background Frame sesuai tema pilihan
        // --- CARI DAN UPDATE BAGIAN INI DI DALAM SCRIPT5.JS ---

// A. Gambar Background Frame sesuai tema pilihan usersecara akurat
if (selectedTheme === "blue") {
    ctx.fillStyle = "#d0e8f2"; // Warna Biru Pastel
} else if (selectedTheme === "yellow") {
    ctx.fillStyle = "#fff06a"; // Warna Kuning Pastel (Baru!)
} else if (selectedTheme === "green") {
    ctx.fillStyle = "#75ff79"; // Warna Hijau Pastel (Baru!)
} else if (selectedTheme === "purple") {
    ctx.fillStyle = "#ed8aff"; // Warna Ungu Pastel (Baru!)
} else {
    ctx.fillStyle = "#ffd1dc"; // Warna Pink Pastel (Default)
}

// Setelah menentukan warna di atas, canvas akan mewarnai background dengan benar
ctx.fillRect(0, 0, canvas.width, canvas.height);

// --- SISA KODE DI BAWAHNYA TETAP SAMA ---

        // B. Gambar Garis Pinggir Luar (Border Tebal)
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#231f32";
        ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

        // C. Gambar Semua Foto Satu per Satu ke Canvas secara Berurutan
        let loadedCount = 0;
        storedPhotos.forEach((base64Str, index) => {
            const imgObj = new Image();
            imgObj.src = base64Str;
            imgObj.onload = () => {
                const currentY = paddingTop + (index * (photoHeight + gap));
                
                // Gambar latar putih tipis di balik foto sebagai aksen border item
                ctx.fillStyle = "#231f32";
                ctx.fillRect(paddingSide - 4, currentY - 4, photoWidth + 8, photoHeight + 8);
                
                // Gambar foto landscape-nya
                ctx.drawImage(imgObj, paddingSide, currentY, photoWidth, photoHeight);

                loadedCount++;
                // Jika semua foto selesai digambar, lanjut gambar teks footer & unduh
                if (loadedCount === totalPhotos) {
                    drawFooterAndTriggerDownload(canvas, ctx, footerHeight);
                }
            };
        });
    });

    // Fungsi tambahan untuk mencetak teks footer di bawah jajaran foto
    function drawFooterAndTriggerDownload(canvas, ctx, footerHeight) {
        ctx.fillStyle = "#231f32";
        ctx.font = "bold 28px 'Courier New'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Posisikan teks tepat di area bawah frame
        ctx.fillText("YUNIARI BOOTH", canvas.width / 2, canvas.height - (footerHeight / 2));

        // Trigger download otomatis lewat tautan virtual anchor
        const link = document.createElement("a");
        link.download = `yuniari-booth-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    // 5. Logika Tombol Sesi Baru (Mengulang dari awal)
    btnRestart.addEventListener("click", () => {
        localStorage.removeItem("capturedPhotos");
        localStorage.removeItem("selectedCaptureMode");
        localStorage.removeItem("selectedFrameTheme");
        window.location.href = "index.html"; // Sesuaikan dengan nama file halaman utamamu
    });
});