import express from 'express'
import {redirect} from '../controllers/redirectcontroller.js' 
const router = express.Router()

router.get('/:shortCode', redirect)
export default router;