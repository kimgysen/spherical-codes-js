import {FC} from "react";
import './Header.css';
import MainMenu, {MainMenuProps} from "./MainMenu";

interface HeaderProps {
	title: string;
	mainMenuProps: MainMenuProps
}

const Header: FC<HeaderProps> = ({title, mainMenuProps}) => {
	return (
		<>
			<div className="header">
				<div className="center">
					<div className='title'>
						<h1>{title}</h1>
					</div>
					<MainMenu {...mainMenuProps} />
				</div>
			</div>
		</>
	)
}

export default Header;