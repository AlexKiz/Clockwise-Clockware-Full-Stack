import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useHistory} from "react-router-dom"
import '../master.controller/master-update-form.css'

const MasterController = () => {

    const history = useHistory()

    const { propsMasterId, propsMasterName } = useParams()

    const [masterName, setMasterName] = useState('')
    const [masterId, setMasterId]= useState(0)

    const [citiesId, setCitiesId] = useState([])
    const [cities, setCities] = useState([]) 
    
    
    useEffect(() => {
        
        const readMaster = async () => {
            
                const {data} = await axios.get(`/master`)

                if(propsMasterId && data.length) {

                    const currentMaster = data.filter(item => item.masterId === +propsMasterId)
                    
                    const currentMasterCities = currentMaster[0].cities.map((elem) => {return elem.cityId})

                    setMasterName( propsMasterName )
                    setMasterId ( propsMasterId )
                    setCitiesId ( currentMasterCities )
                }
            
            }

        readMaster()
        
    }, [])

    useEffect(() => {

        const readCities = async () => {
            
            const {data} = await axios.get(`/city`) 

            if(data.length){

                setCities(data)
                
            }
            
        }

        readCities()
    }, [])


    const onSubmit = (event) => {
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

                data: {
                    id: masterId,
                    name: masterName, 
                    cities_id: citiesId
                }
                
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
                                cities.map(({name, id}) => (
                                    <div className='form-section_checkbox'>
                                        <div className='form-input_checkbox'>
                                            <input 
                                            type="checkbox" 
                                            value={id}
                                            checked={citiesId.includes(id)}
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
                                            <span className='form-input_checkbox-name'>{name}</span>
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