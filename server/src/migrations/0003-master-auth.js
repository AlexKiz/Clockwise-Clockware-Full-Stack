'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn('orders', 'isCompleted', {
				type: Sequelize.DataTypes.BOOLEAN,
				allowNull: false,
                defaultValue: false
			}, {transaction});

            await transaction.commit();
        } catch (err) {
			await transaction.rollback();
			throw err;
		}
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.removeColumn('orders', 'isCompleted', {transaction});
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
	},
};
