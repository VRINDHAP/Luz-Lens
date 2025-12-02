const API_URL = 'https://luz-and-lens-backend.onrender.com/upload'; 

// Image preview functionality
document.getElementById('file').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('preview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// Form submission handler
document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const resultDiv = document.getElementById('result');
    const spinner = document.getElementById('spinner');
    const uploadButton = document.getElementById('uploadButton');
    const formData = new FormData(this);

    try {
        // 1. Show loading state
        spinner.style.display = 'block';
        uploadButton.disabled = true;
        uploadButton.textContent = 'Uploading...';
        resultDiv.innerHTML = '';
        resultDiv.className = '';

        // 2. Setup a timeout (abort request if it takes > 60 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

        // 3. Send the upload request
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            mode: 'cors',
            signal: controller.signal // Link the timeout signal
        });

        clearTimeout(timeoutId); // Clear timeout if response comes back

        // 4. Handle non-JSON responses (like 404 or 500 HTML error pages)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Server returned a non-JSON response (${response.status}). The backend might be down or crashing.`);
        }

        const data = await response.json();

        // 5. Handle success/failure based on backend logic
        if (response.ok) {
            resultDiv.className = 'result success';
            resultDiv.innerHTML = `
                        <h3>✅ Upload Successful!</h3>
                        <p>${data.message || 'File uploaded successfully.'}</p>
                        ${data.file ? `<p><strong>File:</strong> ${data.file.originalName}</p>` : ''}
                    `;
            this.reset();
            document.getElementById('preview').style.display = 'none';
        } else {
            throw new Error(data.error || 'Upload failed');
        }

    } catch (error) {
        // 6. Handle specific Timeout Error
        let errorMessage = error.message;
        if (error.name === 'AbortError') {
            errorMessage = "Request timed out. The server is taking too long to wake up. Please try again in a minute.";
        } else if (errorMessage === 'Failed to fetch') {
            errorMessage = "Network Error. Unable to reach the server. Please check your connection or the backend URL.";
        }

        resultDiv.className = 'result error';
        resultDiv.innerHTML = `
                    <h3>❌ Error</h3>
                    <p>${errorMessage}</p>
                `;
        console.error('Upload error:', error);
    } finally {
        // 7. Reset UI state
        spinner.style.display = 'none';
        uploadButton.disabled = false;
        uploadButton.textContent = 'Submit Work'; // Reset text
    }
});
