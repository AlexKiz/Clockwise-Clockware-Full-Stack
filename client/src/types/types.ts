export type Params = {
    propsOrderId: string
    propsUserId: string 
    propsUserName: string
    propsUserEmail: string
    propsClockId: string
    propsCityId: string
    propsCityName: string
    propsOrderDate: string
    propsOrderTime: string
    propsMasterId: string
    propsMasterName: string
    ratingIdentificator: string
}

export type City = {
    cityId: number
    cityName: string
}

export type Master = {
    masterId: number
    masterName: string
    masterRating: number
    cities: City[]
}

export type User = {
    userId: number
    userName: string
    userEmail: string
}

export type Clock = {
    clockId: number
    clockSize: string
}

export type Order = {
    orderId: number
    clockId: number
    clockSize: string
    userId: number
    userName: string
    userEmail: string
    cityId: number
    cityName: string
    masterId: number
    masterName: string
    startWorkOn: string
    endWorkOn: string
}