document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('.theme-icon');
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.setAttribute('data-lucide', 'sun');
        } else {
            themeIcon.setAttribute('data-lucide', 'moon');
        }
        lucide.createIcons();
    }

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadTrigger = document.getElementById('upload-trigger');
    const fileListContainer = document.getElementById('file-list-container');
    const fileList = document.getElementById('file-list');
    const clearAllBtn = document.getElementById('clear-all');
    const startConversionBtn = document.getElementById('start-conversion');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    const resultContainer = document.getElementById('result-container');
    const downloadList = document.getElementById('download-list');
    const convertMoreBtn = document.getElementById('convert-more');
    const outputFormat = document.getElementById('output-format');

    let selectedFiles = [];

    uploadTrigger.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('click', (e) => {
        if (e.target !== uploadTrigger) fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });

    function handleFiles(files) {
        for (let file of files) {
            selectedFiles.push(file);
        }
        renderFileList();
    }

    function renderFileList() {
        fileList.innerHTML = '';
        if (selectedFiles.length > 0) {
            dropZone.style.display = 'none';
            fileListContainer.style.display = 'block';
            
            selectedFiles.forEach((file, index) => {
                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = `
                    <div class="file-info">
                        <i data-lucide="file"></i>
                        <div>
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${formatBytes(file.size)}</div>
                        </div>
                    </div>
                    <button class="remove-file" data-index="${index}">
                        <i data-lucide="trash-2"></i>
                    </button>
                `;
                fileList.appendChild(item);
            });
            lucide.createIcons();

            document.querySelectorAll('.remove-file').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                    selectedFiles.splice(idx, 1);
                    if (selectedFiles.length === 0) {
                        resetConverter();
                    } else {
                        renderFileList();
                    }
                });
            });
        }
    }

    clearAllBtn.addEventListener('click', () => {
        selectedFiles = [];
        resetConverter();
    });

    function resetConverter() {
        selectedFiles = [];
        fileInput.value = '';
        fileListContainer.style.display = 'none';
        progressContainer.style.display = 'none';
        resultContainer.style.display = 'none';
        dropZone.style.display = 'block';
    }

    startConversionBtn.addEventListener('click', () => {
        fileListContainer.style.display = 'none';
        progressContainer.style.display = 'block';
        
        let progress = 0;
        const targetFormat = outputFormat.value;

        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            progressPercent.textContent = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    showResults(targetFormat);
                }, 400);
            }
        }, 80);
    });

    function showResults(format) {
        resultContainer.style.display = 'flex';
        downloadList.innerHTML = '';

        selectedFiles.forEach(file => {
            const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFileName = `${originalNameWithoutExt}_converted.${format}`;
            
            const dummyBlob = new Blob([file], { type: 'application/octet-stream' });
            const blobUrl = URL.createObjectURL(dummyBlob);

            const downloadItem = document.createElement('div');
            downloadItem.className = 'download-item';
            downloadItem.innerHTML = `
                <div class="file-info">
                    <i data-lucide="check-circle" style="color: #10b981;"></i>
                    <div>
                        <div class="file-name">${newFileName}</div>
                        <div class="file-size">Ready for download</div>
                    </div>
                </div>
                <a href="${blobUrl}" download="${newFileName}" class="btn btn-red-solid" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="download"></i> Download
                </a>
            `;
            downloadList.appendChild(downloadItem);
        });
        lucide.createIcons();
    }

    convertMoreBtn.addEventListener('click', () => {
        resetConverter();
    });

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalSubmit = document.getElementById('modal-submit');
    const switchMode = document.getElementById('switch-mode');
    const switchText = document.getElementById('switch-text');

    let isLoginMode = true;

    function openModal(login = true) {
        isLoginMode = login;
        updateModalMode();
        authModal.style.display = 'flex';
    }

    function closeModal() {
        authModal.style.display = 'none';
    }

    loginBtn.addEventListener('click', () => openModal(true));
    signupBtn.addEventListener('click', () => openModal(false));
    closeModalBtn.addEventListener('click', closeModal);

    switchMode.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        updateModalMode();
    });

    function updateModalMode() {
        if (isLoginMode) {
            modalTitle.textContent = 'Log In to RevoltConvert';
            modalSubmit.textContent = 'Log In';
            switchText.textContent = "Don't have an account?";
            switchMode.textContent = 'Sign Up';
        } else {
            modalTitle.textContent = 'Create a RevoltConvert Account';
            modalSubmit.textContent = 'Sign Up';
            switchText.textContent = 'Already have an account?';
            switchMode.textContent = 'Log In';
        }
    }

    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });
});
