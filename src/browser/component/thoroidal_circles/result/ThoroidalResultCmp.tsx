import {MaxRadiusResult} from "../../../../common/lib/MaxRadiusLib";
import {FC, useState} from "react";
import Point from "../../../../common/domain/Point";
import ModalCmp from "../../widget/modal/ModalCmp";
import {scaleCircles} from "../thoroidal_circles/ThoroidalSpaceHelper";


interface ThoroidalResultCmpProps {
	pointsBefore: Point[];
	result: MaxRadiusResult;
	scalePx: number;
}

const ThoroidalResultCmp: FC<ThoroidalResultCmpProps> = ({pointsBefore, result, scalePx}) => {

	const [pointsBeforeModalIsOpen, setPointsBeforeModalOpen] = useState(false);
	const [pointsAfterModalIsOpen, setPointsAfterModalOpen] = useState(false);

	const {maxRadius, circles, foundInMs} = result;

	const closePointsBeforeJsonModal = () => {
		setPointsBeforeModalOpen(false);
	}

	const closePointsAfterJsonModal = () => {
		setPointsAfterModalOpen(false);
	}

	return (
		<>
			<ul className='result'>
				<li>
					<button className='button' onClick={() => setPointsBeforeModalOpen(true)}>
						Show points before
					</button>
				</li>
				<li>
					<button className='button' onClick={() => setPointsAfterModalOpen(true)}>
						Show points after
					</button>
				</li>
				<li>
					<button className='button'>
						Show contact graph
					</button>
				</li>
				<li>
					<button className='button'>
						Show full size
					</button>
				</li>
			</ul>
			<ModalCmp isOpen={pointsBeforeModalIsOpen} closeModal={closePointsBeforeJsonModal}>
				<div className='json-format'>
					<pre>
						{JSON.stringify(scaleCircles(pointsBefore, scalePx), null, 2)}
					</pre>
				</div>
			</ModalCmp>
			<ModalCmp isOpen={pointsAfterModalIsOpen} closeModal={closePointsAfterJsonModal}>
				<div className='json-format'>
					<pre>
						{JSON.stringify(result?.circles, null, 2)}
					</pre>
				</div>
			</ModalCmp>
		</>
	)
}

export default ThoroidalResultCmp;
