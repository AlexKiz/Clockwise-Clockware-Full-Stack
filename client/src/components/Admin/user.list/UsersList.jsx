import axios from "axios";
import { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import '../user.list/user-list.css'

const UserList = () => {

    const [users, setUsers] = useState([])


    useEffect(() => {

        const readAllUsers = async () => {

            const { data } = await axios.get(`/user`)
            
            setUsers(data)
        }
        
        readAllUsers()

    },[])


    const onDelete = (id) => {

        if(window.confirm("Do you want to delete this user?")) {
            axios.delete(`/user`,
            {
                data: {
                    id
                }
            }).then(() => {

                setUsers(users.filter((elem) => elem.id !== id))
                
                alert('User has been deleted')
            })
        }
    }


    return (

            <div className='conteiner'>

                <div className='wrapper-table'>
                    
                    <table className='content-table-users'>
                        <tr>
                            <th className='th-user-id'>Id</th>
                            <th className='th-user-name'>User name</th>
                            <th className='th-email'>Email</th>
                        </tr>
                        { 
                            users.map((elem) => (
                                <tr>
                                    <td>{`${elem.id}`}</td>
                                    <td>{`${elem.name}`}</td>
                                    <td>{`${elem.email}`}</td>
                                    <button className='button-update'><Link to={`/admin/user-controller/${elem.id}/${elem.name}/${elem.email}`}>Update</Link></button>
                                    <button className='button-delete' onClick ={() => onDelete(elem.id)}>Delete</button>
                                    </tr>
                            ))
                        }
                    </table>
                </div>

            </div>
    )
}

export default UserList