import Recompensa from '../src/models/Recompensa.js';

const avatares = [
  { image_id: '1', tipo: 'AVATAR', name: 'Homem-Aranha', preco: 400, minimum_level: 1 },
  { image_id: '2', tipo: 'AVATAR', name: 'Flash', preco: 350, minimum_level: 1 },
  { image_id: '3', tipo: 'AVATAR', name: 'Arqueiro Verde', preco: 100, minimum_level: 1 },
  { image_id: '4', tipo: 'AVATAR', name: 'Deadpool', preco: 200, minimum_level: 1 },
  { image_id: '5', tipo: 'AVATAR', name: 'Demolidor', preco: 1000, minimum_level: 1 },
  { image_id: '6', tipo: 'AVATAR', name: 'Invencível', preco: 200, minimum_level: 1 },
  { image_id: '7', tipo: 'AVATAR', name: 'Aranha Preto', preco: 400, minimum_level: 1 },
  { image_id: '8', tipo: 'AVATAR', name: 'Batman', preco: 1000, minimum_level: 1 },
  { image_id: '9', tipo: 'AVATAR', name: 'Aranha Venom', preco: 350, minimum_level: 1 },
  { image_id: '10', tipo: 'AVATAR', name: 'Kratos', preco: 500, minimum_level: 1 },
];

async function seedAvatares() {
  try {
    console.log('🚀 Iniciando seed de avatares...');

    for (const avatar of avatares) {
      const existing = await Recompensa.findOne({ where: { image_id: avatar.image_id } });
      
      if (!existing) {
        await Recompensa.create(avatar);
        console.log(`✅ Avatar criado: ${avatar.name} (ID: ${avatar.image_id}, Preço: ${avatar.preco})`);
      } else {
        // Atualiza o preço caso já exista
        await existing.update({ preco: avatar.preco, tipo: avatar.tipo });
        console.log(`🔄 Avatar atualizado: ${avatar.name} (ID: ${avatar.image_id}, Preço: ${avatar.preco})`);
      }
    }

    console.log('✅ Seed de avatares concluído!');
  } catch (error) {
    console.error('❌ Erro ao fazer seed de avatares:', error);
    throw error;
  }
}

export default seedAvatares;
