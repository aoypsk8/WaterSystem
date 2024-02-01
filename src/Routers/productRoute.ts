import express from "express";
import { getAllProducs, insertProduct ,getOneProducs, deleteProducs,updateProduct, searchProductsByLocation, DecreaseProduct} from "../controllers/productController";

const router = express.Router();

router.post('/create',insertProduct);
router.get('/getAll',getAllProducs); 
router.get('/getOne/:ProductId',getOneProducs); 
router.delete('/delete/:ProductId',deleteProducs); 
router.put('/update/:ProductId',updateProduct); 
router.post('/search', searchProductsByLocation);
router.post('/decrease/:ProductId', DecreaseProduct);

export default router;
