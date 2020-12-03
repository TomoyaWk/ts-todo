import { Router } from "express";
import { DBAccessor } from "./dbAccessor";


const dbAccessor = new DBAccessor();

export const createRouter = () => {

    const router = Router();

    router.get('/hello', (req, res) => {
        res.status(200).send({ messege: 'hello,hello!' })
    });

    //read
    router.get('/', async(req, res) => {
    
        try {
            const resBody = await dbAccessor.get();
            res.status(200).send({ messege: 'get succsess!', resBody });
        } catch (error) {
            console.error(error);
            res.status(400).send({ messege: 'get failed...' })
        }
    });

    //create
    router.put('/', async(req, res) => {
        try {
            if (!req.body.title) {
                res.status(400).send({ messege: 'title required' })    
            }
            await dbAccessor.create(req.body.title);
            res.status(200).send({ messege: 'create succsess!' })
        } catch (error) {
            console.error(error);
            res.status(400).send({ messege: 'create failed...' })
        }
    });

    //update
    router.post('/:taskID', async(req, res) => {
        try {
            if (!req.body) {
                res.status(400).send({ messege: 'body required' });
            }
            await dbAccessor.update({uuid: req.params.taskID, ...req.body});
            res.status(200).send({ messege: 'update succsess!' });
        } catch (error) {
            console.error(error);
            res.status(400).send({ messege: 'update failed...' })
        }
    });

    //delete
    router.delete('/:taskID', async(req, res) => {
        try {
            if (!req.body) {
                res.status(400).send({ messege: 'body required' });
            }
            await dbAccessor.delete({uuid: req.params.taskID});
            res.status(200).send({ messege: 'delete succsess!' });
        } catch (error) {
            console.error(error);
            res.status(400).send({ messege: 'delete failed...' })
        }
    });


    return router;
};