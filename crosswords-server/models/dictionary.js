import pool from "../config/exports.js";

// Получить все словари
export const getAllDictionariesFromDB = async () => {
  const query = 'SELECT * FROM "crosswords"."dictionaries"';
  const result = await pool.query(query);
  return result.rows;
};

// Получить содержимое поля content для словаря по имени
export const getDictionaryContentByNameFromDB = async (name) => {
  const query =
    'SELECT "content"::text FROM "crosswords"."dictionaries" WHERE "name" = $1'; // Преобразуем jsonb в текст
  const result = await pool.query(query, [name]); // Передаем имя словаря как параметр
  return result.rows[0]?.content; // Возвращаем содержимое как текст
};

// Добавить новый словарь
export const postDictionaryInDB = async (name, content) => {
  const query = `
    INSERT INTO "crosswords"."dictionaries" (name, content)
    VALUES ($1, $2)
    RETURNING dictionary_id
  `;
  const result = await pool.query(query, [name, content]);
  return result.rows[0];
};

// Удалить словарь
export const deleteDictionaryFromDB = async (dictionaryId) => {
  const query = `
    DELETE FROM "crosswords"."dictionaries"
    WHERE dictionary_id = $1
    RETURNING dictionary_id
  `;
  const result = await pool.query(query, [dictionaryId]);
  return result.rows[0];
};
