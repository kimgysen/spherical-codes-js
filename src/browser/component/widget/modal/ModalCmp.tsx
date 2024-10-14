import Modal from "react-modal";
import {FC, ReactNode} from "react";

interface ModalCmpProps {
	isOpen: boolean;
	closeModal: () => void;
	children: ReactNode;
}


const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		maxHeight: '75%'
	},
};

const ModalCmp:FC<ModalCmpProps> = ({isOpen, closeModal, children}) => {

	const onRequestClose = () => {
		closeModal();
	}

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			style={customStyles}
			ariaHideApp={false}>
			{children}
		</Modal>
	)
}

export default ModalCmp;
