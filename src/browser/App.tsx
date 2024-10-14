import {FC, useState} from "react";
import './style/reset.css';
import 'react-tabs/style/react-tabs.css';
import './App.css';
import ThoroidalCirclesCmp from "./component/thoroidal_circles/thoroidal_circles/ThoroidalCirclesCmp";
import Header from "./component/widget/header/HeaderCmp";
import TabsWidget from "./component/widget/tabs/TabsWidget";
import SphericalCirclesCmp from "./component/spherical_circles/SphericalCirclesCmp";
import UploadJsonCmp from "./component/thoroidal_circles/upload_json/UploadJsonCmp";

export enum MainView {THOROIDAL, SPHERE}

const App: FC = () => {

	const [mainView, setMainView] = useState(MainView.THOROIDAL);

	return (
		<div className='app'>
			<Header
				title='Spherical Codes'
				mainMenuProps={{mainView, setMainView}}
			/>
			<div className='app-body'>
				<div className="center">
					{
						mainView === MainView.THOROIDAL && (
							<TabsWidget
								titles={['Max radius', 'Upload json']}
								panels={[<ThoroidalCirclesCmp/>, <UploadJsonCmp/>]}
							/>
						)
					}
					{
						mainView === MainView.SPHERE && (
							<SphericalCirclesCmp />
						)
					}
				</div>
			</div>
		</div>
	);
};

export default App;
