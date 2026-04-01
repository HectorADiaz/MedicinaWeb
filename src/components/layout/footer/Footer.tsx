// src/components/layout/Footer.tsx

import './Footer.css';


const Footer = () => {
    return (
        <>
            <div className="footer-container">
                <p>Todos los derechos reservados © {new Date().getFullYear()}</p>
                <p>Contacto: <a href="mailto:mail@mail.com">mail@mail.com</a></p>
            </div>
        </>
    );
}
export default Footer;