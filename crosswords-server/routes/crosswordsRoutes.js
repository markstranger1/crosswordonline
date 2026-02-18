import express from 'express';
import {
  getCrosswordToPlayById,
  getUserID,
  getCrosswords,
  getUserCrosswords,
  addCrosswordToLibrary,
  addCrosswordToPublicLibrary,
  deleteCrosswordFromUserLibrary,
  deleteCrosswordFromPublicLibrary,
  getUserCrosswordProgress,
  updateUserCrosswordProgress,
  getAllDictionaries,
  getDictionaryByName,
  postDictionary,
  deleteDictionary,
  getUserInputs,
  postUserInputs,
  getCrosswordToEditById,
  postEditedCrossword,
} from '../controllers/crosswordsController.js';
import authenticateJWT from "../middleware/authenticateJWT.js";
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/add', authenticateJWT, addCrosswordToPublicLibrary);
router.get('/play/:crosswordId', authenticateJWT, getCrosswordToPlayById);
router.get('/edit/:crosswordId', authenticateJWT, getCrosswordToEditById);
router.get('/user', authenticateJWT, getUserID);
router.get('/library', authenticateJWT, getCrosswords);
router.delete('/library', authenticateJWT, deleteCrosswordFromPublicLibrary);
router.get('/user/library', authenticateJWT, getUserCrosswords);
router.post('/user/library', authenticateJWT, addCrosswordToLibrary);
router.delete('/user/library', authenticateJWT, deleteCrosswordFromUserLibrary);
router.get('/user/library/progress/:id', authenticateJWT, getUserCrosswordProgress);
router.put('/user/library/progress/:id', authenticateJWT, updateUserCrosswordProgress);
router.get('/get/save/:id', authenticateJWT, getUserInputs);
router.post('/save/:id', authenticateJWT, postUserInputs);
router.post('/edit/public/:crosswordId', authenticateJWT, postEditedCrossword);

router.get('/dictionaries', authenticateJWT, getAllDictionaries);
router.get('/dictionaries/:name', authenticateJWT, getDictionaryByName);
router.post('/dictionaries', authenticateJWT, upload.single('file'), postDictionary);
router.delete('/dictionaries/:id', authenticateJWT, deleteDictionary);

export default router;
