import styles from './Logo.module.css';
import LogoImg from './imgs/GrupoElevato_Logo_RGB_Color.svg';

export function Logo() {
    return (
        <img className={styles.logo} src={LogoImg} alt="Grupo Elevato" />
    )
}