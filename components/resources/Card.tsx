import React from 'react'
import Image from 'next/image'

interface TutorialCardProps {
  icon?: string
  text: string
  boldText?: string
}

export default function TutorialCard({ icon, text, boldText }: TutorialCardProps) {
  return (
    <div className='flex items-center gap-2 border border-[#707070] rounded-[20px] p-4 w-full h-[80px] relative bg-white'>
      {/* Icon placeholder - will be replaced later */}
      {icon ? (
        <Image src={icon} alt="Card icon" width={45} height={45} />
      ) : (
        <div className='w-[45px] h-[45px] bg-gray-200 rounded flex-shrink-0' />
      )}
      
      {/* Text */}
      <div className='text-[16px] text-[#36463A] flex-1' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        {text} {boldText && <span className='font-bold'>{boldText}</span>}
      </div>
      
      {/* Decorative SVG */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        width="93" 
        height="79" 
        viewBox="0 0 93 79" 
        className="absolute bottom-0 right-0"
      >
        <defs>
          <clipPath id="clip-path">
            <rect id="Rectangle_1365" data-name="Rectangle 1365" width="93" height="79" rx="19" transform="translate(-21 0)" fill="#fff" stroke="#707070" strokeWidth="1"/>
          </clipPath>
        </defs>
        <g id="Mask_Group_95" data-name="Mask Group 95" transform="translate(72 79) rotate(180)" opacity="0.7" clipPath="url(#clip-path)">
          <path id="Path_514" data-name="Path 514" d="M192.764,6.284c4.3,19.468,7.084,39.512,12.121,58.77,9.34,35.787,35.682,62.233,71.469,71.521,18.576,4.775,38.621,7.924,57.459,12.016.734.157,2.361-.367,1.941.945-19.467,4.67-40.037,7.4-59.4,12.436-35.787,9.235-62.076,35.682-71.469,71.469-4.565,17.474-6.979,36.049-11.229,53.68l-1.732,5.09c-4.828-19.258-7.4-39.617-12.436-58.77-9.393-35.892-35.577-62.076-71.469-71.469-17.474-4.618-36.049-7.031-53.68-11.282l-5.09-1.732c19.258-4.775,39.617-7.4,58.77-12.384,35.892-9.393,62.076-35.629,71.469-71.521,4.933-18.785,7.819-38.883,12.174-57.931.157-.892-.42-1,1.1-.84" transform="translate(-237.411 -172.871)" fill="none" stroke="#6d8b75" strokeWidth="10"/>
          <path id="Path_515" data-name="Path 515" d="M207.6,6.29c4.747,21.479,7.816,43.6,13.374,64.844,10.305,39.485,39.369,68.665,78.855,78.913,20.5,5.269,42.612,8.742,63.4,13.258.81.174,2.6-.405,2.142,1.042-21.479,5.153-44.175,8.163-65.539,13.721-39.485,10.19-68.491,39.369-78.855,78.855-5.037,19.279-7.7,39.775-12.39,59.228l-1.911,5.616c-5.327-21.248-8.163-43.712-13.721-64.844-10.363-39.6-39.254-68.491-78.855-78.855-19.28-5.095-39.775-7.758-59.228-12.448l-5.616-1.911c21.248-5.269,43.711-8.163,64.844-13.664,39.6-10.363,68.492-39.312,78.855-78.913,5.442-20.727,8.627-42.9,13.432-63.918.174-.984-.463-1.1,1.216-.926" transform="translate(-232.276 -194.578)" fill="none" stroke="#36463a" strokeWidth="10"/>
        </g>
      </svg>
    </div>
  )
}
