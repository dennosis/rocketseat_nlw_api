import {Request, Response} from "express"

import knex from "../database/connection"
import { Stream } from "stream"


class PointsController{


    async index(req:Request, res:Response){
        const {city, uf, items} = req.query

        const parsedItem = String(items).split(',').map(item=>Number(item.trim()))
        
        const points  = await knex("points")
            .join("point_items","points.id","=","point_items.items_id")
            .whereIn("point_items.items_id",parsedItem)
            .where("city",String(city))
            .where("uf",String(uf))
            .distinct()
            .select('points.*')

        return res.json(points)

    }

    async create(req:Request, res:Response){
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
        await trx.commit();

        return res.json({ id:point_id, ...point,})
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