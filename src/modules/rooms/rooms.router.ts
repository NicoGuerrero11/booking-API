import { Router } from 'express';
import { addNewRoom, getAllRooms, getRoom } from './rooms.controller';
import { CreateRoomSchema } from './schemas/CreateRoomSchema';
import { validateBody } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/role.middleware';


const roomsRouter: Router = Router();

roomsRouter.post('/', validateBody(CreateRoomSchema), authMiddleware, isAdmin, addNewRoom);
roomsRouter.get('/', getAllRooms);
roomsRouter.get('/:id', getRoom);

export default roomsRouter;
