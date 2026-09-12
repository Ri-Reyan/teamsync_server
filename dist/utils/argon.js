import argon2 from "argon2";
const options = {
    type: argon2.argon2id,
    memoryCost: 2 ** 8,
    timeCost: 3,
};
export const convertToHash = async (password) => {
    return await argon2.hash(password, options);
};
export const verifyHash = async (hashPassword, plainPassword) => {
    return await argon2.verify(hashPassword, plainPassword);
};
