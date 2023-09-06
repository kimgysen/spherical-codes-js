import {FC} from "react";
import InputConfig from "../../../../common/domain/InputConfig";
import Slider from 'rc-slider';
import './ThoroidalInputConfig.css';
import 'rc-slider/assets/index.css';


interface ThoroidalInputConfigCmpProps {
	nrPoints: number;
	setNrPoints: Function;
	inputConfig: InputConfig;
	setInputConfig: Function;
}

const ThoroidalInputConfigCmp: FC<ThoroidalInputConfigCmpProps> = ({nrPoints, setNrPoints, inputConfig, setInputConfig}) => {

	const {initRadius, speedFactor, maxCollisions, maxPrecision} = inputConfig;

	return (
		<div className='input-config'>
			<div className='label'>Nr of points: {nrPoints}</div>
			<Slider className='config-slider'
							min={4}
							max={200}
							step={1}
							defaultValue={nrPoints}
							onChange={nrPoints => setNrPoints(nrPoints)}
			/>
			<div className='label'>initial radius: {initRadius}</div>
			<Slider className='config-slider'
							min={0.01}
							max={0.10}
							step={0.01}
							defaultValue={initRadius}
							onChange={initRadius => setInputConfig({...inputConfig, initRadius})}
			/>
			<div className='label'>Speed factor: {speedFactor}</div>
			<Slider className='config-slider'
							min={0.1}
							max={1}
							step={0.0001}
							defaultValue={speedFactor}
							onChange={speedFactor => setInputConfig({...inputConfig, speedFactor})}
			/>
			<div className='label'>Max precision: 1e-{maxPrecision}</div>
			<Slider className='config-slider'
							min={1}
							max={16}
							step={1}
							defaultValue={16}
							onChange={maxPrecision => setInputConfig({...inputConfig, maxPrecision})}
			/>
			<div className='label'>Max collisions: {maxCollisions}</div>
			<Slider className='config-slider'
							min={1}
							max={250}
							step={1}
							defaultValue={maxCollisions}
							onChange={maxCollisions => setInputConfig({...inputConfig, maxCollisions})}
			/>
		</div>
	)
}

export default ThoroidalInputConfigCmp;
