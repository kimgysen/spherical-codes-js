import {FC} from "react";
import ThoroidalCirclesCmp from "./component/thoroidal_circles/thoroidal_circles/ThoroidalCirclesCmp";
import './App.css';
import VerifyCirclesCmp from "./component/thoroidal_circles/verify_circles/VerifyCirclesCmp";

const App: FC = () => {
	return (
		<div className='app'>
			<ThoroidalCirclesCmp />
		</div>
	);
};

export default App;
