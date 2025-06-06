/*const PDFDocument = require('pdfkit');
const fs = require('fs');

// Exemplo de função para gerar certificado dinamicamente
function gerarCertificado({ nome, projeto, palestrante, data, registro }, outputPath) {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(outputPath)); // Cria o arquivo .pdf

  doc.fontSize(22).text('CERTIFICADO', { align: 'center' });

  doc.moveDown();
  doc.fontSize(14).text(`Certificamos que ${nome} participou do evento "${projeto}", ministrado por ${palestrante}, realizado em ${data}.`, {
    align: 'justify',
    lineGap: 8
  });

  doc.moveDown();
  doc.text(`Número de registro: ${registro}`, { align: 'right' });

  doc.end(); // Finaliza o documento
}

// Exemplo de uso:
gerarCertificado({
  nome: 'Maria Souza',
  projeto: 'Palestra sobre Saúde Mental',
  palestrante: 'Dr. João Silva',
  data: '01 de Junho de 2025',
  registro: 'CERT-2025-001'
}, 'backend/certificados/certificado_maria.pdf');
*/