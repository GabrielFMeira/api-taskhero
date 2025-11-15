import cron from 'node-cron';
import MetaService from "../services/MetaService.js";

const metaService = new MetaService();

cron.schedule('*/5 * * * *', async () => {
    console.log('[CRON] Verificando metas expiradas...');
    await metaService.notificateExpiredMetas();
});