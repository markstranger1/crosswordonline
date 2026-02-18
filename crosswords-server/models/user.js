import pool from "../config/exports.js";

export const findUserByNickname = async (nickname) => {
  const userCheckQuery =
    'SELECT * FROM "crosswords"."user_account" WHERE nickname = $1';
  const userCheckResult = await pool.query(userCheckQuery, [nickname]);
  return userCheckResult.rows[0];
};

export const createUser = async (nickname, hashedPassword) => {
  const insertQuery =
    'INSERT INTO "crosswords"."user_account" (nickname, password_hash) VALUES ($1, $2) RETURNING user_id';
  const result = await pool.query(insertQuery, [nickname, hashedPassword]);
  return result.rows[0].user_id;
};
