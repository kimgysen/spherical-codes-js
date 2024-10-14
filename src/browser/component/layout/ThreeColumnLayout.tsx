import {FC} from "react";

interface ThreeColumnLayoutProps {
	leftCmp: React.ReactNode;
	centerCmp: React.ReactNode;
	rightCmp: React.ReactNode;
}

const ThreeColumnLayout: FC<ThreeColumnLayoutProps> = ({leftCmp, centerCmp, rightCmp}) => {
	return (
		<>
			<section className='left-section'>
				{leftCmp}
			</section>
			<section className='mid-section float-left'>
				{centerCmp}
			</section>
			<section className='right-section'>
				{rightCmp}
			</section>
		</>
	)
}

export default ThreeColumnLayout;
