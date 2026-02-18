import {
  getCrosswordToPlayByIdFromDB,
  getCrosswordsFromDB,
  getUserCrosswordsFromDB,
  addCrosswordToLibraryInDB,
  saveCrosswordToPublicLibraryDB,
  deleteCrosswordFromUserLibraryInDB,
  deleteCrosswordFromPublicLibraryInDB,
  getUserCrosswordProgressFromDB,
  updateUserCrosswordProgressInDB,
  doesCrosswordExistInDB,
  doesCrosswordExistInUserDB,
  getCrosswordIdFromDB,
  getCrosswordWithProgressFromDB,
  saveUserCrosswordProgressInDB,
  deleteUserCrosswordProgressInDB,
  updateCrosswordInDB,
  } from "../models/crosswords.js";
import {
  getAllDictionariesFromDB,
  getDictionaryContentByNameFromDB,
  postDictionaryInDB,
  deleteDictionaryFromDB,
} from "../models/dictionary.js";
import fs from "fs/promises";
import path from "path";




// Получение всех сохраненных пользовательских данных прогресса решения кроссворда
export const getUserInputs = async (req, res) => {
  const crosswordId = req.params.id; // Получаем ID кроссворда
  console.log('Received crosswordId:', crosswordId); // Логируем ID

  try {
    const result = await getCrosswordWithProgressFromDB(crosswordId);

    if (!result || !result.user_progress) {
      console.log('No progress found or progress is null for crosswordId:', crosswordId);
      return res.status(200).json({ userProgress: null });
    }

    res.status(200).json({
      grid: result.user_progress, // Возвращаем весь JSON из progress
    });
  } catch (error) {
    console.error("Error fetching crossword with progress:", error);
    res.status(500).json({ message: "Ошибка при получении кроссворда или прогресса" });
  }
};

// Отправка всех сохраненных пользовательских данных прогресса решения кроссворда
export const postUserInputs = async (req, res) => {
  const userCrosswordId = req.params.id; // ID пользовательского кроссворда
  const { grid } = req.body; // JSON с прогрессом

  try {
    if (!grid || !Array.isArray(grid)) {
      return res.status(400).json({ message: "Некорректные данные прогресса: отсутствует grid или он имеет неправильный формат" });
    }

    const savedProgress = await saveUserCrosswordProgressInDB(userCrosswordId, grid);

    res.status(200).json({
      message: "Прогресс успешно сохранён",
      progressId: savedProgress.progress_id,
    });
  } catch (error) {
    console.error("Error saving crossword progress:", error);
    res.status(500).json({ message: "Ошибка при сохранении прогресса" });
  }
};


// Получение всех словарей
export const getAllDictionaries = async (req, res) => {
  try {
    const dictionaries = await getAllDictionariesFromDB();
    res.json(dictionaries);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении словарей" });
  }
};

// Получение кроссворда по Id для игры
export const getCrosswordToPlayById = async (req, res) => {
  const crosswordId = req.params.crosswordId; // Получаем ID из параметров
  try {
    // Получаем кроссворд из пользовательской библиотеки
    const crossword = await getCrosswordToPlayByIdFromDB(crosswordId);
    if (!crossword) {
      return res.status(404).json({ message: "Кроссворд не найден" });
    }

    res.json(crossword.content); // Возвращаем только содержимое кроссворда
  } catch (error) {
    console.error("Error fetching crossword:", error);
    res.status(500).json({ message: "Ошибка при получении кроссворда" });
  }
};

// Получение кроссворда по Id для редактирования
export const getCrosswordToEditById = async (req, res) => {
  const crosswordId = req.params.crosswordId; // Получаем ID из параметров
  console.log('Received crosswordId:', crosswordId); // Логируем ID

  try {
    const crossword = await getCrosswordIdFromDB(crosswordId);

    if (!crossword) {
      return res.status(404).json({ message: "Кроссворд не найден" });
    }

    console.log('Crossword content:', crossword.content); // Логируем содержимое кроссворда
    res.json(crossword.content); // Возвращаем содержимое кроссворда
  } catch (error) {
    console.error("Error fetching crossword:", error);
    res.status(500).json({ message: "Ошибка при получении кроссворда" });
  }
};




// Получение содержимого словаря по имени
export const getDictionaryByName = async (req, res) => {
  const { name } = req.params; // Получаем имя словаря из параметров URL
  try {
    const content = await getDictionaryContentByNameFromDB(name); // Запросим только content
    if (content) {
      res.json({ content }); // Отправляем содержимое словаря клиенту
    } else {
      res.status(404).json({ message: "Словарь не найден" }); // Если словарь не найден
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении словаря" });
  }
};

// Загрузка нового словаря
export const postDictionary = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res
        .status(400)
        .json({ message: "Необходимо предоставить название и файл словаря" });
    }

    const filePath = path.resolve(file.path);
    const fileContent = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(fileContent);

    const dictionary = await postDictionaryInDB(name, jsonData);

    // Удаляем временный файл после прочтения
    await fs.unlink(filePath);

    res.status(201).json(dictionary);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при загрузке словаря" });
    console.log(error);
  }
};

