document.addEventListener("DOMContentLoaded", () => {
    const optionCards = document.querySelectorAll(".option-card");

    optionCards.forEach(card => {
        // Event listener saat kartu opsi atau tombol di dalamnya diklik
        card.addEventListener("click", () => {
            // Mengambil nilai atribut data-capture (3, 4, atau 6)
            const totalCaptures = card.getAttribute("data-capture");
            
            // Menyimpan pilihan user ke localStorage agar bisa diakses di halaman 3
            localStorage.setItem("selectedCaptureMode", totalCaptures);
            
            // Mengarahkan user menuju halaman ketiga (sesuaikan nama filenya nanti)
            window.location.href = "halaman3.html";
        });
    });
});