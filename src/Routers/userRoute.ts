import express from "express";
import { getAllUsers ,getOneUser, deleteUser} from "../controllers/userController";

const router = express.Router();

router.get('/getAll',getAllUsers); 
router.get('/getOne/:UserId',getOneUser); 
router.delete('/delete/:UserId',deleteUser); 
// router.put('/update/:UserId',updateUser); 

export default router;
