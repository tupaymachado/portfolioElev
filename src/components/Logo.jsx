import styles from './Logo.module.css';
import LogoImg from './imgs/logo.svg';

export function Logo() {
    

    return (
        <div className={styles.logoWrapper}>            
            <img className={styles.logo} src={LogoImg} alt="Grupo Elevato" />
        </div>
    )
}