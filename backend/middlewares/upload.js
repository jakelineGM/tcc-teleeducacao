const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Função para criar configuração dinâmica de upload
const getUpload = (folder, allowedMimeTypes = ['image/png']) => {
    // Garantir que a pasta existe
    const uploadPath = path.join(__dirname, '..', 'uploads', 'imagens', folder);
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    const fileFilter = (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Tipo de arquivo não permitido. Tipos aceitos: ${allowedMimeTypes.join(', ')}`));
        }
    };

    return multer({ storage, fileFilter });
};

module.exports = getUpload;