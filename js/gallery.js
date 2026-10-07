		const playerNames = [
			"Bruno Fernandes", "Marcus Rashford", "Alejandro Garnacho", "Kobbie Mainoo",
			"Mason Mount", "Amad Diallo", "Lisandro Martinez", "Andre Onana",
			"Harry Maguire", "Luke Shaw", "Rasmus Hojlund", "Casemiro"
		];

		const galleries = {
			players: playerNames.map((name) => ({ name, detail: "First-team player", wiki: name.replaceAll(" ", "_") })),
			stadium: [
				{ name: "Old Trafford", detail: "The Theatre of Dreams", query: "Old Trafford stadium Manchester" },
				{ name: "The Stretford End", detail: "Home of the singing section", query: "Stretford End Old Trafford" },
				{ name: "Sir Alex Ferguson Stand", detail: "A stand named for a legend", query: "Old Trafford Sir Alex Ferguson Stand" },
				{ name: "The pitch", detail: "Where the stories happen", query: "Old Trafford pitch Manchester United" }
			],
			legends: [
				{ name: "Sir Bobby Charlton", detail: "A defining United great", wiki: "Bobby_Charlton" },
				{ name: "George Best", detail: "The fifth Beatle", wiki: "George_Best" },
				{ name: "Eric Cantona", detail: "The King", wiki: "Eric_Cantona" },
				{ name: "David Beckham", detail: "Academy graduate | No. 7", wiki: "David_Beckham" },
				{ name: "Wayne Rooney", detail: "United's record goalscorer", wiki: "Wayne_Rooney" },
				{ name: "Cristiano Ronaldo", detail: "A global icon in red", wiki: "Cristiano_Ronaldo" },
				{ name: "Ryan Giggs", detail: "A one-club career", wiki: "Ryan_Giggs" },
				{ name: "Roy Keane", detail: "Captain and competitor", wiki: "Roy_Keane" }
			],
			trophies: [
				{ name: "European Cup", detail: "Champions of Europe | 1968", query: "Manchester United 1968 European Cup trophy" },
				{ name: "Treble", detail: "Three trophies | one historic season", query: "Manchester United treble trophies 1999" },
				{ name: "Premier League", detail: "League champions", query: "Premier League trophy Manchester United" },
				{ name: "FA Cup", detail: "The world's oldest cup competition", query: "FA Cup trophy Manchester United" }
			],
			fans: [
				{ name: "Matchday", detail: "Red shirts, full voices", query: "Manchester United fans Old Trafford" },
				{ name: "The away end", detail: "United wherever we go", query: "Manchester United away fans" },
				{ name: "Generations", detail: "Passed down, never lost", query: "Manchester United supporters family" },
				{ name: "All together", detail: "One club. One community.", query: "Manchester United fans stadium" }
			]
		};

		const labels = {
			players: "First-team favourites",
			stadium: "Our home",
			legends: "Forever United",
			trophies: "Silverware and history",
			fans: "The 12th player"
		};

		const gallery = document.querySelector("#gallery");
		const tabs = [...document.querySelectorAll("[role=tab]")];
		const lightbox = document.querySelector("#lightbox");
		const lightboxImage = document.querySelector("#lightbox-image");
		const lightboxCaption = document.querySelector("#lightbox-caption");
		let activeItems = [];
		let activeIndex = 0;
		let lastFocusedElement = null;
		const imageCache = new Map();
		const imageQueue = [];
		let activeImageRequests = 0;

		function imageUrl(item) {
			if (item.wiki) {
				return `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.wiki)}`;
			}
			const query = encodeURIComponent(item.query);
			return `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json&origin=*`;
		}

		function fetchImageData(url) {
			return new Promise((resolve, reject) => {
				imageQueue.push({ url, resolve, reject });
				processImageQueue();
			});
		}

		function processImageQueue() {
			while (activeImageRequests < 1 && imageQueue.length) {
				const request = imageQueue.shift();
				activeImageRequests += 1;
				fetch(request.url)
					.then(async (response) => {
						if (response.status === 429) {
							const retryAfter = Number(response.headers.get("Retry-After")) || 1;
							await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter * 1000, 5000)));
							response = await fetch(request.url);
						}
						if (!response.ok) throw new Error(`Image lookup failed (${response.status})`);
						return response.json();
					})
					.then(request.resolve, request.reject)
					.finally(() => {
						activeImageRequests -= 1;
						processImageQueue();
					});
			}
		}

		async function getImage(item) {
			if (imageCache.has(item.name)) return imageCache.get(item.name);
			try {
				const data = await fetchImageData(imageUrl(item));
				const url = item.wiki
					? data.thumbnail?.source
					: Object.values(data.query?.pages || {})[0]?.imageinfo?.[0]?.thumburl;
				if (!url) throw new Error("No image found");
				imageCache.set(item.name, url);
				return url;
			} catch (error) {
				console.warn(`Could not load gallery image for ${item.name}.`, error);
				return "";
			}
		}

		function initials(name) {
			return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
		}

		function makeTile(item, index) {
			const button = document.createElement("button");
			button.className = "tile";
			button.type = "button";
			button.setAttribute("aria-label", `View ${item.name}: ${item.detail}`);
			button.innerHTML = `<span class="fallback" aria-hidden="true">${initials(item.name)}</span><span class="caption"><strong></strong><span></span></span>`;
			button.querySelector(".caption strong").textContent = item.name;
			button.querySelector(".caption span").textContent = item.detail;
			button.addEventListener("click", () => openLightbox(index));
			gallery.append(button);

			getImage(item).then((url) => {
				if (!url || !button.isConnected) return;
				const image = new Image();
				image.alt = "";
				image.loading = "lazy";
				image.src = url;
				image.addEventListener("load", () => {
					button.replaceChildren(image, button.querySelector(".caption"));
				}, { once: true });
			});
		}

		function renderGallery(category) {
			activeItems = galleries[category];
			gallery.replaceChildren();
			gallery.setAttribute("aria-labelledby", `tab-${category}`);
			document.querySelector("#category-label").textContent = labels[category];
			document.querySelector("#image-count").textContent = `${activeItems.length} images`;
			tabs.forEach((tab) => {
				const selected = tab.dataset.category === category;
				tab.setAttribute("aria-selected", String(selected));
				tab.tabIndex = selected ? 0 : -1;
			});
			activeItems.forEach(makeTile);
		}

		function showImage(index) {
			activeIndex = (index + activeItems.length) % activeItems.length;
			const item = activeItems[activeIndex];
			lightboxImage.src = imageCache.get(item.name) || "";
			lightboxImage.alt = item.name;
			lightboxCaption.textContent = `${item.name} | ${item.detail}`;
			getImage(item).then((url) => {
				if (url && !lightbox.hidden && activeItems[activeIndex] === item) lightboxImage.src = url;
			});
		}

		function openLightbox(index) {
			lastFocusedElement = document.activeElement;
			lightbox.hidden = false;
			document.body.style.overflow = "hidden";
			showImage(index);
			lightbox.querySelector("[data-action=close]").focus();
		}

		function closeLightbox() {
			lightbox.hidden = true;
			lightboxImage.removeAttribute("src");
			document.body.style.overflow = "";
			lastFocusedElement?.focus();
		}

		tabs.forEach((tab, index) => {
			tab.addEventListener("click", () => renderGallery(tab.dataset.category));
			tab.addEventListener("keydown", (event) => {
				if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
				event.preventDefault();
				const direction = event.key === "ArrowRight" ? 1 : -1;
				const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
				nextTab.focus();
				renderGallery(nextTab.dataset.category);
			});
		});

		lightbox.addEventListener("click", (event) => {
			const action = event.target.closest("[data-action]")?.dataset.action;
			if (action === "close") closeLightbox();
			if (action === "previous") showImage(activeIndex - 1);
			if (action === "next") showImage(activeIndex + 1);
			if (event.target === lightbox) closeLightbox();
		});

		document.addEventListener("keydown", (event) => {
			if (lightbox.hidden) return;
			if (event.key === "Escape") closeLightbox();
			if (event.key === "ArrowLeft") showImage(activeIndex - 1);
			if (event.key === "ArrowRight") showImage(activeIndex + 1);
			if (event.key === "Tab") {
				const controls = [...lightbox.querySelectorAll("button:not(:disabled)")];
				const firstControl = controls[0];
				const lastControl = controls[controls.length - 1];

				if (event.shiftKey && document.activeElement === firstControl) {
					event.preventDefault();
					lastControl.focus();
				} else if (!event.shiftKey && document.activeElement === lastControl) {
					event.preventDefault();
					firstControl.focus();
				}
			}
		});

		renderGallery("players");