const input = document.getElementById("terminal-input");

function typeWriterHTML(element, html, speed = 2) {
	return new Promise((resolve) => {
		let i = 0;
		let result = "";

		const cursor = document.createElement("span");
		cursor.className = "cursor";
		element.innerHTML = "";
		element.appendChild(cursor);

		function render() {
			element.innerHTML = result;
			element.appendChild(cursor);
		}

		function type() {
			if (i < html.length) {
				if (html[i] === "<") {
					let endTag = html.indexOf(">", i);
					if (endTag !== -1) {
						result += html.slice(i, endTag + 1);
						i = endTag + 1;
						render();
						setTimeout(type, speed);
						return;
					}
				} else {
					result += html.charAt(i);
					i++;
					render();
				}
				setTimeout(type, speed);
			} else {
				element.innerHTML = result;
				resolve();
			}
		}
		type();
	});	
}

let currentSectionId = "content-home";

async function showSection(id) {
	if (currentSectionId === id) return;
	currentSectionId = id;
	document.querySelectorAll(".content > div").forEach(sec => {
		sec.style.display = "none";
	});
	const section = document.getElementById(id);
	section.style.display = "block";
	if (id === "content-default") {
		const p = section.querySelector("p");
		await typeWriterHTML(p, p.innerHTML, 2);
	} else {
		const h2 = section.querySelector("h2");
		const p = section.querySelector("p");
		const h2HTML = h2.innerHTML;
		const pHTML = p.innerHTML;
		h2.innerHTML = "";
		p.innerHTML = "";
		await typeWriterHTML(h2, h2HTML, 2);
		await typeWriterHTML(p, pHTML, 2);
	}	
}

input.addEventListener("keydown", function (event) {
	if (event.key === "Enter") {
		const cmd = input.value.trim().toLowerCase();
		input.value = "";

		switch (cmd) {
			case "cd home":
				showSection("content-home"); break;
			case "cd about":
				showSection("content-about"); break;
			case "cd certs":
				showSection("content-certs"); break;
			case "cd books":
				showSection("content-books"); break;
			case "cd writeups":
				showSection("content-writeups"); break;
			case "cd contact":
				showSection("content-contact"); break;
			default:
				showSection("content-default");
		}
	}
});