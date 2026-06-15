document.addEventListener("DOMContentLoaded", () => {
    // Mengambil data foto dari halaman ketiga
    const storedPhotos = JSON.parse(localStorage.getItem("capturedPhotos")) || [];
    
    const previewPink = document.getElementById("preview-pink");
    const previewBlue = document.getElementById("preview-blue");
    const previewYellow = document.getElementById("preview-yellow");
    const previewGreen = document.getElementById("preview-green");
    const previewPurple = document.getElementById("preview-purple");

    // Validasi jika data foto kosong (misal user lompat halaman langsung)
    if (storedPhotos.length === 0) {
        alert("Belum ada foto yang diambil! Silakan kembali ke halaman awal.");
        window.location.href = "index.html";
        return;
    }

    // Fungsi untuk merender foto ke dalam container strip
    function renderPreviews(containerElement) {
        storedPhotos.forEach(photoBase64 => {
            const img = document.createElement("img");
            img.src = photoBase64;
            img.classList.add("captured-item");
            containerElement.appendChild(img);
        });
    }

    // Suntik foto ke kedua template tema
    renderPreviews(previewPink);
    renderPreviews(previewBlue);
    renderPreviews(previewYellow);
    renderPreviews(previewGreen);
    renderPreviews(previewPurple);

    // Event Listener untuk tombol pemilihan tema
    const themeCards = document.querySelectorAll(".frame-option-card");
    themeCards.forEach(card => {
        card.addEventListener("click", () => {
            const selectedTheme = card.getAttribute("data-theme");
            
            // Menyimpan tema warna terpilih (pink / blue) ke localStorage
            localStorage.setItem("selectedFrameTheme", selectedTheme);
            
            // Pindah ke halaman kelima / halaman cetak akhir
            // Gantilah 'halaman5.html' sesuai nama file finalmu nanti
            window.location.href = "halaman5.html";
        });
    });
});