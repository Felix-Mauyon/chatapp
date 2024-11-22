import { useEffect, useState } from 'react'
import MessageCard from './MessageCard'
import CurrentUser from './CurrentUser'
import LogOut from './LogOut'
import { client, databases } from '../api/appwrite'
import { Query } from 'appwrite'
import Sidebar from './Sidebar'
import { useParams } from 'react-router-dom'



function Chat() {

  const [commentData, setCommentData] = useState([])
  const [replyData, setReplyData] = useState({})
  const [loading, setLoading] = useState(true)
  const { groupId } = useParams()

  console.log('Group id', groupId)



  async function fetchReplyNameAndImage(id) {
  const fetchdata = await databases.listDocuments('chatbox', 'user', [Query.equal('$id', id)])
  const userDocument = fetchdata.documents[0]
  return {
  username: userDocument.username,
  image: userDocument.image
  }
  }


  const fetchCommentDetails = async () => {
    try {
      const commentDetails = (await databases.listDocuments('chatbox', 'comments', [Query.equal('groupId', groupId)])).documents;
      const userDatapromises = commentDetails.map(async (cmt) => {
        const userDetails = await databases.getDocument ('chatbox', 'user', cmt.userId);
        return { ...userDetails, ...cmt };
      });

      const userData = await Promise.all(userDatapromises);
      setCommentData(userData);
    } catch (error) {
      console.log('Error fetching comment details: ', error);
    }
  };

  async function fetchRepliesForComment(commentId) {
  try {
    const repliesWithCommentId = (await databases.listDocuments('chatbox', 'replies', [Query.equal('commentId', commentId),
          Query.equal('groupId', groupId)])).documents
    const repliesWithCommentIdEdited = await Promise.all(repliesWithCommentId.map(async (reply) => {
      const {username, image} = await fetchReplyNameAndImage(reply.userId)
      return {...reply, username, image}
    }))
    console.log(repliesWithCommentId)
    console.log(repliesWithCommentIdEdited)
    setReplyData((prevData) => ({
      ...prevData, [commentId] : repliesWithCommentIdEdited
    }))
  } catch (error) {
    console.log(`Error fetching replies with:${commentId} `, error)
  }
  }

  async function fetchCommentNameAndImage(entry) {
    try {
      const getEntryUserDetails = await databases.getDocument("chatbox", 'user', entry.userId)
      console.log(getEntryUserDetails)
      const newEntry = { ...entry, username: getEntryUserDetails.username, image: getEntryUserDetails.image }
      console.log(newEntry)
      return newEntry
    } catch (error) {
      console.log('Error: ', error)
    }

  }

  useEffect(() => {
    fetchCommentDetails()
  }, [groupId])

  useEffect(() => {
    const fetchAllReplies = async () => {
      try {
      const promises = commentData.map((cmt) => fetchRepliesForComment(cmt.$id));
      await Promise.all(promises);
      } catch (error) {
        console.log('error: ', error)
      }
      finally {
        setLoading(false)
      }
    }

    fetchAllReplies()


  }, [commentData])



  // using appwrite realtime effects
  useEffect(() => {
    const unsubscribeComments = client.subscribe('databases.chatbox.collections.comments.documents', async(response) => {
        const event = response.events[0]
      const newComment = response.payload
      console.log(newComment)

      if (newComment.groupId === groupId) {
        const newCommentModified = await fetchCommentNameAndImage(newComment)
        console.log(newCommentModified) //displays promise
        if (event.includes('create')) {
          setCommentData((prev) => [...prev, newCommentModified])
        }
      }

    })

    const unsubscribeReplies = client.subscribe(
      'databases.chatbox.collections.replies.documents',
      async(response) => {
        const event = response.events[0]
        const newReply = response.payload

        if (newReply.groupId === groupId) {
          const {username, image} = await fetchReplyNameAndImage(newReply.userId)
          const newReplyEdited = {...newReply, username, image}

          const commentId = response.payload.commentId

          console.log(newReply)
          console.log(newReplyEdited)

          setReplyData((prev) => {
            const updatedReplies = { ...prev }
            if (event.includes('create')) {
              updatedReplies[commentId] = [...(updatedReplies[commentId] || []), newReplyEdited]
            }

            return updatedReplies
          })
        }

      }
    )

    return () => {
      unsubscribeComments()
      unsubscribeReplies()
    }
  }, [groupId])



  return (
    <div className='flex h-screen'>
      {/* //<LogOut/> */}
      <Sidebar />
      <section className='w-full overflow-auto bg-[#eaeaea]'>

        {commentData.map((cmt) => (
          <div key={cmt.$id}>
            <MessageCard
              commentId={cmt.$id}
              name={cmt.username}
              message={cmt.content}
              image={cmt.image}
              time={cmt.$createdAt}
              score={cmt.score}
              groupId={groupId}
            />

            {replyData[cmt.$id] && replyData[cmt.$id].map((reply) => (
              <div key={reply.$id}>{console.log(reply.$createdAt)}
                <MessageCard
                  commentId={cmt.$id}
                  replyId={reply.$id}
                  name={reply.username}
                  message={reply.content}
                  image={reply.image}
                  time={reply.$createdAt}
                  score={reply.score}
                  replyChecker={replyData[cmt.$id]}
                  groupId={groupId}
                />

                {/* {reply.parentResponseId && } */}
              </div>
            ))}


          </div>
        ))
        }
        <section>
          {loading ? <div>Loading...</div> : <CurrentUser groupId={groupId} />}
        </section>

      </section>
    </div>

  )
}


export default Chat
