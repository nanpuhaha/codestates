const Sequelize = require('sequelize');
// const users = require('../models').users;
// const figures = require('./figures');
module.exports = (sequelize, DataTypes) => {
    const drawings = sequelize.define(
        'drawings',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            mapCenterLat: DataTypes.STRING,
            mapCenterLng: DataTypes.STRING,
            userId: DataTypes.INTEGER,
            figureId: DataTypes.INTEGER
        },
        {
            timestamps: false
        }
    );
    // drawings.removeAttribute('id');
    drawings.associate = models => {
        drawings.belongsTo(models.users, { foreignKey: 'userId' });
        drawings.belongsTo(models.figures, { foreignKey: 'figureId' });
        // associations can be defined here
    };
    return drawings;
};
