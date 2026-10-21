    import React from 'react';
    import { Link } from 'react-router-dom';
    
    export const Footer = () =>{
        return(
            <footer className="home-footer">

            <div className="footer-top">

                <Link to="/" className="footer-logo">
                    ˚₊‧𝓨𝓸𝓾𝓻 𝓛𝓲𝓽𝓽𝓵𝓮 𝓢𝓽𝓸𝓻𝓮‧₊˚
                </Link>

                <p>
                    Simple pieces, thoughtfully chosen.
                </p>

                <div className="footer-nav">
                    <Link to="/">Home</Link>
                    <Link to="/products">Shop</Link>
                    <Link to="/contact">Contact</Link>
                </div>

            </div>

                <div className="footer-bottom">
                <span>© 2026 Your little Store</span>
                <span>Made with ♡</span>
                </div>

        </footer>
        );
    }
        
        