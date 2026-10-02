import User from './user.entity.js';
import Project from './project.entity.js';
import Task from './task.entity.js';

// Relaciones User <-> Project
User.hasMany(Project, {
  foreignKey: 'userId',
  as: 'projects',
});
Project.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner',
});

// Relaciones Project <-> Task
Project.hasMany(Task, {
  foreignKey: 'projectId',
  as: 'tasks',
});
Task.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
});

// Relación User <-> Task
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks',
});
Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});
