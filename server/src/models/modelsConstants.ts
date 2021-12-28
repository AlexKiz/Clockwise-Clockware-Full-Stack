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
    installationTime: number
}

export interface AdminAttributes {
    id: number,
    email: string,
    password: string
}

export interface MasterAttributes {
    id: number,
    name: string,
    rating: number,
    ratedSum: number,
    ratedQuantity: number,
}

export interface MasterCitiesAttributes {
    masterId: number,
    cityId: number
}

export interface OrderAttributes {
    id: number,
    clockId: number,
    userId: number,
    cityId: number,
    masterId: number,
    startWorkOn: string,
    endWorkOn: string,
    ratingIdentificator: string,
    orderRating: number
}

export interface UserAttributes {
    id: number,
    name: string,
    email: string
}
