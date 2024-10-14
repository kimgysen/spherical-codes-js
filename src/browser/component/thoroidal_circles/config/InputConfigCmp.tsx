import {FC} from "react";
import {NumberPicker} from "react-widgets/esm";
import './ConfigCmp.css';
import "react-widgets/styles.css";
import {BrowserCfg} from "../../../../common/domain/BaseCfg";


interface InputConfigCmpProps {
	inputConfig: BrowserCfg;
	setInputConfig: Function;
}

const InputConfigCmp: FC<InputConfigCmpProps> = ({inputConfig, setInputConfig}) => {
	const {nrPoints, initRadius, speedFactor, maxCollisions, maxPrecision} = inputConfig;

	return (
		<div className='container'>
			<div className='label'>Nr of points</div>
			<NumberPicker defaultValue={nrPoints}
										min={4}
										step={1}
										onChange={nrPoints => setInputConfig({...inputConfig, nrPoints})}
			/>
			<div className='label'>initial radius</div>
			<NumberPicker defaultValue={initRadius}
										min={0.01}
										step={0.01}
										onChange={initRadius => setInputConfig({...inputConfig, initRadius})}
			/>
			<div className='label'>Speed factor</div>
			<NumberPicker defaultValue={speedFactor}
										min={0.1}
										step={0.0001}
										onChange={speedFactor => setInputConfig({...inputConfig, speedFactor})}
			/>
			<div className='label'>Max precision: 1e-{maxPrecision}</div>
			<NumberPicker defaultValue={maxPrecision}
										min={1}
										step={1}
										onChange={maxPrecision => setInputConfig({...inputConfig, maxPrecision})}
			/>
			<div className='label'>Max collisions</div>
			<NumberPicker defaultValue={maxCollisions}
										min={1}
										step={1}
										onChange={maxCollisions => setInputConfig({...inputConfig, maxCollisions})}
			/>
		</div>
	)

};

export default InputConfigCmp;
