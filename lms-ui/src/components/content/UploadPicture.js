import React, { useState , useRef} from 'react';
import styles from '../styles/AddUser.module.css';
import profile from '../content/Images/profile.jpg'

const UploadPicture = () => {
  const inputRef = useRef(null);
  const [image, setImage] = useState("");
  
  const [isToggled, setIsToggled] = useState(false);

  const handlePictureChange = () => {
   inputRef.current.click();
  };
  const handleImageChange=(event) => {
  const file = event.target.files[0];
  console.log(file);
  setImage(event.target.files[0]);
  }
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };
  return (
    <>
    <div className={styles.pictures} >
      <div className={styles.cont_1} onClick={handlePictureChange} >
      {/* <h2>Upload Profile Picture</h2> */}
    
      {image ? <img className={styles.img_aft} src={URL.createObjectURL(image)} alt=""/>:<img className={styles.img_bf} src={profile} alt=""></img>}
      <h3 style={{ cursor: 'pointer', marginTop: '42px', color: 'purple'}}>Upload Profile Picture</h3>
      </div>
      
      
      <input 
        type="file" ref={inputRef} accept='image/jpg, image/png, image/jpeg'  onChange={handleImageChange} style={{display:"none"}}
         />
      <div>
      {/* <button onClick={handleToggle}>
        {isToggled ? 'ON' : 'OFF'}
      </button> */}
    
    </div>
    </div>

    
    </>
  );
};

export default UploadPicture;

