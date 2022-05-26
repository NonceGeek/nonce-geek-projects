import { Router } from 'express'
import { main } from './UserControllers'

const router = Router()

router.get('/', main)

export default router
