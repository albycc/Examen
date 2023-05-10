import styled from "styled-components";
import { theme } from "../../themes/theme";
import Modal from "react-bootstrap/Modal";

export const ModalWindow = styled(Modal)`
	z-index: 1060;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.76);
	border-radius: 5px;
	border: 1px solid black;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
	align-self: center;
	justify-self: center;
	left: 0;
	right: 0;
	margin: auto;
	.modal-body{
		display: flex;
		justify-content: center;
	}
	.modal-header {
		border-bottom: 0 none;
		display: flex;
		justify-content: center;
	}

	.modal-footer {
		border-top: 0 none;
	}

	.modal-backdrop {
		background-color: rgba(0, 0, 0, 0.0001) !important;
	}
	.modal-dialog {
		top: 25%;
	}

	/* @media (max-width: 1450px) {
		.modal-content {
			width: 60%;
		}
	}
	@media (max-width: 1000px) {
		.modal-content {
			width: 70%;
		}
	}
	@media (max-width: 700px) {
		.modal-content {
			width: 80%;
		}
	}
	@media (max-width: 500px) {
		.modal-content {
			width: 90%;
		}
	} */
`;

// export const ModalHeader = styled(Modal.Header)`
// 	border-bottom: 0 none;
// `;

// export const ModalBody = styled(Modal.Body)`
// 	border-bottom: 0 none;
// `;

// export const ModalFooter = styled(Modal.Footer)`
// 	border-top: 0 none;
// `;