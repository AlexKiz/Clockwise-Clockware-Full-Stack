export interface AdminAttributes {
    id: number,
    email: string,
    password: string
}

export interface CityAttributes {
    id: number,
    name: string
}

export interface ClockAttributes {
    id: number,
    size: string,
    price: number,
    installation_time: number
}

export interface MasterAttributes {
    id: number,
    name: string,
    rating: number, 
    rated_sum: number,
    rated_quantity: number,
}

export interface MasterCitiesAttributes {
    master_id: number,
    city_id: number
}

export interface OrderAttributes {
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

export interface UserAttributes {
    id: number,
    name: string,
    email: string
}

