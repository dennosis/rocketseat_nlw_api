import Knex from 'knex'

export async function seed(knex:Knex){
    return await knex('items').insert([
        {title:"lampadas", image:"lampadas.svg"},
        {title:"Pilhas e baterias", image:"baterias.svg"},
        {title:"Papeis e papelão", image:"papeis-papelao.svg"},
        {title:"Residuos Eletronicos", image:"eletronicos.svg"},
        {title:"Residuos Organicos", image:"organicos.svg"},
        {title:"Oleos de cozinha", image:"oleos.svg"},
    ])
}