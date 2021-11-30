import { Model } from 'sequelize';

export interface AdminModel extends Model {
    id: number,
    email: string,
    password: string
}

export interface CityModel extends Model {
    id: number,
    name: string
}

export interface ClockModel extends Model {
    id: number,
    size: string,
    price: number,
    installation_time: number
}

export interface MasterModel extends Model {
    id: number,
    name: string,
    rating: number, 
    rated_sum: number,
    rated_quantity: number
}

export interface MasterCitiesModel extends Model {
    master_id: number,
    city_id: number
}

export interface UserModel extends Model {
    id: number,
    name: string,
    email: string
}

export interface OrderModel extends Model {
    id: number,
    clock_id: number,
    user_id: number,
    city_id: number,
    master_id: number,
    start_work_on: string,
    end_work_on: string,
    rating_identificator: string,
    order_rating: number
}