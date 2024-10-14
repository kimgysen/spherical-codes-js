import {FC} from "react";
import {MaxRadiusOpts} from "../../../../common/lib/MaxRadiusLib";
import Switch from "react-switch";
import './ConfigCmp.css';
import {NumberPicker} from "react-widgets/cjs";


interface OptionsConfigCmpProps {
	opts: MaxRadiusOpts;
	setOpts: (opts: MaxRadiusOpts) => void;
}

const OptionsConfigCmp: FC<OptionsConfigCmpProps> = ({opts, setOpts}) => {
	return (
		<div className={'container'}>
			<div className='label'>Use timeout?</div>
			<Switch
				onChange={(isChecked) => setOpts({...opts, useTimeout: isChecked})}
				checked={opts.useTimeout}
				checkedIcon={false}
				uncheckedIcon={false}
				height={20}
				width={35}
			/>
			{
				opts.useTimeout && (
					<>
						<div className='label'>Timeout (sec)</div>
						<NumberPicker defaultValue={opts.timeoutMs / 1000}
													min={1}
													step={1}
													onChange={timeoutSec => setOpts({...opts, timeoutMs: timeoutSec * 1000})}
						/>
					</>
				)
			}
			<div className='label'>Use step interval?</div>
			<Switch
				onChange={(isChecked) => setOpts({...opts, useCallback: isChecked})}
				checked={opts.useCallback}
				checkedIcon={false}
				uncheckedIcon={false}
				height={20}
				width={35}
			/>
			{
				opts.useCallback && (
					<>
						<div className='label'>Step interval (ms)</div>
						<NumberPicker defaultValue={opts.stepIntervalMs}
													min={1}
													step={1}
													onChange={stepIntervalMs => setOpts({...opts, stepIntervalMs})}
						/>
					</>
				)
			}
		</div>
	)
}

export default OptionsConfigCmp;
