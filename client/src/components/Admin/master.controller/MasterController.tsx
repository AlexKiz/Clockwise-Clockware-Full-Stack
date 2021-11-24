import axios from "axios";
import React, { useState, useEffect, FC } from "react";
import { useParams, useHistory} from "react-router-dom"
import '../master.controller/master-update-form.css'
import { City, Master, Params } from '../../../types/types'

interface MasterControllerProps {}

const MasterController: FC<MasterControllerProps> = () => {

    const history = useHistory()

    const { propsMasterId, propsMasterName } = useParams<Params>()

    const [masterName, setMasterName] = useState<string>('')
    const [masterId, setMasterId]= useState<number>(0)

    const [citiesId, setCitiesId] = useState<number[]>([])
    const [cities, setCities] = useState<City[]>([]) 
    
    
    useEffect(() => {
        
        const readMasters = async () => {
            
                const {data} = await axios.get<Master[]>(`/master`)

                if(propsMasterId && data.length) {

                    const currentMaster = data.filter(item => item.masterId === +propsMasterId)
                    
                    const currentMasterCities = currentMaster[0].cities.map((elem) => {return elem.cityId})

                    setMasterName( propsMasterName )
                    setMasterId ( +propsMasterId )
                    setCitiesId ( currentMasterCities )
                }
            
            }

        readMasters()
        
    }, [])

    useEffect(() => {

        const readCities = async () => {
            
            const {data} = await axios.get<City[]>(`/city`) 

            if(data.length){

                setCities(data)
                
            }
            
        }

        readCities()
    }, [])


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!propsMasterId) {

                axios.post(`/master`,
            {
                name: masterName, 
                cities_id: citiesId
            }).then(() =>{
                setMasterName('')
                alert('Master has been created')
                history.push('/admin/masters-list')
            })

        } else {

            axios.put(`/master`, {
                    id: masterId,
                    name: masterName, 
                    cities_id: citiesId
            }).then(() => {
                alert('Master has been updated')
                history.push('/admin/masters-list')
            })
        }
        
    }


    return (
        <div className='container-form'>

            <form className='form' onSubmit={onSubmit}>

                <div>

                    <div className='form-section'>
                        <div className='form-input__label'>
                            <label>Enter master name:</label>
                        </div>
                        <input 
                        type='text'
                        placeholder = 'Name Surname'
                        pattern='^[A-Za-zА-Яа-я]{3,49}$|^[A-Za-zА-Яа-я]{3,49}[\s]{1}[A-Za-zА-Яа-я]{3,50}$'
                        title='Master name must be at least 3 letter and alphabetical characters only'
                        value={masterName}
                        onChange={(masterNameEvent) => setMasterName(masterNameEvent.target.value)}
                        >                        
                        </input>
                    </div>
                    
                    
                        <div className='form-input__label'>
                            <label>Choose master's сity:</label>
                        </div>

                        <div className='form-section_checkbox'>
                            {
                                cities.map(({cityName, cityId}) => (
                                    <div className='form-section_checkbox'>
                                        <div className='form-input_checkbox'>
                                            <input 
                                            type="checkbox" 
                                            value={cityId}
                                            checked={citiesId.includes(cityId)}
                                            onChange = {
                                                function (event) {
                                                    if (event.target.checked) {

                                                        setCitiesId([...citiesId, +event.target.value])
                                                    
                                                    } else {
                                                    
                                                        setCitiesId([...citiesId].filter((elem) => elem !== +event.target.value))
                                                    
                                                    }
                                                }
                                            }
                                            />
                                        </div>
                                        <div className='checkbox-label'>
                                            <span className='form-input_checkbox-name'>{cityName}</span>
                                        </div>    
                                    </div>
                                ))
                            }
                        </div>

                    <div className='form-button'>
                        <button type='submit'>
                            Submit
                        </button>
                    </div>
                
                </div>

            </form>

        </div>
    )
}

export default MasterController