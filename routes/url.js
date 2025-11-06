import express from 'express'
import {shortenurl} from '../controllers/urlcontrollers.js' 
const router = express.Router()

router.post('/shortenurl', shortenurl)
export default router;