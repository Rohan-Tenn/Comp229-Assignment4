import {Link} from 'react-router-dom';
import './Home.css';
import { useState, useEffect } from 'react';






export default function Home(){


   
   

    
    return(
        <>
        <h1>Welcome to My Portfolio</h1>
        

        <br />
        
        <div>
            <p>
                My mission is to provide only the best software and do it quickly and efficiently.
            </p>
        </div>

        <br />
        <br />

        <div>
             <Link to="/about"><button>About Me</button></Link> <Link to="/projects"><button>My Projects</button></Link> {/* 2 buttons to about me and projects */}
        </div>




        </>
    )
}