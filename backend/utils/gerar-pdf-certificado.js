const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Gera um PDF de certificado e salva no servidor.
 * @param {Object} dadosCertificado - Dados necessários para o certificado
 * @param {string} dadosCertificado.participante - Nome do participante
 * @param {string} dadosCertificado.evento - Nome do evento
 * @param {string} dadosCertificado.data - Data do evento
 * @param {string} dadosCertificado.registro - Número de registro do certificado
 * @param {string} outputPath - Caminho de saída onde o PDF será salvo
 * @returns {Promise<void>}
 */

const gerarPDF = async (dadosCertificado, outputPath, assinaturas = []) => {
  return new Promise((resolve, reject) => {
    try {
      const { participante, evento, data, registro } = dadosCertificado;

      const dataFormatada = new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      const doc = new PDFDocument();

      // Cria o diretório se não existir
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      doc.fontSize(22).text('CERTIFICADO', { align: 'center' });

      // TEXTO PRINCIPAL
      doc.moveDown();
      doc.fontSize(14).text(
        `Certificamos que ${participante} participou do evento "${evento}", realizado em ${dataFormatada}.`,
        { align: 'justify', lineGap: 8 }
      );

      // REGISTRO
      doc.moveDown();
      doc.text(`Número de registro: ${registro}`, { align: 'left' });

      // ASSINATURAS
      doc.moveDown();
      for (const assinatura of assinaturas) {
        const imagemPath = path.join(__dirname, '..', assinatura.caminho_arquivo);
        if (fs.existsSync(imagemPath)) {
          doc.image(imagemPath, { width: 150, align: 'center' });
        }

        doc.moveDown(0.5);
        doc.fontSize(12).text(assinatura.nome, { align: 'left' });
        doc.fontSize(10).text(assinatura.cargo, { align: 'left' });
        doc.moveDown();
      }


      doc.end();

      stream.on('finish', () => {
        console.log(`PDF gerado: ${outputPath}`);
        resolve();
      });

      stream.on('error', (err) => {
        console.error('Erro ao salvar PDF:', err);
        reject(err);
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = gerarPDF;
