// src/faker/seeds/users.seed.ts
import { fakerES as faker } from '@faker-js/faker';
import { User } from '../../models/business/User.js';
import { SEED_COUNT } from '../config.js';

export async function seedUsers() {
  console.log("Users...");

  for (let i = 0; i < SEED_COUNT; i++) {
    await User.create({
      name: faker.person.fullName(),
      phone: `3${faker.string.numeric(9)}`,
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
      role: faker.helpers.arrayElement(["customer", "operator", "admin"]),
      status: faker.helpers.arrayElement(["active", "inactive", "suspended"])
    });
  }
}