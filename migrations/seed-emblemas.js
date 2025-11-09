import Recompensa from '../src/models/Recompensa.js';

const EMBLEMAS = [
  {
    image_id: 'first_goal',
    tipo: 'EMBLEMA',
    name: 'Primeira Meta',
    description: 'Crie sua primeira meta',
    icon: 'flag.fill',
    preco: 0,
    minimum_level: 1
  },
  {
    image_id: 'goal_master',
    tipo: 'EMBLEMA',
    name: 'Mestre das Metas',
    description: 'Complete uma meta inteira',
    icon: 'star.fill',
    preco: 0,
    minimum_level: 1
  },
  {
    image_id: 'task_warrior',
    tipo: 'EMBLEMA',
    name: 'Guerreiro de Tarefas',
    description: 'Complete 10 tarefas',
    icon: 'checkmark.seal.fill',
    preco: 0,
    minimum_level: 1
  },
  {
    image_id: 'task_champion',
    tipo: 'EMBLEMA',
    name: 'Campeão das Tarefas',
    description: 'Complete 50 tarefas',
    icon: 'bolt.fill',
    preco: 0,
    minimum_level: 1
  },
  {
    image_id: 'level_5',
    tipo: 'EMBLEMA',
    name: 'Ascendente',
    description: 'Alcance o nível 5',
    icon: 'arrow.up.circle.fill',
    preco: 0,
    minimum_level: 5
  },
  {
    image_id: 'level_10',
    tipo: 'EMBLEMA',
    name: 'Lendário',
    description: 'Alcance o nível 10',
    icon: 'crown.fill',
    preco: 0,
    minimum_level: 10
  },
  {
    image_id: 'early_bird',
    tipo: 'EMBLEMA',
    name: 'Madrugador',
    description: 'Complete uma tarefa antes das 8h',
    icon: 'sunrise.fill',
    preco: 0,
    minimum_level: 1
  },
  {
    image_id: 'night_owl',
    tipo: 'EMBLEMA',
    name: 'Coruja Noturna',
    description: 'Complete uma tarefa após as 22h',
    icon: 'moon.stars.fill',
    preco: 0,
    minimum_level: 1
  }
];

async function seedEmblemas() {
  try {
    console.log('🏆 Iniciando seed de emblemas...');

    for (const emblema of EMBLEMAS) {
      const existing = await Recompensa.findOne({ where: { image_id: emblema.image_id } });
      
      if (!existing) {
        await Recompensa.create(emblema);
        console.log(`✅ Emblema criado: ${emblema.name} (${emblema.image_id})`);
      } else {
        // Atualiza caso já exista
        await existing.update(emblema);
        console.log(`🔄 Emblema atualizado: ${emblema.name} (${emblema.image_id})`);
      }
    }

    console.log(`✅ Seed de emblemas concluído! ${EMBLEMAS.length} emblemas processados.`);
  } catch (error) {
    console.error('❌ Erro ao fazer seed de emblemas:', error);
    throw error;
  }
}

export default seedEmblemas;
