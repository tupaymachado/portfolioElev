import styles from './Logo.module.css';
import LogoImg from './imgs/logo.portfolio.png';

export function Logo() {
    

    return (
        <div className={styles.logoWrapper}>            
            <img className={styles.logo} src={LogoImg} alt="Empresa Placeholder" />
        </div>
    )
}