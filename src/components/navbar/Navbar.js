import { useNavigate  } from 'react-router-dom';
import React, {memo,useState} from "react";
import {Drawer,Menu } from "antd";
import "./navbar.css";
import { HomeOutlined, MenuOutlined, LoginOutlined } from '@ant-design/icons';
import {IoCaretUp} from 'react-icons/io5';
import kleerkastIcon from '../../images/wardrobe.png';
import kledingIcon from '../../images/shirt.png';

 export default memo(function Navbar() {
  
  const [openMenu, setOpenMenu] = useState(false);
  return (
  <div style={{paddingBottom:20}}>
    <div className='menuIcon' style={{backgroundColor:'rgb(150,150,150)', height:60, paddingLeft:12,paddingTop:12}}>
      <MenuOutlined style={{fontSize:30}} onClick={()=>{
      setOpenMenu(true);
    }}/>
      </div>
      <span className='headerMenu'>
    <NavbarItems/>
    </span>
    <Drawer open={openMenu} onClose={()=> {setOpenMenu(false)}} closable={false} bodyStyle={{backgroundColor:'rgb(150,150,150)'}}>
      <NavbarItems isInline/>
    </Drawer>
    </div>
  );
 },[]);

 function NavbarItems({isInline=false}){
  const navigate= useNavigate();
  return(
    <Menu style={{backgroundColor:'rgb(150,150,150)',border:'none',fontSize:18}} mode={isInline?"inline":"horizontal" } items={[
      {label: 'Home', icon: <HomeOutlined size={30}/>, key: '/', onClick: () => navigate('/')},
      {label: 'Kleerkasten', icon: <img src={kleerkastIcon} alt="Kleerkasten" style={{width:15, height:15}}/>, key: '/kleerkasten', onClick: () => navigate('/kleerkasten')},
      {label: 'Kleren', icon: <img src={kledingIcon} alt="Kleren" style={{width:15, height:15}}/>, key: '/kleren', onClick: () => navigate('/kleren')},
      {label: 'Log in', icon: <LoginOutlined />, key: '/login', onClick: () => navigate('/login'), style: { marginLeft: 'auto'}},
      {label: 'Registreer', icon: <IoCaretUp />, key: '/register', onClick: () => navigate('/register')}
    ]} />
  );
 }