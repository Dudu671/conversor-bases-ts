import Swal from "sweetalert2";

export function updateBaseGroupState(group: HTMLDivElement, activeBase: number) {
	const buttons = group.querySelectorAll<HTMLButtonElement>("button");
	const inputBase = group.querySelector<HTMLInputElement>("input")!;

	let matchedButton = false;

	buttons.forEach((btn) => {
		const value = parseInt(btn.dataset.value ?? "0");
		const isActive = value === activeBase;
		btn.classList.toggle("active", isActive);
		if (isActive) matchedButton = true;
	});

	if (matchedButton || inputBase.value === "") {
		inputBase.classList.remove("active");
	} else {
		inputBase.classList.add("active");
	}
}

export function toggleInputStyle(input: HTMLInputElement | HTMLTextAreaElement, color: "red" | "transparent", shouldTilt = false) {
	input.style.borderColor = color;
	if (shouldTilt) {
		input.animate([{ transform: "rotate(2deg)" }, { transform: "rotate(-2deg)" }, { transform: "rotate(2deg)" }, { transform: "rotate(-2deg)" }, { transform: "rotate(0deg)" }], { duration: 300, iterations: 1 });
	}
}

export function showAlert(title: string, text: string, icon: "success" | "error" | "warning" | "info" | "question") {
	Swal.fire({ title, text, icon, confirmButtonText: "OK" });
}
