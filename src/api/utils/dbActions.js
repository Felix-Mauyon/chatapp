import { Query } from 'appwrite';
import { account, databases, ID } from '../appwrite.js'


const getInitials = (name) => {
const nameArray = name.split(' ');
if (nameArray.length === 1) {
    return nameArray[0].charAt(0).toUpperCase();
}
return `${nameArray[0].charAt(0)}${nameArray[1].charAt(0)}`.toUpperCase();
};

const getUserId = async () => {
    const userAccountId = await getUserAccountId()
    const userId = (await databases.listDocuments('chatbox', 'user', [Query.equal('userAccountId', userAccountId)])).documents[0].$id
    return userId
}


const getUserAccountId = async () => {
    try {
        const response = await account.get();
        console.log(response.$id)
        return response.$id
    } catch (error) {
        console.log('Error fetching user ID: ', error);
        return null
    }
};

export async function addUser(name) {

    const userAccountId = await getUserAccountId()
    console.log(userAccountId)

    if (!userAccountId) {
        console.log("No user account ID found.");
        return null;
    }



    try {
        const existingUser = await databases.listDocuments('chatbox', 'user', [Query.equal('userAccountId', userAccountId)])
        if (existingUser) {
        console.log("User already exists:", existingUser.documents[0].$id);
        return existingUser.documents[0].$id
    }
    } catch (error) {
        console.log('No existing user with userAccountId: ', userAccountId)
    }

    try {

        const response = await databases.createDocument(
            'chatbox',
            'user',
            ID.unique(),
            {
                username: name,
                image: getInitials(name),
                userAccountId : userAccountId

            }
        )
        console.log(response.$id, response.userAccountId)
        return response.$id

    } catch (error) {
        console.log('Error creating document: ', error)

    }
}


export async function addComment(content, groupId) {

    const userId = await addUser()


    try {

        const response = await databases.createDocument(
            'chatbox',
            'comments',
            ID.unique(),
            {
                content: content,
                userId: userId,
                groupId: groupId
            }

        )
        console.log(response)
        return response.$id
    } catch (error) {
        console.log('Error: ', error)
    }
}



export async function addReply(message, commentId, userId, groupId, parentResponseId=null) {
    try {


        const replyData = {
            content: message,
            userId,
            commentId,
            parentReplyId: parentResponseId,
            groupId
        };

        console.log(replyData)

        const response = await databases.createDocument('chatbox', 'replies', ID.unique(), replyData);
        console.log(response);
        return response.$id;
    } catch (error) {
        console.log('Error adding reply:', error);
    }
}

const baseUrl = import.meta.env.VITE_BASE_URL;
function getGroupLink(groupId) {
  return `${baseUrl}/group/${groupId}`;
}

export async function addGroup(name) {
    try {
        const userId = await getUserId()

        const groupId = ID.unique()
        const link = getGroupLink(groupId)

        const groupDetailsResponse = await databases.createDocument(
            'chatbox',
            'groups',
            groupId,
            {
                groupName: name,
                groupLink : link
            }

        )

        const userGroupRelationship = await databases.createDocument(
            'chatbox',
            'usergroups',
            ID.unique(),
            {
                userId: userId,
                groupId : groupId
            }

        )

        console.log(link)
        return link
    } catch (error) {
        console.log(error)
    }
}


export const fetchSideBarData = async () => {
    const userId = await getUserId()
    console.log(userId)
    const response = await databases.listDocuments('chatbox', 'usergroups', [Query.equal('userId', userId)])
    const fetchGroupsWithId = response.documents
    console.log(fetchGroupsWithId)


    try {
        if (fetchGroupsWithId) {

            const groupDataArray = await Promise.all(
                fetchGroupsWithId.map(async (data) => {
                    const groupId = data.groupId
                    const fetchGroupsName = await databases.listDocuments('chatbox', 'groups', [Query.equal('$id', groupId)])
                    const groupName = fetchGroupsName.documents[0].groupName
                    const groupData = {groupName: groupName, groupId: groupId}
                    return groupData
                })

            )
                console.log(groupDataArray)
                return groupDataArray
        }
    }
    catch (error) {
        console.log(error)
    }
}


export async function joinGroup(groupId) {
    try {
        if (!groupId) {
            console.log(groupId);
            return { success: false, message: 'Invalid group ID' };
        }
        const userId = await getUserId()
        console.log(userId)
        if (!userId) {
            alert('User not authenticated');
            return { success: false, message: 'Error getting userId to join group. User not authenticated' };
        }
        const idCheck = (await databases.listDocuments('chatbox', 'usergroups', [
            Query.equal('userId', userId),
            Query.equal('groupId', groupId)
        ])).documents.length > 0
        if (idCheck) {
            alert('You already joined this group')
            return { success: false, message: 'Already a member of this group' };
        }
        else {

            const userGroupRelationship = await databases.createDocument(
                'chatbox',
                'usergroups',
                ID.unique(),
                {
                    userId: userId,
                    groupId: groupId
                }

            )
        }
        console.log('Group Joined Successfully')
        return true
    } catch (error) {
        console.log('Error joining group: ', error)
    }
}


