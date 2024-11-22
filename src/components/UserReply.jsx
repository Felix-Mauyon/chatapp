import { PlusSVG, MinusSVG, ReplySVG } from "./Svgs"


export default function UserReply({ image, name, time, message, score }) {
    return (
         <div className=" p-4 w-[550px] h-[250px] flex justify-between m-auto mt-5 rounded-lg bg-white gap-7">
            <div className="w-10 mt-4 h-[60%] rounded-lg py-3 flex flex-col justify-between text-[#C5C6EF] items-center bg-[#eaeaea] gap-1">
                <PlusSVG width='10px'/>
                <b className='text-[18px] text-m_blue'>{ score }</b>
                <MinusSVG width='10px'/>
            </div>
            <div className="w-[600px] font-rubik text-[16px] flex flex-col justify-evenly">
                <div className="flex justify-between">
                    <div className="w-[250px] flex justify-between items-center">
                        <img className='w-[40px]' src={image} alt="" />
                        <b>{name}</b>
                        <p className='text-m_text'>{time}</p>
                    </div>
                    <div className='pr-3 flex gap-2 text-m_blue hover:text-[#C5C6EF]'>
                        <ReplySVG width='15px'/>
                        <b className='pt-2'>Reply</b>
                    </div>
                </div>
                <textarea className="flex-grow border border-m_text rounded-md h-[90%] focus:outline-none focus:border-m_blue resize-none py-3 pl-5" placeholder="Add a comment..." ></textarea>
            </div>
        </div>
    )
}