import './Services.css';
import Csharp_Logo from '../assets/Csharp_Logo.png';
import htmlpage from '../assets/html.png';
import servers from '../assets/servers.png';
export default function Services(){
    return(
        <>
        <h1></h1>
        <h1>Services Offered</h1>
            <div class ="services-images">

            <ul> 
                <li>C# Programming</li>
                <li>Website Development</li>
                <li>Moblie Apps</li>
                <li>Server Development </li>
            </ul>

                <img  src={Csharp_Logo} alt="Csharp_Logo" />

                <img  src={htmlpage} alt="html text" />

                <img  src={servers} alt="server stack" />
                
                
            </div>


        </>
    )
}