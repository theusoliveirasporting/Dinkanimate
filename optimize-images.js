// optimize-images.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Pastas
const INPUT_DIR = './img';
const OUTPUT_DIR = './img/optimized';

// Configuração de otimização
const WEBP_OPTIONS = {
  quality: 70,
  effort: 4, // equilíbrio entre velocidade e compressão
  alphaQuality: 80
};

async function optimizeImage(filename) {
  const inputPath = path.join(INPUT_DIR, filename);
  const outputName = filename.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const outputPath = path.join(OUTPUT_DIR, outputName);

  try {
    await sharp(inputPath)
      .webp(WEBP_OPTIONS)
      .toFile(outputPath);
    
    const originalSize = (await fs.stat(inputPath)).size;
    const optimizedSize = (await fs.stat(outputPath)).size;
    const savings = Math.round((1 - optimizedSize / originalSize) * 100);

    console.log(`✅ ${filename} → ${outputName} | Economia: ${savings}%`);
  } catch (err) {
    console.error(`❌ Falha ao otimizar ${filename}:`, err.message);
  }
}

async function main() {
  // Cria pasta de saída
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Lista arquivos PNG/JPG
  const files = await fs.readdir(INPUT_DIR);
  const imageFiles = files.filter(f => 
    /\.(png|jpg|jpeg)$/i.test(f) && 
    (f.includes('refrigerante') || f.includes('foregroundBlur'))
  );

  console.log(`\n🔍 Encontradas ${imageFiles.length} imagens para otimizar...\n`);

  // Otimiza todas
  for (const file of imageFiles) {
    await optimizeImage(file);
  }

  console.log(`\n✨ Todas as imagens otimizadas em: ${OUTPUT_DIR}`);
  console.log(`\n➡️ Próximo passo: atualize seu HTML para usar .webp com fallback.`);
}

main().catch(console.error);