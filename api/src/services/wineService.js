const supabase = require('../db/supabase');

class WineService {
  async createWine(wineData, userId) {
    try {
      const { id, user_id, created_at, updated_at, ...cleanWineData } = wineData;
      
      const { data, error } = await supabase
        .from('wines')
        .insert([
          {
            ...cleanWineData,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Erro ao criar vinho');
      }

      return data;
    } catch (err) {
      console.error('Error in createWine:', err);
      throw err;
    }
  }

  async getWinesByUser(userId) {
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getWineById(wineId, userId) {
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .eq('id', wineId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Vinho nao encontrado');
      }
      throw new Error(error.message);
    }

    return data;
  }

  async updateWine(wineId, wineData, userId) {
    const existingWine = await this.getWineById(wineId, userId);

    if (!existingWine) {
      throw new Error('Vinho nao encontrado');
    }

    const { id, user_id, created_at, updated_at, ...cleanWineData } = wineData;

    const { data, error } = await supabase
      .from('wines')
      .update({
        ...cleanWineData,
        updated_at: new Date().toISOString()
      })
      .eq('id', wineId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async deleteWine(wineId, userId) {
    const existingWine = await this.getWineById(wineId, userId);

    if (!existingWine) {
      throw new Error('Vinho nao encontrado');
    }

    const { error } = await supabase
      .from('wines')
      .delete()
      .eq('id', wineId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Vinho deletado com sucesso' };
  }
}

module.exports = new WineService();
