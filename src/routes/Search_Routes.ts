import express from "express";
const  router = express.Router();
import { 
  Get_Search_User
} from "../controller/Search_Controller";

router.get("/:Search_query", Get_Search_User);

export default router;
