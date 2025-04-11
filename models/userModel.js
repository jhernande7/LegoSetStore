import db from '../database.js';

const User = {
    
    async getById(userId) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT id, name, email, user_type FROM users WHERE id =?`,
                userId,
                (err, user) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(user);
                }
            );
        });
    }
};

export default User;