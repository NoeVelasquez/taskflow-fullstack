import User from '../entities/user.entity.js';

export const create = async (data) => {
  return await User.create(data);
};

export const findByEmail = async (email) => {
  return await User.findOne({
    where: {
      email,
    },
  });
};

export const findById = async (id) => {
  // Usar findOne con where es más robusto para UUIDs
  const user = await User.findOne({
    where: { id },
  });

  return user;
};
