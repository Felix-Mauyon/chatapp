import { useState, useEffect} from "react"
import { addComment, addReply } from "../api/utils/dbActions"
import {account, databases } from "../api/appwrite"
import { Query } from "appwrite"



export default function CurrentUser({replyStatus, replyStateFunction, replyId, commentId, groupId}) {
    const [message, setMessage] = useState()
    const [userInitials, setUserInitials] = useState()
    const [userId, setUserId] = useState()

    console.log(groupId)

    const fetchUserData = async ()=>{
    try {
        const accountID = (await account.get()).$id
        const response = await databases.listDocuments('chatbox', 'user', [Query.equal('userAccountId', accountID),])
        if (response.documents.length > 0) {
            const userDoc = response.documents[0]
            setUserInitials(userDoc.image);
            console.log(userDoc.$id)
            setUserId(userDoc.$id)
        }
        else {
            console.log("No user found");
            return null
        }
        }
        catch (error) {
            console.log('error fetching userinitials: ', error)
        }
        }


    useEffect(() => {
        fetchUserData()
    }, [])

    const handleChange = (input) => {
        setMessage((input))
    }

    const handleSubmit = (message) => {


        if (!message) {
            replyStateFunction(false);
            return
        }
        if (!message.trim()) return;
        if (replyStatus) {
            if (replyId) {
                addReply(message, commentId, userId, groupId, replyId);
            }
            else {
                addReply(message, commentId, userId, groupId);
            }
            setMessage('');
            replyStateFunction(false);
        } else {
            addComment(message, groupId);
            setMessage('');
        }
    };


    return (
        <div className={`${replyStatus ? 'w-[550px]' : 'w-[700px]'} font-rubik p-4 px-6 justify-between flex h-[150px] m-auto mt-5 mb-10 pt-7 rounded-lg gap-4 bg-white`}>
            <div className='flex items-center justify-center w-12 h-12 bg-m_blue text-white rounded-full font-bold'>{ userInitials }</div>
            <textarea value={message} onChange={(e) => handleChange(e.target.value)} className="flex-grow border border-m_text rounded-md h-[90%] focus:outline-none focus:border-m_blue resize-none py-3 pl-5" placeholder={`${replyStatus ? 'Add reply...':'Add comment...'}`} ></textarea>
            <button onClick={() => handleSubmit(message)} className="w-[100px] h-[50px] rounded-lg p-1 text-white bg-m_blue hover:bg-[#C5C6EF]">{ replyStatus ? 'REPLY' : 'SEND' }</button>
        </div>
    )
}