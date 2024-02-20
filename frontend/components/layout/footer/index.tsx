import './index.scss';
import Image from 'next/image';

const Footer = () => {

    return (
        <footer>
            <div className="footer-container">
                <div className='footer-columns'>
                    <Image src={'/logo.png'} height={50} width={50} alt="logo" />
                    <p className="footer-text">Copyright @ antika.noor</p>
                </div>
                <div className='footer-columns'>
                    <p className="footer-text-heading">Company</p>
                    <p className="footer-text">Privacy Policy</p>
                    <p className="footer-text">About Us</p>
                    <p className="footer-text">Contact Us</p>
                </div>
                <div className='footer-columns'>
                    <p className="footer-text-heading">Social</p>
                    <p className="footer-text">Facebook</p>
                    <p className="footer-text">Twitter</p>
                    <p className="footer-text">Instagram</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
