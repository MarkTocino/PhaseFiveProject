'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Staatliches } from 'next/font/google'
import { UserContext } from '@/Context/UserProvider'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle,NavbarMenu,NavbarMenuItem
} from "@nextui-org/react";
import {Modal, ModalContent,Button, useDisclosure} from "@nextui-org/react";
import { Link } from '@nextui-org/react'
import { Input } from '@nextui-org/react';
import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/react";
const staatliches = Staatliches({
  weight:'400',
  subsets:['latin'],
  display: 'swap'
})
export const Dashboard = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const { user } = useContext(UserContext)
const handlelogout = () => {
  fetch("http://127.0.0.1:5555/Logout",{
    method:"POST",
    credentials:"include",
  })
}
const [images, setImage] = useState([]);
useEffect(() => {
  fetch("http://127.0.0.1:5555/UserDashboard",{
    credentials: "include"
  })
  .then((response => response.json()))
  .then((response) => {
    const sortedMap = response
    .flatMap(userPhoto => userPhoto.posts.map(image => ({...image, username:userPhoto.username,
    post_likes:userPhoto.post_likes
    })))
    .sort((a,b) => b.id - a.id);
    sortedMap.map(comment => comment.post_comments.sort((a,b) => b.id - a.id))
    setImage(sortedMap);
  })
  .catch("This was an error fetch")
},[]
)
const [title, setTitle] = useState('')
const [comment, setComment]= useState('')
const [file ,setFile] = useState(null)
const handleComment = (e, post_id) => {
  e.preventDefault()
  fetch(`http://127.0.0.1:5555/Comment/${post_id}`,{
    method:"POST",
    credentials:"include",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      comment:comment,
    })
  })
  .then(fetch("http://127.0.0.1:5555/UserDashboard",{
    credentials: "include"
  })
  .then((response => response.json()))
  .then((response) => {
    const sortedMap = response
    .flatMap(userPhoto => userPhoto.posts.map(image => ({...image, username:userPhoto.username,
    post_likes:userPhoto.post_likes
    })))
    .sort((a,b) => b.id - a.id);
    sortedMap.map(comment => comment.post_comments.sort((a,b) => b.id - a.id))
    setImage(sortedMap);
  })
  .catch("This was an error fetch"))
}
const handlePost = (e) => {
  // NOTE TO SELF: FORMDATA() is used when Content or encType is multipart/form-data:
  const formData = new FormData();
  formData.append("photo", file);
  formData.append("title", title);
  fetch("http://127.0.0.1:5555/UploadImage",{
    method: "POST",
    credentials:"include",
  headers: {
    "encType": "multipart/form-data",
  },
  body: formData
  })
  .then (fetch("http://127.0.0.1:5555/UserDashboard",{
    credentials: "include"
  })
  .then((response => response.json()))
  .then((response) => {
    const sortedMap = response
    .flatMap(userPhoto => userPhoto.posts.map(image => ({...image, username:userPhoto.username,
    post_likes:userPhoto.post_likes
    })))
    .sort((a,b) => b.id - a.id);
    setImage(sortedMap);
    
  })
  .catch("This was an error fetch"))
}
const handleLike = (e, post_id) => {
  // e.preventDefault();
  setImage((pastState) => pastState.map((image) =>
    image.id === post_id ? { ...image, likes: image.likes + 1 } : image
  )
);
  fetch(`http://127.0.0.1:5555/Like/${post_id}`,{
    method: "PATCH",
    credentials:"include",
  headers: {
    "Content-Type":"application/json"
  },
  body: JSON.stringify({
    likes:1
  }),
  })
  .catch("FAILED TO POST")
}
const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
<>
<Navbar isBordered={true} shouldHideOnScroll={true} onMenuOpenChange={setIsMenuOpen} className='justify-start'>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
      <NavbarBrand className='flex justify-center'/>Dashboard
      <NavbarMenu>
          <NavbarMenuItem>
            <Link href='Dashboard'>
            Dashboard
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='UserProfile'>
            Posts
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='AccountSettings'>
            UserProfile/Settings
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
          <Link onClick={handlelogout} href='/'>
            Logout
            </Link>
          </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
