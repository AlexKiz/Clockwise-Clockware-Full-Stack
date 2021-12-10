export type Params = {
    orderIdParam: string
    userIdParam: string
    userNameParam: string
    userEmailParam: string
    clockIdParam: string
    cityIdParam: string
    cityNameParam: string
    orderDateParam: string
    orderTimeParam: string
    masterIdParam: string
    masterNameParam: string
    ratingIdentificatorParam: string
}

export type City = {
    id: number
    name: string
}

export type Master = {
    id: string
    name: string
    rating: number
    ratedSum: number
    ratedQuantity: number
    cities: City[]
}

export type User = {
    id: string
    name: string
    email: string
    role: string
}

export type Clock = {
    id: number
    size: string
    installationTime: number
}

export type Order = {
    id: string
    user: User
    clock: Clock
    city: City
    master: Master
    startWorkOn: string
    endWorkOn: string
}

export type Rating = {
    ratingSum: number,
    ratingQuantity: number
}
