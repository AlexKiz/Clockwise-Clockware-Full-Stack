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
    id: string,
    name: string,
    rating: number
}

export interface MasterCitiesAttributes {
    masterId: string,
    cityId: number
}

export interface OrderAttributes {
    id: string,
    clockId: number,
    userId: string,
    cityId: number,
    masterId: string,
    startWorkOn: string,
    endWorkOn: string,
    ratingIdentificator: string,
    orderRating: number
    isCompleted: boolean
    orderImages: string
    paymentDate: Date | string
}

export interface UserAttributes {
    id: string,
    name: string,
    password: string,
    email: string,
    role: string,
    masterId: string,
    hashVerify: string,
    isVerified: boolean,
    token: string
}

export interface BlogAttributes {
    id: string,
    title: string,
    pictures: string,
    background: string,
    description: string,
    body: string,
}
