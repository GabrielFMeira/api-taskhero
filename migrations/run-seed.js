import seq from '../src/db.js';
import '../src/models/index.js';
import seedAvatares from './seed-avatares.js';

async function runSeeds() {
  try {
    await seq.authenticate();
    console.log('✅ Conexão com banco estabelecida');
    
    await seedAvatares();
  } catch (error) {
    console.error('❌ Erro ao executar seeds:', error);
    process.exit(1);
  }
}

runSeeds();