// Удаление словаря
export const deleteDictionary = async (req, res) => {
  try {
    const dictionaryId = req.params.id;
    const dictionary = await deleteDictionaryFromDB(dictionaryId);
    if (!dictionary) {
      return res.status(404).json({ message: "Словарь не найден" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении словаря" });
  }
};

// Получить ID пользователя
export const getUserID = async (req, res) => {
  try {
    const userId = req.user.userId;
    res.status(200).json({ userId });
  } catch (error) {
    console.error("Error fetching user ID: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Получить все публичные кроссворды
export const getCrosswords = async (req, res) => {
  try {
    const crosswords = await getCrosswordsFromDB();
    res.status(200).json(crosswords);
  } catch (error) {
    console.error("Error fetching crosswords: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Получить кроссворды пользователя
export const getUserCrosswords = async (req, res) => {
  try {
    const userId = req.user.userId;
    const crosswords = await getUserCrosswordsFromDB(userId);
    res.status(200).json(crosswords);
  } catch (error) {
    console.error("Error fetching user crosswords: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Добавить кроссворд в библиотеку пользователя
export const addCrosswordToLibrary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const crosswordId = req.body.id; // ID кроссворда из общей библиотеки
    console.log(crosswordId)
    
    // Проверяем, существует ли кроссворд с таким ID в общей библиотеке
    const crossword = await getCrosswordIdFromDB(crosswordId);
    console.log(crossword)
    if (!crossword || !crossword.content) {
      return res.status(404).json({ message: "Кроссворд не найден или данные отсутствуют" });
    }

    // Извлекаем название кроссворда из поля content
    const title = crossword.content.title; 
    if (!title) {
      return res.status(400).json({ message: "Название кроссворда отсутствует" });
    }

    // Проверка на существование кроссворда с таким же названием в пользовательской библиотеке
    const exists = await doesCrosswordExistInUserDB(userId, title);
    if (exists) {
      return res.status(400).json({ message: "Кроссворд с таким названием уже существует в вашей библиотеке" });
    }

    // Добавляем кроссворд в пользовательскую библиотеку, клонируя JSONB
    const newEntry = await addCrosswordToLibraryInDB(userId, crosswordId);
    res.status(201).json({ message: "Кроссворд успешно добавлен в вашу библиотеку", newEntry });
  } catch (error) {
    console.error("Error adding crossword to library: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Сохранить изменённый кроссворд в общей библиотеке
export const postEditedCrossword = async (req, res) => {
  const crosswordId = req.params.crosswordId;
  const crosswordData = req.body;

  try {
    if (!crosswordData || !crosswordData.title || !crosswordData.grid || !crosswordData.words) {
      return res.status(400).json({ message: "Некорректные данные кроссворда" });
    }

    const updatedCrossword = await updateCrosswordInDB(crosswordId, crosswordData);

    if (!updatedCrossword) {
      return res.status(404).json({ message: "Кроссворд не найден" });
    }

    res.status(200).json({
      message: "Кроссворд успешно обновлён",
      crosswordId: updatedCrossword.crossword_id,
    });
  } catch (error) {
    console.error("Error updating crossword:", error);
    res.status(500).json({ message: "Ошибка при обновлении кроссворда" });
  }
};



// Добавить кроссворд в публичную библиотеку
export const addCrosswordToPublicLibrary = async (req, res) => {
  const crosswordData = req.body;

  try {
    const { title } = crosswordData;

    // Проверка на существование кроссворда с таким названием
    const exists = await doesCrosswordExistInDB(title);
    if (exists) {
      return res.status(400).json({ message: "Кроссворд с таким названием уже существует" });
    }

    const crosswordId = await saveCrosswordToPublicLibraryDB(crosswordData);
    res.status(201).json({ message: 'Кроссворд успешно сохранен', crosswordId });
  } catch (error) {
    console.error('Ошибка при сохранении кроссворда:', error);
    res.status(500).json({ error: 'Ошибка при сохранении кроссворда' });
  }
};

// Удалить кроссворд из библиотеки пользователя
export const deleteCrosswordFromUserLibrary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userCrosswordId = req.body.id; // Идентификатор кроссворда в пользовательской библиотеке

    try {
      // Попытка удалить кроссворд
      const deletedEntry = await deleteCrosswordFromUserLibraryInDB(userId, userCrosswordId);
      if (!deletedEntry) {
        return res.status(404).json({ message: "Кроссворд не найден" });
      }
      res.status(200).json(deletedEntry);
    } catch (error) {
      // Если возникло нарушение внешнего ключа, удаляем прогресс
      if (error.code === "23503") {
        console.error("Foreign key violation, deleting user progress first...");
        await deleteUserCrosswordProgressInDB(userCrosswordId);

        // Повторная попытка удалить кроссворд
        const deletedEntry = await deleteCrosswordFromUserLibraryInDB(userId, userCrosswordId);
        if (!deletedEntry) {
          return res.status(404).json({ message: "Кроссворд не найден" });
        }
        res.status(200).json(deletedEntry);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error deleting crossword from library: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Удалить кроссворд из общей библиотеки
export const deleteCrosswordFromPublicLibrary = async (req, res) => {
  try {
    const crosswordId = req.body.id;
    const deletedEntry = await deleteCrosswordFromPublicLibraryInDB(
      crosswordId
    );
    res.status(200).json(deletedEntry);
  } catch (error) {
    console.error("Error deleting crossword from library: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Получить прогресс пользователя по кроссворду
export const getUserCrosswordProgress = async (req, res) => {
  try {
    const userCrosswordId = req.params.id;
    const progress = await getUserCrosswordProgressFromDB(userCrosswordId);
    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching crossword progress: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Обновить прогресс пользователя по кроссворду
export const updateUserCrosswordProgress = async (req, res) => {
  try {
    const userCrosswordId = req.params.id;
    const progress = req.body.progress;
    const updatedProgress = await updateUserCrosswordProgressInDB(
      userCrosswordId,
      progress
    );
    res.status(200).json(updatedProgress);
  } catch (error) {
    console.error("Error updating crossword progress: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
