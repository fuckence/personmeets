const db = require("../db")
const bcrypt = require('bcrypt')
const session = require('express-session')

class UserController {
    async createUser(req, res) {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const result = await db.query('INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, hashedPassword, "user"]);
            res.json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error registering user' });
        }
    }

    async getUserName(req, res) {
        try {
            if (req.session.user) {
                res.json({ username: req.session.user.username });
            } else {
                res.status(401).json({ error: 'User not logged in' });
           }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async logUser(req, res){
        const { email, password } = req.body;
        try {
            const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    req.session.user = user;
                    res.json(user);
                } else {
                    res.status(401).json({ error: 'Incorrect username or password' });
                }
            } else {
                res.status(401).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error during login' });
        }
    }
    
    async getUserInfo(req, res) {
        try {
           if (req.session.user) {
              const userId = req.session.user.id;
              const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  
              if (result.rows.length > 0) {
                 const user = result.rows[0];
                 res.json(user);
              } else {
                 res.status(404).json({ error: 'User not found' });
              }
           } else {
              res.status(401).json({ error: 'User not logged in' });
           }
        } catch (error) {
           console.error(error);
           res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    async getUserRole(req, res) {
        try {
            if (req.session.user) {
                res.json({ username: req.session.user.role });
            } else {
                res.status(401).json({ error: 'User not logged in' });
           }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await db.query('SELECT * FROM users')
            res.json(users.rows)
        } catch (error) {
            console.error(error)
            res.status(511).json({error: 'client needs to authenticate to gain network access.'})
        }
    }

    async getUserById(req, res){
        const id = req.params.id;
        try {   
            const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
            res.json(user.rows[0])
        } catch (error) {
            console.error(error)
            res.status(511).json({error: 'client needs to authenticate to gain network access.'})
        }
    }

    async updateUser(req, res) {
        const userId = req.params.id;
        const { username, email, role } = req.body;
        try {
            const result = await db.query('UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING *', [username, email, role, userId]);
            if (result.rows.length === 1) {
                const updatedUser = result.rows[0];
                res.json(updatedUser);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating user' });
        }
    }

    async updateUserInformation (req, res) {
        const userId = req.session.user.id;
        console.log(userId)
        const {email, birthdate, status, city } = req.body;
        try {
            const result = await db.query('UPDATE users SET email = $1, birthdate = $2, status = $3, city = $4 WHERE id = $5 RETURNING *', [email, birthdate, status, city, userId]);
            console.log(result.rows[0])
            console.log(result.rows.length)
            if (result.rows.length === 1) {
                const updatedUser = result.rows[0];
                res.json(updatedUser);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating user' });
        }
    }

    async deleteUser(req, res) {
        const userId = req.params.id;
        try {
            // Assuming you have a function to execute SQL queries, replace it with your actual implementation
            const result = await db.query('DELETE FROM users WHERE id = $1', [userId])
            if (result.rowCount === 1) {
                res.json({ message: 'User deleted successfully' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting user' });
        }
    }
}

module.exports = new UserController();