// import React, { useState, useEffect } from "react";
// import TinderCard from 'react-tinder-card';
// import PersonIcon from '@material-ui/icons/Person';
// import ChatIcon from '@material-ui/icons/Chat';
// import IconButton from "@material-ui/core/IconButton";

// function Home()
// {
//     function gotoMatchList()
//     {
//         window.location.href='/MatchList';
//     }

//     function gotoSettings()
//     {
//         window.location.href='/Settings';
//     }

//     const[peolpe, setPeople] = useState([
//         {
//             name: 'Jack',
//             url: 'https://upload.wikimedia.org/wikipedia/en/c/cd/CreedBratton%28TheOffice%29.jpg'
//         },
//         {
//             name: 'Sunny',
//             url: 'https://smartcdn.prod.postmedia.digital/vancouversun/wp-content/uploads/2019/04/ali-skovbye-headshot-2.jpg'
//         },
//         {
//             name: 'Jack',
//             url: 'https://content.api.news/v3/images/bin/8509e5cc46911c38ec54a81227ccde37'
//         },
//     ]);

//     return (
//         <div class='home_page_wrraper'>
//             <div class='header'>
//                 <IconButton onClick={gotoSettings}>
//                     <PersonIcon class="header_icon" fontSize="large"/>
//                 </IconButton>
                
//                 <img className="header_logo" src='/kindling-icon.png'></img>
               
//                <IconButton onClick={gotoMatchList}>
//                     <ChatIcon class="header_icon" fontSize="large"/>
//                 </IconButton>
//             </div>

//             <div class='home_UI'>
//                 {peolpe.map(person => (
//                     <TinderCard className='swipe' 
//                     key={person.name}
//                     preventSwipe={['up','down']}>
//                         <div className="card">
//                             <h3>{person.name}</h3>
//                         </div>
//                     </TinderCard>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Card;