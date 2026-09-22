import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const location = useLocation();

    return(
        <header style={styles.header}>
            <h2 style={styles.logo}>SISTEMA DE CONTROLE DE ESTOQUE</h2>
            <nav style={styles.nav}>
                <Link
                    to="/"
                    style={{
                        ...styles.link,
                        borderBottom: location.pathname === '/' || location.pathname.startsWith('/produtos') ? '3px solid #1B85CC' : 'none',
                        fontWeight: location.pathname === '/' || location.pathname.startsWith('/produtos') ? 'bold' : 'normal'
                    }}
                >
                    Produtos
                </Link>
                <Link
                    to="/fornecedores"
                    style={{
                        ...styles.link,
                        borderBottom: location.pathname === '/fornecedores' ? '3px solid #1B85CC' : 'none',
                        fontWeight: location.pathname === '/fornecedores' ? 'bold' : 'normal'
                    }}
                >
                    Fornecedores
                </Link>
            </nav>
        </header>
    );
}

const styles = {
    header: {
        backgroundColor: 'var(--azul-escuro)',
        color: '#f3f3f3',
        display: 'flex', 
        justifyContent: 'space-between',
        alighItems: 'center',
        padding: '20px 40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        width: '100%'
    },
    logo: {
        margin: 0,
        fontSize: '1.25rem',
        fontFamily: 'var(--font-header-btn)',
        letterSpacing: '1px',
    },
    nav: {
        display: 'flex',
        gap: '25px'
    },
    link: {
        color: '#ffffff',
        textDecoration: 'none', 
        paddingBottom: '5px',
        fontSize: '1rem',
        fontFamily: 'var(--font-header-btn)',
        transition: 'all 0.2s ease'
    }
};