import express from "express";
import { deleteCategory, getAllCategory, getOneCategory, insertCategory, updateCategory } from "../controllers/categoryController";

const router = express.Router();

router.post('/create',insertCategory);
router.get('/getAll',getAllCategory); 
router.get('/getOne/:CateID',getOneCategory); 
router.delete('/delete/:CateID',deleteCategory); 
router.put('/update/:CateID',updateCategory); 

export default router;
