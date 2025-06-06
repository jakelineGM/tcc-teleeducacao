const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();
const db = require('../models/db');

router.get('/certificado/:id_certificado', (req, res) => {
  const { id_certificado } = req.params;

  const sql = `
    SELECT 
      p.nome AS palestrante,
      pub.nome AS participante,
      pe.titulo AS evento,
      pe.data_inicio AS data,
      c.registro
    FROM Certificado c
    JOIN ProjetoEducacional pe ON pe.id_evento = c.id_evento
    JOIN Publico pub ON pub.id_publico = c.id_publico
    JOIN Palestrante p ON p.id_palestrante = c.id_palestrante
    WHERE c.id_certificado = ?;
  `;

  db.query(sql, [id_certificado], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Certificado não encontrado' });

    const { participante, evento, palestrante, data, registro } = results[0];

    const dataFormatada = new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    // Gerar PDF
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=certificado-${id_certificado}.pdf`);

    doc.pipe(res);

    doc.fontSize(22).text('CERTIFICADO', { align: 'center' });

    doc.moveDown();
    doc.fontSize(14).text(
      `Certificamos que ${participante} participou do evento "${evento}", ministrado por ${palestrante}, realizado em ${dataFormatada}.`,
      { align: 'justify', lineGap: 8 }
    );

    doc.moveDown();
    doc.text(`Número de registro: ${registro}`, { align: 'right' });

    doc.end();
  });
});

module.exports = router;
