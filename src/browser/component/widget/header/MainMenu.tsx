import DonutLogo from '../../../../assets/icons/ico-donut.svg';
import SphereLogo from '../../../../assets/icons/ico-sphere.svg';
import './MainMenu.css';
import {MainView} from "../../../App";
import {FC} from "react";

export interface MainMenuProps {
	mainView: MainView;
	setMainView: (mainView: MainView) => void;
}

const MainMenu:FC<MainMenuProps> = ({mainView, setMainView}) => {

	return (
		<div className='main-menu'>
			<ul>
				<li
					className={`${mainView === MainView.THOROIDAL ? 'active' : ''}`}
					onClick={() => setMainView(MainView.THOROIDAL)}>
					<img src={DonutLogo} alt="Donut Logo"/>
				</li>
				<li
					className={`${mainView === MainView.SPHERE ? 'active' : ''}`}
					onClick={() => setMainView(MainView.SPHERE)}>
					<img src={SphereLogo} alt="Sphere Logo"/>
				</li>
			</ul>
		</div>
	)
}

export default MainMenu;
