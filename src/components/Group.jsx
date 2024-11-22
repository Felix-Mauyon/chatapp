import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { addGroup } from '../api/utils/dbActions'

export default function Group() {

    const [groupName, setGroupName] = useState('')
    const [groupLink, setGroupLink] = useState('')
    const navigate = useNavigate()

    const handleInput = (input) => {
        setGroupName(input)
    }
    const handleSubmit = async(groupName) => {
        if (groupName.length > 0) {
            const link = await addGroup(groupName)
            setGroupLink(link)
        }
        else {
            return 'Invalid Group Name'
        }
    }

    return (

        // This has to be a modal
        <>
            <div>
                <p>Create a group</p>
                <div>
                    <input onChange={(e) => handleInput(e.target.value)} value={groupName} type="text" name="" id="" placeholder="Enter group name .." />
                    <button onClick={() =>handleSubmit(groupName)}>Create group</button>
                </div>
            </div>
            {groupLink &&
                <div>
                    <p>Share this link to invite others to join:</p>
                    <input type="text" value={groupLink} readOnly />
                    <button onClick={() => navigator.clipboard.writeText(groupLink)}>Copy Link</button>
                </div>
            }
            <button onClick={()=> navigate('/chat')}>Continue to group</button>

        </>
    )
}