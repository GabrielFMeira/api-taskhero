import seq from '../src/db.js';
import '../src/models/index.js';
import seedAvatares from './seed-avatares.js';
import seedEmblemas from './seed-emblemas.js';

async function runSeeds() {
  try {
    await seq.authenticate();
    console.log('✅ Conexão com banco estabelecida');
    
    console.log('\n📦 Executando seed de avatares...');
    await seedAvatares();
    
    console.log('\n🏆 Executando seed de emblemas...');
    await seedEmblemas();
    
    console.log('\n✅ Todos os seeds foram executados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar seeds:', error);
    process.exit(1);
  }
}

runSeeds();
