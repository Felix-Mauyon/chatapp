import { useNavigate, useParams } from "react-router-dom"
import { joinGroup } from "../api/utils/dbActions"
import { useEffect, useState } from "react"

export function JoinGroup() {
    const navigate = useNavigate()
    const { groupId } = useParams()


useEffect(() => {
    const handleJoinGroup = async () => {
        try {
            const groupJoined = await joinGroup(groupId);

            if (groupJoined) {
                navigate('/chat');
            } else {
                alert('Group not joined');
                navigate(-1);
            }
        } catch (error) {
            console.error('Error joining group:', error);
            alert('An error occurred while joining the group');
            navigate(-1);
        }
    };

    if (groupId) {
        handleJoinGroup();
    }
}, [groupId]);



    return (
    <div>Joining group...</div>
    )
}