<div className='Container bg-gradient bg-cyan-500'>
    {images ?  (
      images.map((image) => (
        <div key={image.id}>
          <h1 className='text-md'>{image.username} : {image.title}</h1>
          <img
            src={`data:image/jpeg;base64, ${image.photo}` || `data:image/png;base64. ${image.photo}`}
            alt='Images From Database'
          ></img>
          <h2 className='flex'>Likes : {image.likes}</h2>
          <div>
          <div className='flex'>
          <Button size='small' color='primary' variant='ghost' className='border-small border-black' onClick={(e) => handleLike(e, image.id)}><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M5.62436 4.4241C3.96537 5.18243 2.75 6.98614 2.75 9.13701C2.75 11.3344 3.64922 13.0281 4.93829 14.4797C6.00072 15.676 7.28684 16.6675 8.54113 17.6345C8.83904 17.8642 9.13515 18.0925 9.42605 18.3218C9.95208 18.7365 10.4213 19.1004 10.8736 19.3647C11.3261 19.6292 11.6904 19.7499 12 19.7499C12.3096 19.7499 12.6739 19.6292 13.1264 19.3647C13.5787 19.1004 14.0479 18.7365 14.574 18.3218C14.8649 18.0925 15.161 17.8642 15.4589 17.6345C16.7132 16.6675 17.9993 15.676 19.0617 14.4797C20.3508 13.0281 21.25 11.3344 21.25 9.13701C21.25 6.98614 20.0346 5.18243 18.3756 4.4241C16.7639 3.68739 14.5983 3.88249 12.5404 6.02065C12.399 6.16754 12.2039 6.25054 12 6.25054C11.7961 6.25054 11.601 6.16754 11.4596 6.02065C9.40166 3.88249 7.23607 3.68739 5.62436 4.4241ZM12 4.45873C9.68795 2.39015 7.09896 2.10078 5.00076 3.05987C2.78471 4.07283 1.25 6.42494 1.25 9.13701C1.25 11.8025 2.3605 13.836 3.81672 15.4757C4.98287 16.7888 6.41022 17.8879 7.67083 18.8585C7.95659 19.0785 8.23378 19.292 8.49742 19.4998C9.00965 19.9036 9.55954 20.3342 10.1168 20.6598C10.6739 20.9853 11.3096 21.2499 12 21.2499C12.6904 21.2499 13.3261 20.9853 13.8832 20.6598C14.4405 20.3342 14.9903 19.9036 15.5026 19.4998C15.7662 19.292 16.0434 19.0785 16.3292 18.8585C17.5898 17.8879 19.0171 16.7888 20.1833 15.4757C21.6395 13.836 22.75 11.8025 22.75 9.13701C22.75 6.42494 21.2153 4.07283 18.9992 3.05987C16.901 2.10078 14.3121 2.39015 12 4.45873Z" fill="#1C274C"/>
          </svg></Button>
          
          <Popover shouldBlockScroll={true}>
            <PopoverTrigger>
            <Button size='small' color='primary' variant='ghost' className='border-small border-black'><svg width="20px" height="20px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12H8.01M12 12H12.01M16 12H16.01M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg></Button></PopoverTrigger>
            <PopoverContent>
            <div className='min-h-fit max-h-44 overflow-y-scroll text-left'>
            {image.post_comments.map((comments)=> (
              <div key={comments.id} className='flex flex-wrap justify-start text-left max-w-md overflow-x-hidden w-48'>
              {comments.username} : <p>{comments.comment}</p>
              </div>
            ))}
            </div>

            <form onSubmit={(e)=> handleComment(e, image.id)}>
            <label>Comment:</label>
            <Input color='primary' size='sm' onChange={(e) => setComment(e.target.value)} type='text'></Input>
          <Button type='submit'>Submit</Button>
          </form>
          </PopoverContent>   
          </Popover>
            </div>
          </div>
        </div>
      ))
    ) : (
      <h1>IMAGE LOADING</h1>
    )}
</div>
<div className='flex w-full sticky bottom-0 justify-center z-10'>
<Button className='w-full' radius='none' color='primary' size='Large' onPress={onOpen}>Make a Post!</Button>
</div>
      <Modal className='flex' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
            <form onSubmit={handlePost}>
              <br></br>
              <label onChange={(e) => setTitle(e.target.value)}>What Would You Like To Say?<Input type='text'></Input></label>
              <br></br>
              <label><input id="photo" onChange={(e) => setFile(e.target.files[0])} type='file'></input></label>
              <Button type='submit'>Submit Post</Button>
            </form>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                
            </>
            
          )}
        </ModalContent>
      </Modal>
</>
  )
}
export default Dashboard
