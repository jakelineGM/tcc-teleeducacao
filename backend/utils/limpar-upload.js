const fs = require('fs');

const limparUpload = (req) => {
  if (req.file) {
    const filePath = req.file.path;
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Arquivo de upload removido: ${filePath}`);
      } catch (error) {
        console.error(`Erro ao tentar excluir o arquivo: ${filePath}`, error);
      }
    }
  }
};

module.exports = limparUpload;
