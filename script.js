const imgInput = document.getElementById('imgInput');
const imagePreview = document.getElementById('imagePreview');

// Preview gambar yang diunggah
imgInput.addEventListener('change', function() {
    imagePreview.innerHTML = ''; // Reset preview
    const files = imgInput.files;

    if (files.length === 0) {
        alert("Please select at least one image.");
        return;
    }

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            imagePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// Fungsi untuk mengonversi gambar menjadi PDF
async function convertToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const files = imgInput.files;

    if (files.length === 0) {
        alert("Please upload images first.");
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const img = await loadImage(URL.createObjectURL(files[i]));
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (img.height / img.width) * imgWidth;

        pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);

        // Tambah halaman baru kecuali di halaman terakhir
        if (i < files.length - 1) {
            pdf.addPage();
        }
    }

    pdf.save("converted.pdf");
}

// Fungsi untuk memuat gambar
function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
    });
}

function startConversion() {
    document.getElementById('imgInput').click();
}

function previewImages() {
    // Fungsi untuk menangani preview gambar dan konversi ke PDF (gunakan fungsi yang sudah ada)
}

function startPdfToImage() {
    document.getElementById('pdfInput').click();
}

// Fungsi untuk mengonversi PDF ke gambar
function convertPdfToImage() {
    const fileInput = document.getElementById('pdfInput');
    const file = fileInput.files[0];

    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const pdfData = new Uint8Array(e.target.result);

            // Menggunakan pdf.js untuk mengonversi PDF ke gambar
            pdfjsLib.getDocument(pdfData).promise.then(pdf => {
                pdf.getPage(1).then(page => { // Mengambil halaman pertama dari PDF
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    const viewport = page.getViewport({ scale: 1 });

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise.then(() => {
                        // Menampilkan gambar di halaman
                        const img = document.createElement('img');
                        img.src = canvas.toDataURL();
                        document.body.appendChild(img); // Menambahkan gambar ke halaman
                    });
                });
            });
        };

        reader.readAsArrayBuffer(file); // Membaca file PDF
    } else {
        alert('Please select a valid PDF file!');
    }
}