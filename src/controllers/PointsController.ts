import {Request, Response} from "express"

import knex from "../database/connection"


class PointsController{

    async index(req:Request, res:Response){
        try{
            const {city, uf, items} = req.query
    
            const parsedItem = String(items).split(',').map(item=>Number(item.trim()))
            
            let points  = knex("points")
                .join("point_items","points.id","=","point_items.point_id")
                .distinct()
                .select('points.*')

            if(items)
                points.whereIn("point_items.items_id",parsedItem) // <-- only if param exists

            if(uf)
                points.where("uf",String(uf))

            if(city)
                points.where("city",String(city))
            

            await points.then(function(results) {
                return res.json(results)
            }).then(null, function(err) { 
                res.status(500).send(err);
            });

        }catch(e){
            return res.status(500).json({message:"erro so buscar"})
        }

    }

    async create(req:Request, res:Response){
        try{
            const {
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf,
                items
            } = req.body
        
            const trx = await knex.transaction()
    
            const point = {
                image:"image-fake",
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf
            }
    
            const insertedIds = await trx("points").insert(point)
            const point_id = insertedIds[0]
            const pointItems = items.map((items_id : number)=>{
                return {
                    items_id,
                    point_id
                }
            })

            await trx("point_items").insert(pointItems)
            const commit = await trx.commit()
    
            return res.json({ id:point_id, ...point,})
        }catch(e){
            return res.status(500).json({message:"erro ao cadastar"})
        }
    }

    async show(req:Request, res:Response){
        const {id} = req.params

        const point  = await knex("points").where("id",id).first()

        if(!point){
            return res.status(400).json({message:'Point not found'})
        }

        const items  = await knex("items").join("point_items","items.id","=","point_items.items_id").where("point_items.point_id",id)
        


        return res.json({point,items})
    }
}

export default PointsController