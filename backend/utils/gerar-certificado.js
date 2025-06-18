const fs = require('fs');
const path = require('path');
const gerarPDF = require('./gerar-pdf-certificado');

const gerarCertificado = async (id_evento, id_publico, id_certificado, db) => {
  try {

    // Verificar se o usuário público esteve presente no evento
    const [[presenca]] = await db.query(
      'SELECT presente FROM Inscricao WHERE id_evento = ? AND id_publico = ?',
      [id_evento, id_publico]
    );

    if (!presenca || presenca.presente !== 1) {
      const err = new Error('O certificado não pode ser gerado porque o inscrito não esteve presente no evento.');
      err.tipo = 'presenca_invalida';
      throw err;
    }


    // Verificar se já existe certificado salvo no banco
    const [[certificado]] = await db.query(
      'SELECT caminho_arquivo FROM Certificado WHERE id_evento = ? AND id_publico = ?',
      [id_evento, id_publico]
    );

    if (certificado && certificado.caminho_arquivo) {
      console.log(`Certificado já gerado: ${certificado.caminho_arquivo}`);
      return certificado.caminho_arquivo;
    }

    // Busca dados para o certificado
    const [dadosCertificado] = await db.query(`
        SELECT 
          pub.nome AS participante,
          pe.titulo AS evento,
          pe.data_inicio AS data,
          c.registro
        FROM Certificado c
        JOIN ProjetoEducacional pe ON pe.id_evento = c.id_evento
        JOIN Publico pub ON pub.id_publico = c.id_publico
        WHERE c.id_certificado = ?;`,
      [id_certificado]
    );

    const [assinaturas] = await db.query(`
        SELECT a.nome, a.cargo, a.caminho_arquivo
        FROM ProjetoAssinatura pa
        JOIN Assinatura a ON a.id_assinatura = pa.id_assinatura
        WHERE pa.id_evento = ?
        ORDER BY pa.ordem ASC
        `,
      [id_evento]
    );

    const dadosPreencherCertificado = {
      participante: dadosCertificado[0].participante,
      evento: dadosCertificado[0].evento,
      data: dadosCertificado[0].data,
      registro: dadosCertificado[0].registro
    };


    const caminho = `/uploads/certificados/certificado_${dadosCertificado[0].registro}.pdf`;
    const fullPath = path.join(__dirname, '..', caminho);

    // Gera o PDF
    await gerarPDF(dadosPreencherCertificado, fullPath, assinaturas);

    // Salvar o caminho no banco
    await db.query(
      'UPDATE Certificado SET caminho_arquivo = ? WHERE id_certificado = ?',
      [caminho, id_certificado]
    );

    console.log(`Novo certificado gerado e salvo: ${caminho}`);
    return caminho;
  } catch (err) {
    console.error('Erro ao gerar certificado:', err);
    throw err;
  }
};

module.exports = gerarCertificado;