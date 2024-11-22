import { ReplySVG, PlusSVG, MinusSVG } from './Svgs'
import CurrentUser from './CurrentUser';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns'

const formatTime = (time) => {
    const relativeTime = formatDistanceToNow(new Date(time), { addSuffix: false });
  return relativeTime
}



function MessageCard({ image, name, time, message, replyChecker, commentId, replyId, groupId }) {
    const [replyStatus, setReplyStatus] = useState(false)
    const timeFormatted = formatTime(time)

    console.log('Group id 2', groupId)


    function handleReply() {
        setReplyStatus(true)

    }



    return (
        <>
        <div className={`${replyChecker ? 'w-[500px] h-auto border-l-4 border-m_blue' : 'w-[550px] h-auto '} p-4 pb-5 px-6 flex justify-between m-auto mt-3 rounded-lg bg-white gap-7`}>
            <div className="w-[600px] font-rubik text-[16px] flex flex-col justify-evenly">
                <div className="flex justify-between mb-4">
                    <div className="w-[260px] flex items-center text-[0.85em]">
                        <div className='flex items-center justify-center w-8 h-8 bg-m_blue text-white rounded-full text-[13px] flex-grow-1 mr-5'>{ image }</div>
                        <b className='flex-grow-2 mr-5'>{name}</b>
                        <p className='text-m_text flex-grow-2'>{timeFormatted}</p>
                    </div>
                    <div onClick={handleReply} className='pr-3 flex gap-2 text-m_blue hover:text-[#C5C6EF] text-[0.85em]'>
                        <ReplySVG width='15px'/>
                        <b className='pt-2 '>Reply</b>
                    </div>
                </div>
                <p className='text-m_text'>{ message }</p>
            </div>
            </div>
            {replyStatus && <CurrentUser replyStatus={replyStatus} replyStateFunction={setReplyStatus} commentId={commentId} replyId={replyId} groupId={groupId} />}
        </>
    )
}

export default MessageCard;