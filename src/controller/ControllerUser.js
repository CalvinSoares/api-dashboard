import mongoose from 'mongoose';
import userSchema from '../model/ModelUser.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const User = mongoose.model('User', userSchema);

export const createUser = async (req, res) => {
  const { email, password} = req.body;

  const existingUser = await User.findOne({ email: email });

    if(!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' })
    }

    if(!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória' })
    }

    if (existingUser) {
      return res.status(406).json({ error: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({
        email,
        password: passwordHash
    });

  try { 
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const allUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        console.error('Erro ao chamar um usuário', err)
        res.status(500).json({ err: 'erro no servidor' })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    if(!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' })
    }

    if(!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória' })
    }

    const user = await User.findOne({ email: email })

    if (!user) {
        return res.status(404).json({ error: 'Usuario não encontrado' });
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida' })
    }

    try {

        const secret = process.env.SECRET

        const token = jwt.sign(
            {
                id: user._id,
            }, 
            secret,
        )
        res.status(200).json({ msg: 'Autenticação foi um sucesso', token, _id: user._id })
    } catch (err) {
        console.error('Error ao logar', err)
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde' })
    }
}

export const privateRoute = async (req, res) => {
    const id = req.params.id;

    console.log('ID do usuário:', id);

    try {
        const user = await User.findById(id, '-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        return res.status(401).json({ msg: 'acesso negado' })
    }

    try {
        const secret = process.env.SECRET;

        jwt.verify(token, secret)

        next()
    } catch (err) {
        res.status(400).json({ msg: "Token inválido" })
    }
}