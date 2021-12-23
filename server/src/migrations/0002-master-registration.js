'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn('users', 'masterId', {
				type: Sequelize.DataTypes.UUID,
				allowNull: true,
			}, {transaction});

            await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.users
                                                ADD CONSTRAINT "users_masterId_fkey" FOREIGN KEY ("masterId")
                                                REFERENCES public.masters (id) MATCH SIMPLE
                                                ON UPDATE CASCADE
                                                ON DELETE CASCADE;`, {transaction});

            await queryInterface.addColumn('users', 'hashVerify', {
				type: Sequelize.DataTypes.STRING(150),
				allowNull: true,
			}, {transaction});

            await queryInterface.addColumn('users', 'isVerified', {
				type: Sequelize.DataTypes.BOOLEAN,
				allowNull: true,
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
            await queryInterface.removeConstraint('users', 'users_masterId_fkey', {transaction});
            await queryInterface.removeColumn('users', 'masterId', {transaction});
            await queryInterface.removeColumn('users', 'hashVerify', {transaction});
            await queryInterface.removeColumn('users', 'isVerified', {transaction});
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
	},
};
