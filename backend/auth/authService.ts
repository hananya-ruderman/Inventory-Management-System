import bcrypt from 'bcrypt'
import { FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import type { User } from '../users/models/types';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const { username, password, role } = request.body as Omit<User, 'id'>;
    
    const users = JSON.parse(fs.readFileSync('./backend/users/data/users.json', 'utf-8'));
    const existingUser = users.find((user: User) => user.username === username);

    if (existingUser) {
        return reply.status(400).send({ error: 'User already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
        id: (users.length + 1).toString(),
        username,
        password: hashedPassword,
        role: role || 'user'
    };
    fs.writeFileSync('users/data/users.json', JSON.stringify([...users, newUser], null, 2));
    console.log('Registering user:', newUser);
    console.log('Current users:', users);

    return reply.status(201).send({ id: newUser.id, username: newUser.username });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
    const { username, password } = request.body as Pick<User, 'username' | 'password'>;
    const users = JSON.parse(fs.readFileSync('./backend/users/data/users.json', 'utf-8'));
    const user = users.find((user: User) => user.username === username);

    if (!user) {
        return reply.status(400).send({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return reply.status(400).send({ error: 'Invalid credentials' });
    }

    return reply.status(200).send({ id: user.id, username: user.username });    
}

