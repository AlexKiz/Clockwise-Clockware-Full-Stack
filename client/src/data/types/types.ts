import {DateRange} from '@mui/lab/DateRangePicker/RangeTypes';
import {AlertColor} from '@mui/material/Alert';


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
    hashVerify: string
    generated: string
    articleTitle: string
    paymentMessage: 'success' | 'error'
}

export type City = {
    id: number
    name: string
}

export type Master = {
    id: string
    name: string
    rating: number
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
    price: number
}

export type Order = {
    id: string
    user: User
    clock: Clock
    city: City
    master: Master
    startWorkOn: string
    endWorkOn: string
    orderRating: number
    ratingIdentificator: string
    isCompleted: boolean
    images: string
    paymentDate: string
    orderAddress: string | null
}

export type AlertNotification = {
    message: string
    type: AlertColor
    notify: boolean
}

export type FiltersList = {
    masterId?: string | null
    clockId?: number | null
    cityId?: number | null
    isCompleted?: boolean | null
    startWorkOn?: Date | null
    endWorkOn?: Date | null
}

export type FilterInstances = {
    city: City | null
    master: Master | null
    clock: Clock | null
    date: DateRange<Date>
};

export type csvOrderShape = {
    'Order Id': string,
    'Clock Size': string,
    'User Name': string,
    'User Email': string,
    'City': string,
    'Master Name': string,
    'Start On': string,
    'End On': string,
    'Completed': boolean,
    'Rating': number,
}

export type InfoOptions = {
    name: string,
    price: number,
    date: string,
    orderAddress: string | null,
    isInfoOpen: boolean,
}

export type MastersStatisticsData = {
    id: string,
    name: string,
    smallClocks: number,
    mediumClocks: number,
    largeClocks: number,
    rating: number,
    completed: number,
    uncompleted: number,
    earnedAmount: number
}

export type OrderForCalendar = {
    id: string,
    title: string,
    start: string,
    end: string,
    clockSize: string,
    isCompleted: boolean,
    clientName: string,
    clientEmail: string,
    price: string,
    ratingIdentificator: string,
    color: string,
}

export type Article = {
    id: string,
    title: string,
    background: string,
    description: string,
    body: string,
}

export type ArticleForRead = {
    id: string,
    title: string,
    background: string,
    description: string,
    body: string,
}
